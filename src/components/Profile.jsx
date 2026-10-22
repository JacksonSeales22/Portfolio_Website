import './Profile.css'
import meImg from '../assets/grad.jpg';
import secPlus from '../assets/securityplus.png';

function Profile() {
  return (
    <div className="profile-row">
      <img src={meImg} alt="Me" className="me-img" />

      <div className="badge-column">
        <img src={secPlus} alt="CompTIA Security+" className="badge" />
      </div>
    </div>
  );
}

export default Profile