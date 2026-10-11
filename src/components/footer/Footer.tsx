import Link from "next/link";

const XIcon = (props: any) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-4">
               ContextNode
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
              The premier ecosystem for structured AI assets, context packs, and engineering workflows. Build faster with systemized AI.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
               <a href="#" className="hover:text-white transition-colors" aria-label="Twitter/X">
                 <XIcon className="w-4 h-4" />
               </a>
               <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                 <GithubIcon className="w-5 h-5" />
               </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Assets</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-white transition-colors">Context Packs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Prompts</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Workflows</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Agents</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground">
          <p>© 2026 ContextNode. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
             <span className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               All systems operational
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
