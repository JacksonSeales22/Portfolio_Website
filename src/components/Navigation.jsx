import './Navigation.css';

export default function Navigation() {
  const navigationLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Blogs', href: '#blogs' },
    { label: 'Notes', href: '#notes' },
  ];

  return (
    <nav className="portfolio-nav" aria-label="Main navigation">
      <div className="nav-content">
        <div className="nav-title">Explore</div>
        <div className="nav-subtitle">Jump to my work, writing, or notes.</div>
        <div className="nav-buttons">
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-btn btn">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
