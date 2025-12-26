import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20">
            <Shield className="size-6 text-primary" />
          </div>
          <span className="text-xl font-semibold">AgentReady</span>
        </div>

        <div className="space-y-6">
          <blockquote className="space-y-4">
            <p className="text-3xl font-light leading-relaxed text-slate-200">
              &ldquo;AgentReady&apos;s monitoring suite caught a critical
              hallucination pattern before it reached production. Invaluable for
              enterprise AI.&rdquo;
            </p>
            <footer className="text-sm text-slate-400">
              <span className="font-medium text-slate-300">Sarah Chen</span>
              <br />
              VP of Engineering, Fortune 500 Financial Services
            </footer>
          </blockquote>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>© 2024 AgentReady</span>
          <span>•</span>
          <a href="#" className="hover:text-slate-400">
            Privacy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-slate-400">
            Terms
          </a>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

