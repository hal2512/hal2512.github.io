import { Link, useLocation } from "react-router-dom";

export function Nav() {
  const location = useLocation();
  
  const links: { href: string; label: string; short?: string }[] = [
    { href: "/", label: "Resume" },
    { href: "/journey", label: "AI Agent Journey", short: "Journey" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="h-[44px] flex items-center justify-center px-4 bg-[hsl(30,25%,95%)] border-b border-[hsl(30,15%,88%)] overflow-x-auto">
      <div className="flex items-center gap-5 sm:gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`font-sans text-[13px] sm:text-sm tracking-wide whitespace-nowrap transition-colors ${
              (link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href))
                ? "text-[hsl(30,10%,15%)]"
                : "text-[hsl(30,10%,50%)] hover:text-[hsl(30,10%,15%)]"
            }`}
          >
            {link.short ? (
              <>
                <span className="sm:hidden">{link.short}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </>
            ) : (
              link.label
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
