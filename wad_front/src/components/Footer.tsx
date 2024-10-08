import './Footer.css';
import logo from "../assets/img/Wad.png";
import { useNavigate} from 'react-router-dom';
import React from "react";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => navigate("/");

  return (
      <footer className="footer-footer">
        <div>
          <img src={logo} className="footer-logo" onClick={handleLogoClick} />
        </div>
        <div className="footer-content">
          <a href="about:blank">이용 약관</a>
          <a href="about:blank">개인정보처리방침</a>
        </div>
      </footer>
  );
}

export default Footer;
