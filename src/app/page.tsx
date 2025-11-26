import BlobField from "../components/BlobField";

const heroStats = [
  { label: "Latency Budget", value: "<20ms" },
  { label: "Hallucination Goal", value: "<1%" },
  { label: "Target Agents", value: "Transactional B2B" },
  { label: "Coverage", value: "Defense · Monitoring · Eval" },
];

const problemStatements = [
  {
    title: "Fear of Embarrassment (FoE)",
    detail: "Agents hallucinate policies, invent pricing, or cite non-existent facts in front of customers.",
  },
  {
    title: "Fear of Liability (FoL)",
    detail: "PII leaks, jailbreak-driven discounts, and rogue actions can create seven-figure legal exposure.",
  },
  {
    title: "Regression Chaos",
    detail: "Every prompt tweak risks breaking something else. Teams lack a systematic way to measure quality before launch.",
  },
];

const pillars = [
  {
    icon: "🛡️",
    title: "Defense · Runtime",
    copy: "Real-time interception of malicious inputs, prompt injections, and jailbreak attempts.",
  },
  {
    icon: "🩺",
    title: "Monitoring · Runtime",
    copy: "Instant hallucination and groundedness checks on every output with contextual validation.",
  },
  {
    icon: "🧪",
    title: "Evaluations · Pre-Deployment",
    copy: "Automated test suites to catch regressions before a new agent or prompt set ships.",
  },
];

const icpBullets = [
  {
    label: "Persona",
    value: "CTOs, Heads of AI, Lead Engineers tasked with GenAI rollout.",
  },
  {
    label: "Company Stage",
    value: "Series A/B startups ($10M–$50M valuation) or mid-market tech.",
  },
  {
    label: "Sectors",
    value: "Fintech, LegalTech, EdTech, and high-stakes B2B SaaS.",
  },
  {
    label: "Triggers",
    value: "Just shipped an agent, hiring AI engineers, or recovering from a public hallucination.",
  },
];

const featureBlocks = [
  {
    title: 'Augment Shield SDK',
    eyebrow: '"Drop-in runtime firewall"',
    description:
      "Python/Node wrappers that sit between users and the LLM. Developers wrap their existing OpenAI/Anthropic calls in minutes.",
    bullets: [
      "Input scanning for PII, jailbreaks, and toxic intent before tokens hit the model.",
      "Output verification that confirms answers are grounded in the provided context.",
      "Latency budgeting with <20ms overhead so CX teams stay happy.",
    ],
  },
  {
    title: "Evaluation Suite",
    eyebrow: "CI/CD for prompts",
    description:
      "Define gold datasets, run 500+ regression tests on every diff, and simulate adversarial attacks before prod deploys.",
    bullets: [
      "Semantic scoring for helpfulness, tone, and conciseness—not just keyword matching.",
      "Continuous integration hook that blocks merges if the reliability score drops.",
      "Battle testing harness that stress-tests for prompt injection and jailbreaks.",
    ],
  },
  {
    title: '"Sleep at Night" Dashboard',
    eyebrow: "From incidents to action",
    description:
      "One command center for runtime assurance. If something is blocked, the team sees it instantly and feeds it back into evals.",
    bullets: [
      "Incident feed with step-by-step traces of every intercepted request.",
      "Reliability Score (0-100) that proves to leadership the agent is stable.",
      "SOC2-ready audit logs with full lineage across prompts, data, and responses.",
    ],
  },
];

const journeySteps = [
  {
    title: "Install",
    detail: "pip install augmentworks — wrap your existing OpenAI/Anthropic call with the Shield SDK.",
  },
  {
    title: "Configure",
    detail: 'Select the checks that matter (e.g., checks=["jailbreak", "hallucination"]).',
  },
  {
    title: "Deploy",
    detail: "Ship the agent. AugmentWorks quietly monitors every turn without hurting latency.",
  },
  {
    title: "Alert & Block",
    detail: "A user attempts a jailbreak. AugmentWorks blocks it, returns a safe response, and pings Slack/Email.",
  },
  {
    title: "Iterate",
    detail: "The team reviews the event in the dashboard, adds it to evals, and makes the next release safer.",
  },
];

const differentiators = [
  {
    title: "Active Defense > Observability",
    copy: "LangSmith/Arize give you charts after the fact. AugmentWorks blocks the attack in-flight and proves it.",
  },
  {
    title: "Automation > Spreadsheets",
    copy: "Manual prompt reviews and CSV trackers fail past 20 tests. Our eval harness scales to hundreds automatically.",
  },
  {
    title: "Accuracy > Creativity",
    copy: "Optimized for transactional, high-stakes B2B agents—not playful storytelling assistants.",
  },
];

