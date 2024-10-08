import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [occupation, setOccupation] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [verificationMessage, setVerificationMessage] = useState(''); // 인증 코드 전송 관련 메시지
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [canRegister, setCanRegister] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false); // 인증 코드 전송 상태 추가
  const [birthdateError, setBirthdateError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState("");

  const [termsAndConditions, setTermsAndConditions] = useState(`  1. **서비스의 제공**: 본 서비스는 GPT를 활용한 Front-end Low(No)-Code IDE 서비스를 제공합니다. 사용자는 본 서비스를 통해 간편하게 프론트엔드 코드를 생성할 수 있습니다.
  
  2. **회원가입 및 정보**: 회원가입을 위해서는 이름, 생년월일, 이메일, 비밀번호, 전화번호, 직업, 회원 등급 정보를 제공해야 합니다. 제공한 정보는 서비스 제공을 위해 사용됩니다.
  
  3. **서비스 이용**: 서비스를 이용하면서 생성된 프로젝트의 정보는 MongoDB 및 MySQL 데이터베이스에 저장됩니다.
  
  4. **서비스 변경 및 중단**: 본 서비스는 기술적, 운영적인 사유로 서비스 내용을 변경하거나 중단할 수 있습니다.
  
  5. **정보의 보안**: 사용자의 개인정보는 최선의 방법으로 보호됩니다. 단, 외부의 해킹 등의 불가피한 사유로 정보가 유출될 경우, 본 서비스는 책임을 지지 않습니다.
  `);
  const [termsAndConditions2, setTermsAndConditions2] = useState(`  1. **수집하는 개인정보**: 본 서비스는 회원가입 및 서비스 제공을 위해 이름, 생년월일, 이메일, 비밀번호, 전화번호, 직업, 회원 등급 정보를 수집합니다.
  
  2. **개인정보의 사용 목적**: 수집된 개인정보는 서비스 제공, 고객 지원, 서비스 개선 등의 목적으로만 사용됩니다.
  
  3. **개인정보의 보관 기간**: 사용자의 개인정보는 서비스 탈퇴 시까지 보관되며, 탈퇴 이후에는 즉시 삭제됩니다.
  
  4. **개인정보의 제3자 제공**: 본 서비스는 사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
  
  5. **개인정보의 열람 및 수정**: 사용자는 언제든지 자신의 개인정보를 열람하거나 수정할 수 있습니다.
  
  6. **동의 철회**: 사용자는 개인정보의 수집 및 이용에 대한 동의를 철회할 수 있습니다. 단, 동의를 철회할 경우 서비스의 일부 또는 전부를 이용할 수 없습니다.
  `);


  const navigate = useNavigate();

  const isValidDate = (dateString: string) => {
    const parts = dateString.split("-");
    if (parts.length !== 3) return false;
    const [year, month, day] = parts.map(part => parseInt(part, 10));
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (month === 2 && day > 29) return false;
    if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) return false;
    if (month === 2 && day === 29 && (year % 4 !== 0 || (year % 100 === 0 && year % 400 !== 0))) return false;

    // 현재 날짜에서 10년 전 날짜까지만 허용
    const currentDate = new Date();
    const minYear = currentDate.getFullYear() - 5;
    if (year > minYear) return false;

    return true;
  };
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // 숫자만 남김
    if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
    if (value.length > 7) value = value.slice(0, 7) + "-" + value.slice(7);
    value = value.slice(0, 10); // 최대 10글자만 저장

    if (value.length === 10) {
      if (isValidDate(value)) {
        setBirthdate(value);
      }
    } else {
      setBirthdate(value);
    }
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // 숫자만 남김
    if (value.length > 3) value = value.slice(0, 3) + "-" + value.slice(3);
    if (value.length > 8) value = value.slice(0, 8) + "-" + value.slice(8);
    setPhoneNumber(value.slice(0, 13)); // 최대 13글자 (XXX-XXXX-XXXX 형식)
  };

  const handleBirthdateBlur = () => {
    if (birthdate.length === 10 && !isValidDate(birthdate)) {
      setBirthdateError("올바른 날짜 형식이 아닙니다. 현재 날짜에서 5년 이전의 날짜만 입력 가능합니다.");
    } else {
      setBirthdateError("");
    }
  };
  const verifyVerificationCode = () => {
    axios.post('http://localhost:8080/verifyCode', {
      email: email, // 사용자가 입력한 이메일
      code: verificationCode // 사용자가 입력한 인증 코드
    })
        .then((response) => {
          if (response.status === 200) {
            setIsCodeVerified(true);
            setVerificationMessage("인증 코드가 확인되었습니다.");
          }
        })
        .catch((error) => {
          setVerificationMessage("인증 코드가 일치하지 않습니다. 다시 확인해주세요.");
        });
  };

  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordPattern.test(password);
  };

  const handleEmailBlur = () => {
    if (!isValidEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }
  };
  // 약관 동의 모달 표시 함수
  const handleShowTermsModal = () => {
    setShowTermsModal(true);
  };

// 약관 동의 모달 닫기 함수
  const handleCloseTermsModal = () => {
    if (agreeTerms && agreePrivacy) {
      setCanRegister(true); // 체크 상태가 모두 true인 경우 회원 가입 가능 상태로 설정
    }
    setShowTermsModal(false);
  };

