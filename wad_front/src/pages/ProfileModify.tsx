import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileModify.css';

const ProfileModify: React.FC = () => {
  // 상태 설정
  const [user, setUser] = useState({
    id: '',
    name: '',
    occupation: '',
    email: '',
    phoneNumber: '',
    membershipLevel: '',
    password: '',
  });

  // 데이터를 가져와서 상태를 초기화하는 useEffect
  useEffect(() => {
    const token = localStorage.getItem('token');  // 토큰을 로컬 스토리지에서 가져옵니다.
  
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      window.location.href = '/login';
      return;
    }
  
    // 토큰이 있을 경우 인증된 요청을 보냅니다.
    axios.get('http://localhost:8080/getUserInfo', { headers: { Authorization : `Bearer ${token}` } })
      .then(response => {
        setUser(response.data);  // 데이터를 상태에 저장합니다.
      })
      .catch(error => {
        console.error(error);
      });
  
  }, []);
  
  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
  
    axios.put(`http://localhost:8080/updateUserInfo/${user.id}`, user, { headers: { Authorization : `Bearer ${token}` } })
  .then(response => {
    if (response.data.success) {
      alert('정보가 수정되었습니다.');
    }
  })
  .catch(error => {
    console.error(error);
  });
  };

  return (
    <div id="info-div">
      <br /><br />
      <label id="name-label">
        이름 : 
        <input id="name-input" 
          type="text" 
          value={user.name} 
          onChange={(e) => setUser({ ...user, name: e.target.value })} 
        />
      </label><br /><br />
      <label id="password-label">
        비밀번호 : 
        <input id="password-input" 
          type="password"  
          value={user.password}  
          onChange={(e) => setUser({ ...user, password: e.target.value })}  // 상태 업데이트
        />
      </label><br /><br />
      <label id="phone-label">
        핸드폰 번호 : 
        <input id="phone-input"  
          type="text" 
          value={user.phoneNumber} 
          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} 
        />
      </label><br /><br />
      <label id="occupation-label">
        직업 : 
        <input id="occupation-input" 
          type="text" 
          value={user.occupation} 
          onChange={(e) => setUser({ ...user, occupation: e.target.value })} 
        />
      </label>
    
      <br /><br />
      <button id="infosave-btn" onClick={handleSave}>저장</button>
    </div>
  );
};

export default ProfileModify;