const kpis = [
  { label: "Blocked Threats", detail: "Count of jailbreaks / PII leaks intercepted per month." },
  { label: "Hallucination Rate", detail: "Responses flagged as ungrounded; goal is <1%." },
  { label: "Latency Impact", detail: "Average runtime overhead stays under 20ms." },
  { label: "Developer Trust", detail: "Teams report they shipped to prod because AugmentWorks existed." },
];

export default function HomePage() {
  return (
    <main className="relative mx-auto flex flex-1 w-full max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-slate-100">
      <BlobField />
      <div className="relative z-10 w-full space-y-16">
        <section className="text-center space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Product Brief · AugmentWorks
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Ship AI Agents. Sleep at Night.
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-slate-200">
            AugmentWorks is the safety infrastructure layer for enterprises deploying GenAI in production.
            We are the firewall, QA harness, and audit trail that guarantees reliability, accuracy, and security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="mailto:sales@augmentworks.com?subject=AugmentWorks%20Brief"
              className="btn glass-btn px-6 py-3 font-semibold"
            >
              Talk to an Engineer
            </a>
            <a
              href="#product-brief"
              className="px-6 py-3 font-semibold text-cyan-200 hover:text-white transition"
            >
              Read the Product Brief
            </a>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-6 text-left">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section id="product-brief" className="grid gap-6 lg:grid-cols-3">
          {problemStatements.map((problem) => (
            <article key={problem.title} className="glass rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200 mb-3">
                The Problem
              </p>
              <h3 className="text-xl font-semibold text-white">{problem.title}</h3>
              <p className="mt-3 text-sm text-slate-200">{problem.detail}</p>
            </article>
          ))}
        </section>

        <section className="space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
              The Solution
            </p>
            <h2 className="text-3xl font-bold text-white">A safety layer between users and your LLM.</h2>
            <p className="text-slate-200 max-w-3xl mx-auto">
              AugmentWorks sits inline with every AI interaction, acting as both firewall and quality assurance platform.
              We combine real-time controls with pre-deployment rigor so you can ship agents without fear.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="glass rounded-3xl p-6 text-center space-y-3">
                <p className="text-3xl" aria-hidden>
                  {pillar.icon}
                </p>
                <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                <p className="text-sm text-slate-200">{pillar.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
              Ideal Customer Profile
            </p>
            <h2 className="text-3xl font-bold text-white">Who we serve.</h2>
            <p className="text-slate-200 max-w-3xl">
              High-stakes, high-growth teams that cannot afford a public hallucination. If accuracy beats creativity in your board deck, you are our customer.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {icpBullets.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="mt-2 text-base font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-200">Key Capabilities</p>
            <h2 className="text-3xl font-bold text-white">Platform components.</h2>
            <p className="max-w-3xl text-slate-200">
              Every module is built for engineers who need active defense, quality gates, and executive-grade reporting.
            </p>
          </div>

          <div className="grid gap-6">
            {featureBlocks.map((feature) => (
              <article key={feature.title} className="glass rounded-3xl p-8 space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">{feature.eyebrow}</p>
                    <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                  </div>
                </div>
                <p className="text-slate-200">{feature.description}</p>
                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
                  {feature.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl p-8 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">User Journey</p>
            <h2 className="text-3xl font-bold text-white">From install to iteration.</h2>
            <p className="text-slate-200">
              The AugmentWorks loop embeds safety from day zero and keeps shipping velocity high.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {journeySteps.map((step, idx) => (
              <article key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold text-cyan-200">Step {idx + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {differentiators.map((item) => (
            <article key={item.title} className="glass rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-200">
                Competitive Edge
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-200">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Success Metrics</p>
            <h2 className="text-3xl font-bold text-white">KPIs we own.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-wide text-slate-400">{kpi.label}</p>
                <p className="mt-3 text-base text-slate-200">{kpi.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl p-8 text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Next Step</p>
          <h2 className="text-3xl font-bold text-white">
            Put a safety layer between your users and the LLM.
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Schedule a working session with the AugmentWorks engineering team. We will walk your prompts, identify
            failure modes, and hand you a plan to ship confidently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <a
              href="mailto:sales@augmentworks.com?subject=Schedule%20an%20AugmentWorks%20Evaluation"
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

