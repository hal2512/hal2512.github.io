import { Link, useLocation } from "react-router-dom";

export function Nav() {
  const location = useLocation();
  
  const links = [
    { href: "/", label: "Resume" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="h-[44px] flex items-center justify-center bg-[hsl(30,25%,95%)] border-b border-[hsl(30,15%,88%)]">
      <div className="flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`font-sans text-sm tracking-wide transition-colors ${
              location.pathname === link.href
                ? "text-[hsl(30,10%,15%)]"
                : "text-[hsl(30,10%,50%)] hover:text-[hsl(30,10%,15%)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
