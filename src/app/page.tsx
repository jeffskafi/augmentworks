import GridBackground from "../components/GridBackground";

const CodeBlock = () => (
  <div className="rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden font-mono text-sm">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
      <div className="ml-2 text-xs text-zinc-500 font-medium">augment_shield.py</div>
    </div>
    <div className="p-6 overflow-x-auto">
      <pre className="text-zinc-300 leading-relaxed">
        <span className="text-purple-400">import</span> augment{'\n'}
        {'\n'}
        <span className="text-zinc-500"># 1. Wrap your completion call</span>{'\n'}
        response = augment.guard({'\n'}
        {'  '}model=<span className="text-green-400">"gpt-4o"</span>,{'\n'}
        {'  '}messages=[{'{'}<span className="text-green-400">"role"</span>: <span className="text-green-400">"user"</span>, <span className="text-green-400">"content"</span>: user_input{'}'}],{'\n'}
        {'  '}checks=[<span className="text-green-400">"hallucination"</span>, <span className="text-green-400">"jailbreak"</span>, <span className="text-green-400">"pii"</span>]{'\n'}
        ){'\n'}
        {'\n'}
        <span className="text-purple-400">if</span> response.flagged:{'\n'}
        {'  '}logger.warn(f<span className="text-green-400">"Blocked: &#123;response.reason&#125;"</span>){'\n'}
        {'  '}<span className="text-purple-400">return</span> <span className="text-green-400">"I cannot answer that."</span>{'\n'}
        <span className="text-purple-400">else</span>:{'\n'}
        {'  '}<span className="text-purple-400">return</span> response.content
      </pre>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-8 hover:bg-white/[0.04] transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col border-l border-white/10 pl-6">
    <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">{label}</span>
  </div>
);

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <GridBackground />
      
      {/* Navbar Placeholder */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            AugmentWorks
          </div>
          <div className="flex gap-6 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
            <a href="mailto:sales@augmentworks.com" className="text-white hover:text-blue-400 transition-colors">Contact Sales</a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Enterprise Safety Layer
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Ship AI Agents,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-100">
                  Sleep At Night.
                </span>
              </h1>
              
              <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                The firewall for your LLM. Detect jailbreaks, block hallucinations, and audit every interaction in real-time with <span className="text-white font-medium">20ms latency</span>.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-all">
                  Start Integration
                </button>
                <button className="px-6 py-3 border border-white/10 text-zinc-300 rounded-lg font-semibold text-sm hover:bg-white/5 transition-all">
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
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 blur-xl" />
              <CodeBlock />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 border-t border-white/5 bg-black/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">The Safety Stack</h2>
              <p className="text-zinc-400 max-w-2xl">
                Don't build your own guardrails. We provide the infrastructure to measure, monitor, and secure your LLM outputs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon="🛡️"
                title="Runtime Defense"
                desc="Real-time interception of prompt injections and jailbreaks before they hit your model. The only firewall built for semantic attacks."
              />
              <FeatureCard 
                icon="🩺"
                title="Hallucination Monitor"
                desc="Instant RAG grounding checks. If your agent cites a policy that doesn't exist in your context window, we block it."
              />
              <FeatureCard 
                icon="🧪"
                title="CI/CD Evals"
                desc="Prevent regression. Run 500+ automated test cases on every pull request to ensure prompt changes don't break safety."
              />
            </div>
          </div>
        </section>

        {/* Trust / ICP Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Built for High-Stakes Agents</h2>
                <div className="space-y-6">
                  {[
                    { title: "Fear of Embarrassment", desc: "Stop your agent from inventing pricing or hallucinating features in front of enterprise customers." },
                    { title: "Fear of Liability", desc: "Prevent PII leaks and rogue actions. Audit logs for every single token generated." },
                    { title: "Engineering Rigor", desc: "Move beyond 'vibe checks'. Quantify reliability with a 0-100 score before you deploy." }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-1 h-full min-h-[3rem] bg-white/10 rounded-full" />
                      <div>
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-zinc-400 text-sm">Reliability Score</span>
                    <span className="text-green-400 font-mono font-bold">98.4%</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Jailbreak Attempts Blocked", val: "24", color: "text-red-400" },
                      { label: "Hallucinations Caught", val: "12", color: "text-orange-400" },
                      { label: "PII Redacted", val: "156", color: "text-blue-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex justify-between items-center">
                        <span className="text-sm text-zinc-500">{stat.label}</span>
                        <span className={`text-sm font-mono ${stat.color}`}>{stat.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-full w-[98%]" />
                    </div>
                    <p className="text-xs text-zinc-600 mt-2 text-right">Last 24h Window</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to audit your AI?</h2>
            <p className="text-xl text-zinc-400 mb-10">
              Stop guessing. Get a full report on your agent's vulnerabilities today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:sales@augmentworks.com"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all"
              >
                Get Early Access
              </a>
              <p className="text-sm text-zinc-500">
                No credit card required. SOC2 Ready.
              </p>
            </div>
          </div>
        </section>

        <footer className="py-8 border-t border-white/5 bg-[#020202]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-zinc-500 text-sm">© 2025 AugmentWorks Inc.</div>
            <div className="flex gap-6 text-sm text-zinc-600">
              <a href="#" className="hover:text-zinc-400">Privacy</a>
              <a href="#" className="hover:text-zinc-400">Terms</a>
              <a href="#" className="hover:text-zinc-400">Twitter</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}