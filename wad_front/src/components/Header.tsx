import React, { useState, useEffect } from 'react';
import logo from '../assets/img/Wad.png';
import './Header.css';
import user from '../assets/img/myPage.jpg';
import menu from '../assets/img/삼단바.png';
import { useNavigate} from 'react-router-dom';
import { useAuth } from './AuthContext';

interface MenuItem {
  title: string;
  url?: string;
  subMenu?: MenuItem[];
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(window.innerWidth < 1201);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 새로운 상태 추가

  const handleLoginClick = () => navigate("/login");
  const handleMyPageButtonClick = () => navigate("/mypage");
  const handleLogoClick = () => navigate("/");
  const wadMenu = () => navigate("/");
  const wadProMenu = () => navigate("/");
  const productSize = () => navigate("/");
  const techSupo = () => navigate("/");
  const handleMenuMouseEnter = () => setIsSubMenuVisible(true);
  const handleMenuMouseLeave = () => {
    setIsSubMenuVisible(true);
    setTimeout(() => {
      setIsSubMenuVisible(false);
    }, 1000);
  };

  const handleToggleDropdown = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const handleLogoutClick = () => {
    logout(); // 로그아웃 함수를 호출합니다.
    navigate('/'); // 필요한 경우 로그인 페이지로 리다이렉트합니다.
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await fetch('/authcheck');
      const data = await response.json();

      if (data.isLogin === "True") {
        // 로그인 상태 복원
      } else {
        // 로그아웃 상태 처리
      }
    };

    checkLoginStatus();

    const handleResize = () => setShowMenu(window.innerWidth < 1201);
    handleResize(); // 페이지 로드 시에도 상태를 갱신해줘야 함

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const menuItems: MenuItem[] = [
    {
      title: "WAD",
      url: ""
    },
    {
      title: "Wad 제품소개",
      url: ""
    },
    {
      title: "제품 용량 안내",
      url: ""
    },
    {
      title: "기술 지원",
      url: ""
    },
  ];

  const renderSubMenu = (subMenuItems: MenuItem[]) => (
      <ul className="submenu">
        {subMenuItems.map((item, index) => (
            <li key={index} onClick={() => item.url && navigate(item.url)}>
              {item.title}
              {item.subMenu && renderSubMenu(item.subMenu)}
            </li>
        ))}
      </ul>
  );

  return (
      <div>
        <header className="header">
          <div className="logo">
            <img src={logo} className="App-logo" alt="logo" onClick={handleLogoClick} />
          </div>
          <div className="menu-Item">
            <ul>
              <li onMouseEnter={handleMenuMouseEnter} onMouseLeave={handleMenuMouseLeave}>
                <div className="menu-parent">WAD</div>
              </li>
              <li onMouseEnter={handleMenuMouseEnter} onMouseLeave={handleMenuMouseLeave}>
                <div className="menu-parent">WAD 제품소개</div>
              </li>
              <li onMouseEnter={handleMenuMouseEnter} onMouseLeave={handleMenuMouseLeave}>
                <div className="menu-parent">제품 용량 안내</div>
              </li>
              <li onMouseEnter={handleMenuMouseEnter} onMouseLeave={handleMenuMouseLeave}>
                <div className="menu-parent">기술 지원</div>
              </li>
            </ul>
            <div className="App"></div>
          </div>
          <div className="header-Buttons">
            {isLoggedIn ? (
                <>
                  <button className="header-Logout" onClick={handleLogoutClick}>
                    로그아웃
                  </button>
                  <button onClick={handleMyPageButtonClick} className="myPage-Logo">
                    <img src={user} className="" alt="User"/>
                  </button>
                </>
            ) : (
                <div>
                  <button className="header-User" onClick={handleLoginClick}>
                    로그인
                  </button>
                </div>
            )}
          </div>
          {showMenu && (
              <div className="dropdown-container">
                <button className="dropdown-toggle" onClick={handleToggleDropdown}>
                  <img src={menu} alt="Dropdown Menu" className="dropdown-icon" />
                  <button className="header-User" onClick={handleLoginClick}>
                    로그인
                  </button>
                </button>
                {isDropdownVisible && (
                    <ul className="dropdown-menu">
                      {menuItems.map((item, index) => (
                          <li key={index} className="title-cursor">
                            {item.title}
                            {item.subMenu && renderSubMenu(item.subMenu)}
                          </li>
                      ))}
                    </ul>
                )}
              </div>
          )}
        </header>
      </div>
  );
}

export default Header;
