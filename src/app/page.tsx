import GridBackground from "../components/GridBackground";

const CodeBlock = () => (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] font-mono text-sm shadow-2xl">
    <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
      <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
      <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
      <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
      <div className="ml-2 text-xs font-medium text-zinc-500">
        augment_shield.py
      </div>
    </div>
    <div className="overflow-x-auto p-6">
      <pre className="leading-relaxed text-zinc-300">
        <span className="text-purple-400">import</span> augment{"\n"}
        {"\n"}
        <span className="text-zinc-500"># 1. Wrap your completion call</span>
        {"\n"}
        response = augment.guard({"\n"}
        {"  "}model=<span className="text-green-400">&quot;gpt-4o&quot;</span>,{"\n"}
        {"  "}messages=[{"{"}
        <span className="text-green-400">&quot;role&quot;</span>:{" "}
        <span className="text-green-400">&quot;user&quot;</span>,{" "}
        <span className="text-green-400">&quot;content&quot;</span>: user_input{"}"}],
        {"\n"}
        {"  "}checks=[<span className="text-green-400">&quot;hallucination&quot;</span>,{" "}
        <span className="text-green-400">&quot;jailbreak&quot;</span>,{" "}
        <span className="text-green-400">&quot;pii&quot;</span>]{"\n"}){"\n"}
        {"\n"}
        <span className="text-purple-400">if</span> response.flagged:{"\n"}
        {"  "}logger.warn(f
        <span className="text-green-400">
          &quot;Blocked: &#123;response.reason&#125;&quot;
        </span>
        ){"\n"}
        {"  "}
        <span className="text-purple-400">return</span>{" "}
        <span className="text-green-400">&quot;I cannot answer that.&quot;</span>
        {"\n"}
        <span className="text-purple-400">else</span>:{"\n"}
        {"  "}
        <span className="text-purple-400">return</span> response.content
      </pre>
    </div>
  </div>
);

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => (
  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:bg-white/[0.04]">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    <div className="relative z-10">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
    </div>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col border-l border-white/10 pl-6">
    <span className="text-2xl font-bold tracking-tight text-white">
      {value}
    </span>
    <span className="mt-1 text-xs font-medium tracking-wider text-zinc-500 uppercase">
      {label}
    </span>
  </div>
);

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <GridBackground />

      {/* Navbar Placeholder */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold tracking-tight text-white">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            AugmentWorks
          </div>
          <div className="flex gap-6 text-sm font-medium text-zinc-400">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#docs" className="transition-colors hover:text-white">
              Docs
            </a>
            <a
              href="mailto:sales@augmentworks.com"
              className="text-white transition-colors hover:text-blue-400"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="px-6 pt-32 pb-20">
          <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
                Enterprise Safety Layer
              </div>

              <h1 className="text-5xl leading-[1.1] font-bold tracking-tight text-white sm:text-6xl">
                Ship AI Agents,
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-blue-100 bg-clip-text text-transparent">
                  Sleep At Night.
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-zinc-400">
                The firewall for your LLM. Detect jailbreaks, block
                hallucinations, and audit every interaction in real-time with{" "}
                <span className="font-medium text-white">20ms latency</span>.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200">
                  Start Integration
                </button>
                <button className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/5">
                  Read Documentation
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <Stat label="Latency Overhead" value="<20ms" />
                <Stat label="False Positives" value="<0.1%" />
                <Stat label="Compliance" value="SOC2" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl" />
              <CodeBlock />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="border-t border-white/5 bg-black/20 py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16">
              <h2 className="mb-4 text-3xl font-bold text-white">
                The Safety Stack
              </h2>
              <p className="max-w-2xl text-zinc-400">
                Don&rsquo;t build your own guardrails. We provide the infrastructure
                to measure, monitor, and secure your LLM outputs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon="🛡️"
                title="Runtime Defense"
                desc="Real-time interception of prompt injections and jailbreaks before they hit your model. The only firewall built for semantic attacks."
              />
              <FeatureCard
                icon="🩺"
                title="Hallucination Monitor"
                desc="Instant RAG grounding checks. If your agent cites a policy that doesn&rsquo;t exist in your context window, we block it."
              />
              <FeatureCard
                icon="🧪"
                title="CI/CD Evals"
                desc="Prevent regression. Run 500+ automated test cases on every pull request to ensure prompt changes don&rsquo;t break safety."
              />
            </div>
          </div>
        </section>

        {/* Trust / ICP Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-white">
                  Built for High-Stakes Agents
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      title: "Fear of Embarrassment",
                      desc: "Stop your agent from inventing pricing or hallucinating features in front of enterprise customers.",
                    },
                    {
                      title: "Fear of Liability",
                      desc: "Prevent PII leaks and rogue actions. Audit logs for every single token generated.",
                    },
                    {
                      title: "Engineering Rigor",
                      desc: "Move beyond &lsquo;vibe checks&rsquo;. Quantify reliability with a 0-100 score before you deploy.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="h-full min-h-[3rem] w-1 rounded-full bg-white/10" />
                      <div>
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-sm text-zinc-400">
                      Reliability Score
                    </span>
                    <span className="font-mono font-bold text-green-400">
                      98.4%
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Jailbreak Attempts Blocked",
                        val: "24",
                        color: "text-red-400",
                      },
                      {
                        label: "Hallucinations Caught",
                        val: "12",
                        color: "text-orange-400",
                      },
                      {
                        label: "PII Redacted",
                        val: "156",
                        color: "text-blue-400",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-zinc-500">
                          {stat.label}
                        </span>
                        <span className={`font-mono text-sm ${stat.color}`}>
                          {stat.val}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[98%] bg-green-500" />
                    </div>
                    <p className="mt-2 text-right text-xs text-zinc-600">
                      Last 24h Window
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 px-6 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Ready to audit your AI?
            </h2>
            <p className="mb-10 text-xl text-zinc-400">
              Stop guessing. Get a full report on your agent&rsquo;s vulnerabilities
              today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:sales@augmentworks.com"
                className="w-full rounded-lg bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-500 sm:w-auto"
              >
                Get Early Access
              </a>
              <p className="text-sm text-zinc-500">
                No credit card required. SOC2 Ready.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 bg-[#020202] py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <div className="text-sm text-zinc-500">
              © 2025 AugmentWorks Inc.
            </div>
            <div className="flex gap-6 text-sm text-zinc-600">
              <a href="#" className="hover:text-zinc-400">
                Privacy
              </a>
              <a href="#" className="hover:text-zinc-400">
                Terms
              </a>
              <a href="#" className="hover:text-zinc-400">
                Twitter
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
