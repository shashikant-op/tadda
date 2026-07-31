import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                TA
              </div>
              <span className="font-bold text-lg tracking-tight">TutorialsAdda</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A premium engineering tutorial platform designed for developers and students to master modern technologies.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Branches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/computer-science" className="hover:text-primary">Computer Science</Link></li>
              <li><Link href="/web-development" className="hover:text-primary">Web Development</Link></li>
              <li><Link href="/ai-ml" className="hover:text-primary">Artificial Intelligence</Link></li>
              <li><Link href="/cloud-devops" className="hover:text-primary">Cloud & DevOps</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-primary">Search Tutorials</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Student Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-primary cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-primary cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-primary cursor-pointer">Contact Support</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TutorialsAdda Inc. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">Built with Next.js 16 & TypeScript ($200k+ SaaS Quality)</p>
        </div>
      </div>
    </footer>
  );
}
