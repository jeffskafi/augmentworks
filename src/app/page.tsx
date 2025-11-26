import BlobField from "../components/BlobField";

const stats = [
  { label: "Total Target Income", value: "$500k" },
  { label: "Deals Needed in 2027", value: "10" },
  { label: "Enterprise Day Job Base", value: "$220k–$250k" },
  { label: "Business Gap to Close", value: "$250k+" },
];

const auditDeliverables = [
  "Manual review of the last 500 AI tickets",
  "CSV catalog of hallucinations + policy breaches",
  "Executive-ready PDF of guardrail recommendations",
  "Prioritized remediation sprints for internal teams",
];

const governanceBenefits = [
  "Quarterly assurance reports tied to real usage data",
  "Integrated policy engine + playbooks for GenAI launches",
  "Incident response workflows that satisfy GRC & Legal",
  "Seat at the table with security, legal, and product leaders",
];

const revenueMix = [
  { title: "6 SaaS retainers @ $30k", detail: "$180k predictable MRR" },
  { title: "4 Audits @ $15k", detail: "$60k high-margin services" },
  { title: "Day job floor", detail: "$220k–$250k Staff IC comp" },
];

const guaranteeSteps = [
  {
    title: "Lead with the Audit",
    copy:
      "The $5k–$10k AI Safety Audit is the wedge. It removes procurement risk and pays for itself in exposure alone.",
  },
  {
    title: "Attach Governance",
    copy:
      "Every audit includes a governed backlog. When they need continuity, AugmentWorks Governance becomes the default quarterly retainer.",
  },
  {
    title: "Retain Higher Prices",
    copy:
      "No volume SaaS pricing. Every relationship is positioned as risk assurance, and risk budgets are 5–10× ops tooling budgets.",
  },
];

export default function HomePage() {
  return (
    <main className="relative mx-auto flex flex-1 w-full max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-slate-100">
      <BlobField />
      <div className="relative z-10 w-full space-y-16">
        <section className="text-center space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            The Core Pivot · Fewer Clients · Higher Prices · Hybrid Model
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            AugmentWorks Governance
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-slate-200">
            You stop selling cheap support tooling. You start selling{" "}
            <span className="text-cyan-200 font-semibold">
              AI Governance &amp; Compliance Assurance
            </span>
            . The offer blends enterprise retainers with a funded product
            roadmap so you only need ten closed deals in 2027—not twenty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="mailto:sales@augmentworks.com?subject=AI%20Safety%20Audit"
              className="btn glass-btn px-6 py-3 font-semibold"
            >
              Book the Safety Audit
            </a>
            <a
              href="#offerings"
              className="px-6 py-3 font-semibold text-cyan-200 hover:text-white transition"
            >
              Explore the Offerings
            </a>
          </div>
          <p className="text-sm text-slate-400">
            Guaranteed path: $240k from the business + $250k day job base =
            ~$500k.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-6 text-left">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section id="offerings" className="space-y-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
              Pricing &amp; Packaging
            </p>
            <h2 className="text-3xl font-bold text-white">
              Two Offers. One Governance Ladder.
            </h2>
            <p className="max-w-3xl text-slate-200">
              The wedge is a one-time AI Safety Audit. The retainer is the
              AugmentWorks Governance platform—policy automation plus a named
              expert who owns the risk queue.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="glass rounded-3xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    AI Safety Audit
                  </h3>
                  <p className="text-sm uppercase tracking-wide text-slate-400">
                    $5k–$10k one-time · 2-week turnaround
                  </p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Entry Product
                </span>
              </div>
              <p className="text-slate-200">
                Manual, uncomfortable, thorough. You investigate 500 recent AI
                tickets and hand leadership a prioritized risk dossier.
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
                {auditDeliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="glass rounded-3xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    AugmentWorks Governance
                  </h3>
                  <p className="text-sm uppercase tracking-wide text-slate-400">
                    $2.5k/mo billed quarterly · $25k/yr annual
                  </p>
                </div>
                <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">
                  Retainer SaaS
                </span>
              </div>
              <p className="text-slate-200">
                The hybrid model: software visibility + human accountability.
                If they decline the platform, they still buy the audit. If they
                buy the platform, the audit becomes onboarding.
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
                {governanceBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="glass rounded-3xl p-8 md:p-10 space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-200">
              The Math to $500k
            </p>
            <h2 className="text-3xl font-bold text-white">
              Ten total deals. Zero anxiety.
            </h2>
            <p className="text-slate-200 max-w-3xl">
              You guarantee the revenue by limiting the surface area. Staff/IC
              compensation covers living expenses; the business only has to add
              $250k–$280k. That’s six SaaS retainers plus four audits—nothing
              more.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {revenueMix.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-wide text-slate-400">
                  {item.title}
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {guaranteeSteps.map((step) => (
            <article key={step.title} className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm text-slate-200">{step.copy}</p>
            </article>
          ))}
        </section>

        <section className="glass rounded-3xl p-8 text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
            Ready to execute
          </p>
          <h2 className="text-3xl font-bold text-white">
            Stop chasing volume. Start owning AI risk.
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto">
            You only need ten serious conversations to land ten serious deals.
            Let’s overhaul your offer, your pricing, and your revenue mix in the
            next sprint.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <a
              href="mailto:sales@augmentworks.com?subject=Schedule%20an%20AI%20Governance%20Audit"
              className="btn glass-btn px-6 py-3 font-semibold"
            >
              Schedule a Working Session
            </a>
            <a
              href="https://cal.com/"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 font-semibold text-cyan-200 hover:text-white transition"
            >
              Hold a 15-minute slot
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
