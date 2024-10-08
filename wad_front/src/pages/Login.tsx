import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../components/AuthContext';
import './Login.css'; // 추가: 스타일 파일을 불러옵니다/


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  // useNavigate 훅을 사용하여 페이지를 이동하는 함수 가져오기
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', { // 포트 8080으로 수정
        email: email,
        password: password,
      });
  
      if (response.status === 200 && response.data.message === 'Login successful') {
        // 로그인 성공 시, 서버에서 받은 토큰을 로그인 함수에 전달
        const token = response.data.token;
        login(token);
  
        // Home 컴포넌트로 이동
        navigate('/');
      } else {
        // 로그인 실패 알림
        alert('회원가입 실패!');
      }
    } catch (err) {
      console.log('login error', err);
      // 로그인 실패 알림
      alert('회원가입 실패!');
    }
  };
  

  

  return (
    <div className="container-Login">
        <form onSubmit={handleSubmit}>
          <h2>로그인</h2>
            <div className="form-group">
              <label className="label">
                아이디(email):
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
              </label>
            </div>
            <div className="form-group">
              <label className="label">
                비밀번호:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
              </label>
            </div>
            <input type="submit" value="Log in" className="submit-button" />
        </form>
      <div className="link">
        <Link to="/register"> 아이디가 없으신가요?</Link>
        <br /><br />
        <Link to="/findId">아이디 찾기</Link>
        <br />
        <Link to="/findPassword">비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default Login;
