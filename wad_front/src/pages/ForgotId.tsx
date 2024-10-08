import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './ForgotId.css'

const FindId: React.FC = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [foundEmail, setFoundEmail] = useState<string | null>(null);

    const handleFindId = () => {
        axios.post("http://localhost:8080/findId", { name, phoneNumber, birthdate })
            .then((response) => {
                const emailFromServer = response.data.email;

                const hiddenEmail = emailFromServer.replace(/(.{5})@/, "*****@");
                setFoundEmail(hiddenEmail);
            })
            .catch((error) => {
                console.error("아이디 찾기 실패:", error);
                alert("아이디를 찾을 수 없습니다. 다시 시도해 주세요.");
            });
    };

    return (
        <div className="Forgot-id-container">
            <h2>아이디 찾기</h2>
            <label className="Forgot-id-label">
                이름:
                <input type="text" className="Forgot-id-input" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label className="Forgot-id-label">
                핸드폰:
                <input type="text" className="Forgot-id-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </label>
            <br />
            <label className="Forgot-id-label">
                생년월일:
                <input type="text" className="Forgot-id-input" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </label>
            <br />
            <button className="Forgot-id-button" onClick={handleFindId}>아이디 찾기</button>
            <br />
            {foundEmail && <div className="Forgot-id-label">찾은 이메일: {foundEmail}</div>}
            <Link to="/login"><label>로그인 화면으로 돌아가기</label></Link>
        </div>
    );
};

export default FindId;
