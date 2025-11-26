#!/usr/bin/env python3
"""
Namecheap domain availability checker.

Usage examples:
  export NAMECHEAP_API_USER=your_api_user
  export NAMECHEAP_API_KEY=your_api_key
  export NAMECHEAP_USERNAME=your_username   # optional; defaults to API user
  python3 script.py \
    --domains "example.com,example.org"

Or from a file (one domain per line):
  python3 script.py --domains-file domains.txt

Flags:
  --sandbox       Use Namecheap sandbox endpoint
  --no-premium    Do not annotate premium names
  --timeout N     HTTP timeout in seconds (default 20)
  --client-ip IP  Override detected public IP
"""

from __future__ import annotations

import argparse
import os
import sys
import urllib.parse
import urllib.request
import ssl
import xml.etree.ElementTree as ET
from typing import Iterable, List, Tuple, Dict, Optional


def get_public_ip(timeout: int = 20, *, context: Optional[ssl.SSLContext] = None) -> str:
    with urllib.request.urlopen("https://api.ipify.org", timeout=timeout, context=context) as resp:
        return resp.read().decode().strip()


def _strip_ns(tag: str) -> str:
    return tag.split("}", 1)[1] if tag.startswith("{") else tag


def parse_namecheap_response(xml_text: str) -> Dict[str, List[Tuple[str, bool]]]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        return {
            "errors": [f"XML parse error: {exc}"],
            "available": [],
            "taken": [],
        }

    errors: List[str] = []
    for el in root.iter():
        if _strip_ns(el.tag) == "Error" and el.text:
            errors.append(el.text.strip())

    rows: List[Tuple[str, bool, bool]] = []
    for el in root.iter():
        if _strip_ns(el.tag) == "DomainCheckResult":
            dom = (el.attrib.get("Domain", "") or "").lower()
            avail_attr = (el.attrib.get("Available", "false") or "false").lower()
            premium_attr = (el.attrib.get("IsPremiumName", "false") or "false").lower()
            is_available = avail_attr == "true"
            is_premium = premium_attr == "true"
            rows.append((dom, is_available, is_premium))

    rows.sort(key=lambda r: r[0])
    available = [(d, p) for d, a, p in rows if a]
    taken = [(d, p) for d, a, p in rows if not a]

    return {"errors": errors, "available": available, "taken": taken}


def check_domains(
    api_user: str,
    api_key: str,
    username: str,
    client_ip: str,
    domains: List[str],
    *,
    base_url: str,
    timeout: int = 20,
    context: Optional[ssl.SSLContext] = None,
) -> Dict[str, List[Tuple[str, bool]]]:
    results = {"errors": [], "available": [], "taken": []}  # type: ignore[assignment]

    # Namecheap allows up to 50 domains per request for this command.
    chunk_size = 50
    for i in range(0, len(domains), chunk_size):
        chunk = domains[i : i + chunk_size]
        params = {
            "ApiUser": api_user,
            "ApiKey": api_key,
            "UserName": username or api_user,
            "ClientIp": client_ip,
            "Command": "namecheap.domains.check",
            "DomainList": ",".join(chunk),
        }
        url = f"{base_url}?{urllib.parse.urlencode(params)}"

        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=timeout, context=context) as resp:
            xml_text = resp.read().decode()

        parsed = parse_namecheap_response(xml_text)
        results["errors"].extend(parsed["errors"])  # type: ignore[index]
        results["available"].extend(parsed["available"])  # type: ignore[index]
        results["taken"].extend(parsed["taken"])  # type: ignore[index]

    # Deduplicate while preserving order
    def _dedupe(items: Iterable[Tuple[str, bool]]) -> List[Tuple[str, bool]]:
        seen = set()
        out: List[Tuple[str, bool]] = []
        for d, p in items:
            if d in seen:
                continue
            seen.add(d)
            out.append((d, p))
        return out

    results["available"] = sorted(_dedupe(results["available"]), key=lambda x: x[0])  # type: ignore[index]
    results["taken"] = sorted(_dedupe(results["taken"]), key=lambda x: x[0])  # type: ignore[index]
    return results  # type: ignore[return-value]


