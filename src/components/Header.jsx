import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css'

export default function Header()
{
    return(
        <header>
            <HomeButton/>
            <h1>SilentShell - My AWS Portfolio</h1>
        </header>
    )
}

function HomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenPages = ['/'];

  const shouldHide = hiddenPages.includes(location.pathname);

  if (shouldHide) return null;

  return (
    <button className="header-btn btn" onClick={() => navigate('/')}>
      Return to Main Page
    </button>
  );
}