// 회원가입 조건을 확인하는 useEffect
  useEffect(() => {
    if (agreeTerms && agreePrivacy && !emailError && !passwordError && !confirmPasswordError && name && birthdate && email && password && showVerificationInput) {
      setCanRegister(true);
    } else {
      setCanRegister(false);
    }
  }, [agreeTerms, agreePrivacy, emailError, passwordError, confirmPasswordError, name, birthdate, email, password, showVerificationInput]);


  const sendVerificationCode = async () => {
    setIsSendingCode(true); // 인증 코드 전송 시작
    try {
      const response = await axios.post('http://localhost:8080/sendVerificationCode', { email });
      if (response.status === 200) {
        setVerificationMessage('인증 코드가 이메일로 전송되었습니다. 확인해주세요.');
        setShowVerificationInput(true);
      } else {
        setVerificationMessage('인증 코드 전송 실패. 다시 시도해주세요.');
      }
    } catch (err) {
      setVerificationMessage('인증 코드 전송 실패. 다시 시도해주세요.');
      console.error('Error sending verification code', err);
    } finally {
      setIsSendingCode(false); // 인증 코드 전송 종료
    }
  };

  const handlePasswordBlur = () => {
    if (!isValidPassword(password)) {
      setPasswordError('영문, 숫자, 특수기호를 포함하고 최소 6글자 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError('비밀번호와 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      const response = await axios.post('http://localhost:8080/register', {
        name: name,
        birthdate: birthdate,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        occupation: occupation,
      });

      if (response.status === 201) {
        navigate('/');
      } else {
        alert('회원가입 실패!');
      }
    } catch (err) {
      console.log('signup error', err);
      alert('회원가입 실패!');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };



  return (
      <div className="container-Register">
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            이름:
            <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
          </label>
          <label className="form-label">
            생년월일:
            <input
                type="text"
                pattern="\d{4}-\d{2}-\d{2}" // 년도-월-일 형식으로 제한
                maxLength={10} // 최대 10글자 (년도-월-일 형식)
                className="form-input"
                placeholder="YYYY-MM-DD"
                value={birthdate}
                onChange={handleBirthdateChange}
                onBlur={handleBirthdateBlur}
                required
            />
          </label>
          {birthdateError && <div className="error-message">{birthdateError}</div>}
          <label className="form-label">
            이메일:
            <input
                type="email"
                className={`form-input ${emailError ? 'error-field' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
            />
            {emailError && <p className="error-message">{emailError}</p>}
            <button type="button" onClick={sendVerificationCode} disabled={isSendingCode} className="form-submit" style={{ margin: '10px 0' }}>
              {isSendingCode ? '전송 중...' : '인증 코드 전송'}
            </button>
            {isSendingCode && <div>로딩중...</div>}
            {verificationMessage && <p className="verification-message">{verificationMessage}</p>}
            {/* 인증 코드 입력란 추가 */}
            {showVerificationInput && (
                <div className="verification-section">
                  <label className="form-label">
                    인증 코드:
                    <input
                        type="text"
                        className="form-input"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </label>
                  <button type="button" onClick={verifyVerificationCode}>인증 코드 확인</button> {/* 추가된 부분 */}
                </div>
            )}
          </label>

          <label className="form-label">
            비밀번호:
            <input
                type="password"
                className={`form-input ${passwordError ? 'error-field' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </label>
          <label className="form-label">
            비밀번호 확인:
            <input
                type="password"
                className={`form-input ${confirmPasswordError ? 'error-field' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
                required
            />
            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
          </label>
          <label className="form-label">
            휴대 전화:
            <input
                type="text"
                className="form-input"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
            />
          </label>
          <label className="form-label">
            직업:
            <select
                className="form-input"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
            >
              <option value="학생">학생</option>
              <option value="개발자">개발자</option>
              <option value="기타">기타</option>
            </select>
          </label>
          {/* 약관 동의 버튼 */}
          <button type="button" onClick={handleShowTermsModal} className="form-submit">
            약관 동의
          </button>

          {/* 약관 동의 모달 */}
          {showTermsModal && (
              <div className="Regi-modal" onClick={handleCloseTermsModal}>
                <div className="Regi-modal-content" onClick={e => e.stopPropagation()}>
                  <h2>약관 동의</h2>
                  <hr className="thick-hr" />

                  <div className="term-item">
                    <label>
                      <input
                          type="checkbox"
                          checked={agreeAll}
                          onChange={() => {
                            const newState = !agreeAll;
                            setAgreeAll(newState);
                            setAgreeTerms(newState);
                            setAgreePrivacy(newState);
                          }}
                      />
                      회원가입 약관에 모두 동의합니다.
                    </label>
                  </div>

                  <hr />
                  <div className="term-item">
                    <label>
                      <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      이용약관 동의 (필수)
                    </label>
                    <textarea value={termsAndConditions} readOnly />
                  </div>

                  <hr />
                  <div className="term-item">
                    <label>
                      <input
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                      />
                      개인정보 수집 및 이용 동의 (필수)
                    </label>
                    <textarea value={termsAndConditions2} readOnly />
                  </div>

                  <button onClick={handleCloseTermsModal}>확인</button>

                </div>
              </div>

          )}
          <input
              type="submit"
              className="form-submit"
              value={isLoading ? '가입 중...' : '회원가입'}
              disabled={!canRegister || isLoading || !isCodeVerified}
          />


        </form>
        <Link to="/login" className="login-link">
          이미 회원이신가요? 로그인
        </Link>
      </div>
  );
};

export default Register;