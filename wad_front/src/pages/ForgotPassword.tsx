import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import './ForgotPassword.css';

const FindPw: React.FC = () => {
    const [name, setName] = useState<string>(''); // 이름 사용
    const [email, setEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>(''); // 추가된 부분: 새 비밀번호
    const [verificationSent, setVerificationSent] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false); // 추가된 부분: 인증 완료 확인
    const navigate = useNavigate();
    const handleFindPw = async () => {
        try {
            const response = await axios.post('http://localhost:8080/sendVerificationCodeForPasswordReset', {
                name: name,
                email: email // 이메일 사용
            });

            if (response.status === 200) { // 성공적으로 응답받은 경우
                setVerificationSent(true);
            }
        } catch (err) {
            console.log('Send verification email error', err);
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:8080/verifyCode', { // 엔드포인트 수정
                email: email,
                code: verificationCode,
            });

            if (response.status === 200) { // 성공적으로 응답받은 경우
                setVerified(true);
            }
        } catch (err) {
            console.log('Code verification error', err);
        }
    };
    const handleResetPassword = async () => {
        try {
            const response = await axios.post('http://localhost:8080/resetPassword', { // 백엔드 엔드포인트
                name: name,
                email: email,
                newPassword: newPassword
            });

            if (response.status === 200) { // 성공적으로 응답받은 경우
                alert('비밀번호가 재설정되었습니다.');
            }
        } catch (err) {
            console.log('Password reset error', err);
        }
        navigate("/login");
    };


    return (
        <div className="Forgot-Pw-container">
            <h2 className="Forgot-Pw-h2">비밀번호 찾기</h2>
            <label className="Forgot-Pw-label">
                이름:
                <input className="Forgot-Pw-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="Forgot-Pw-label">
                이메일:
                <input className="Forgot-Pw-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button className="Forgot-Pw-button" onClick={handleFindPw}>인증메일 보내기</button>
            {verificationSent && (
                <div className="verification-container">
                    <h3>인증메일 확인</h3>
                    <input className="Forgot-Pw-input" type="text" placeholder="인증 번호" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                    <button className="Forgot-Pw-button" onClick={handleVerifyCode}>인증하기</button>
                </div>
            )}
            {verified && (
                <div className="reset-container">
                    <h3 className="Forgot-Pw-h2">비밀번호 재설정</h3>
                    <input className="Forgot-Pw-input" type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button className="Forgot-Pw-button" onClick={handleResetPassword}>비밀번호 변경</button>
                </div>
            )}
            <Link to="/login">로그인 화면으로 돌아가기</Link>
        </div>
    );
};

export default FindPw;
