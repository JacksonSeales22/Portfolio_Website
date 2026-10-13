import { Link } from 'react-router-dom'
import './Navigation.css';

const navigationLinks = [
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Notes', to: '/notes' },
]

export default function Navigation()
{
  return (
    <nav className="portfolio-nav" aria-label="Main navigation">
      <div className="nav-content">
        <div className="nav-title">Explore</div>
        <div className="nav-subtitle">Jump to my projects, experiences, or notes.</div>
        <div className="nav-buttons">
          {navigationLinks.map((link) => (
            <Link key={link.to} to={link.to} className="nav-btn btn">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