def print_results(results: Dict[str, List[Tuple[str, bool]]], *, show_premium: bool = True) -> None:
    errors = results.get("errors", [])
    if errors:
        print("ERRORS:")
        for e in errors:
            print(" -", e)
        print()

    print("AVAILABLE:")
    for domain_name, is_premium in results.get("available", []):
        suffix = "  (premium)" if show_premium and is_premium else ""
        print(f"  - {domain_name}{suffix}")

    print()
    print("TAKEN:")
    for domain_name, is_premium in results.get("taken", []):
        suffix = "  (premium)" if show_premium and is_premium else ""
        print(f"  - {domain_name}{suffix}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Check domain availability via Namecheap API.")
    parser.add_argument("--domains", help="Comma-separated list of domains")
    parser.add_argument("--domains-file", help="Path to file with one domain per line")
    parser.add_argument("--api-user", default=os.getenv("NAMECHEAP_API_USER"), help="Namecheap API user (or env NAMECHEAP_API_USER)")
    parser.add_argument("--api-key", default=os.getenv("NAMECHEAP_API_KEY"), help="Namecheap API key (or env NAMECHEAP_API_KEY)")
    parser.add_argument(
        "--username",
        default=os.getenv("NAMECHEAP_USERNAME"),
        help="Namecheap username (defaults to api-user) (or env NAMECHEAP_USERNAME)",
    )
    parser.add_argument(
        "--client-ip",
        default=os.getenv("NAMECHEAP_CLIENT_IP"),
        help="Client IP to register with Namecheap (or env NAMECHEAP_CLIENT_IP). If not provided, detected via ipify.",
    )
    parser.add_argument("--sandbox", action="store_true", help="Use sandbox endpoint")
    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout in seconds (default 20)")
    parser.add_argument("--no-premium", action="store_true", help="Do not annotate premium domains")
    parser.add_argument("--insecure", action="store_true", help="Disable TLS certificate verification (not recommended)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if not args.domains and not args.domains_file:
        print("Provide --domains or --domains-file", file=sys.stderr)
        sys.exit(2)

    domains: List[str] = []
    if args.domains:
        for part in args.domains.split(","):
            dom = part.strip()
            if dom:
                domains.append(dom)

    if args.domains_file:
        try:
            with open(args.domains_file, "r", encoding="utf-8") as fh:
                for line in fh:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    dom = line.split()[0]
                    if dom:
                        domains.append(dom)
        except OSError as exc:
            print(f"Failed to read domains file: {exc}", file=sys.stderr)
            sys.exit(2)

    # Deduplicate while preserving order
    seen = set()
    domains = [d for d in domains if not (d in seen or seen.add(d))]
    if not domains:
        print("No domains provided", file=sys.stderr)
        sys.exit(2)

    api_user = args.api_user
    api_key = args.api_key
    username = args.username or api_user
    if not api_user or not api_key:
        print("Missing credentials: set --api-user and --api-key or NAMECHEAP_API_USER/NAMECHEAP_API_KEY", file=sys.stderr)
        sys.exit(2)

    client_ip = args.client_ip
    if not client_ip:
        try:
            # Prepare optional SSL context for ipify
            ip_context: Optional[ssl.SSLContext] = None
            if args.insecure:
                ip_context = ssl.create_default_context()
                ip_context.check_hostname = False
                ip_context.verify_mode = ssl.CERT_NONE
            client_ip = get_public_ip(timeout=args.timeout, context=ip_context)
        except Exception as exc:  # noqa: BLE001 - surface to terminal
            print(f"Failed to determine public IP: {exc}", file=sys.stderr)
            sys.exit(1)

    base_url = (
        "https://api.sandbox.namecheap.com/xml.response"
        if args.sandbox
        else "https://api.namecheap.com/xml.response"
    )

    try:
        # Optional SSL context for Namecheap request
        req_context: Optional[ssl.SSLContext] = None
        if args.insecure:
            req_context = ssl.create_default_context()
            req_context.check_hostname = False
            req_context.verify_mode = ssl.CERT_NONE
        results = check_domains(
            api_user=api_user,
            api_key=api_key,
            username=username,
            client_ip=client_ip,
            domains=domains,
            base_url=base_url,
            timeout=args.timeout,
            context=req_context,
        )
    except Exception as exc:  # noqa: BLE001 - surface to terminal
        print(f"HTTP error: {exc}", file=sys.stderr)
        sys.exit(1)

    print_results(results, show_premium=not args.no_premium)


if __name__ == "__main__":
    main()


