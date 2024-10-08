import React, { useState, useEffect } from 'react';
import axios from 'axios'; // HTTP 요청을 위한 axios 라이브러리
import './MyPage.css';


const MyPage: React.FC = () => {
 
  const [user, setUser] = useState({
    name: '', // 기본값은 빈 문자열이나 null 등으로 설정
    occupation: '',
    email: '',
    phoneNumber: '',
    membershipLevel: '',
  });

  // 페이지가 로드되면 실행되는 useEffect
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      window.location.href = '/login'; // 리다이렉트
    } else {
      axios.get('http://localhost:8080/getUserInfo', { headers: { Authorization : `Bearer ${token}` } })
        .then((response) => {
          const fetchedUser = response.data;
          setUser({
            name: fetchedUser.name,
            occupation: fetchedUser.occupation,
            email: fetchedUser.email,
            phoneNumber: fetchedUser.phoneNumber,
            membershipLevel: fetchedUser.membershipLevel,
          });
        })
        .catch((error) => {
          // 에러 처리 로직
          console.error(error);
        });
    }
  }, []);

  const maskPhoneNumber = (phoneNumber: string) => {
    const numberParts = phoneNumber.split('-');
    if (numberParts.length === 3) {
      const [firstPart, secondPart, thirdPart] = numberParts;
      const maskedSecondPart = secondPart[0] + '***';
      const maskedThirdPart = thirdPart[0] + '***';
      return `${firstPart}-${maskedSecondPart}-${maskedThirdPart}`;
    }
    return phoneNumber;
  };

  // 이미지 상태 관리
  const [userImage, setUserImage] = useState<string | null>(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지를 업로드하는 로직 추가
      const imageURL = URL.createObjectURL(file);
      setUserImage(imageURL);
    }
  };

  // 기본 이미지 URL
  const defaultImageURL = 'https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user2-512.png';

  return (
    <div>
        <div className="info-section">
  <div className="userimg-container">
    <img
      className="userimg"
      src={userImage || defaultImageURL}
      alt="User"
    />
    <input
      id="imageInput"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: 'none' }} // 실제로 표시되지 않도록 숨김 처리
    />
    <button
      id="imgbutton"
      onClick={() => document.getElementById('imageInput')?.click()}
    >
      변경
    </button>
  </div>
  <div className="user-info-section">
          <div className="user-info">
            <p>이름: {user.name}</p>
            </div>
            <div className="user-info">
            <p>직업: {user.occupation}</p>
            </div>
            <div className="user-info">
            <p>이메일: {user.email}</p>
            </div>
            <div className="user-info">
            <p>핸드폰 번호: {maskPhoneNumber(user.phoneNumber)}</p>
            </div>
            <div className="user-info">
            <p>멤버십: {user.membershipLevel}</p>
          </div>
        </div>

  <div className="user-info-section">
  <div className="section">
  <h2>공지사항</h2>
  <hr style={{ width: '105.9%', marginLeft: '-31px', borderColor: '#ccc' }} />

  <p>공지사항 내용을 보여줌</p>
</div>


  </div>
</div>
<div className="button-container">
    <button id="profile-setting-btn" onClick={() => window.location.href = "http://localhost:3000/profilemodify"}>프로필 수정</button>
    <button id="project-manager-btn" onClick={() => window.location.href = "http://localhost:3000/project-list"}>프로젝트 관리</button>
  </div><br /><br />
  <div className="QnAcontainer">
  <div className="QnAsection">
    <h2>Q&A</h2>
    <hr />
    <p>Q&A 내용을 보여줌</p>
    <button id="QnAbtn" onClick={() => window.location.href = "http://localhost:3000/project-list"}>
      더보기
    </button>
  </div>
</div>

      </div>
  );
};

export default MyPage;