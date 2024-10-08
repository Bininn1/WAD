import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import "./FrameworkSelectionModal.css";

interface ComponentDetail {
  componentName: string;
  css: CSSDetail;
}
interface CSSDetail {
  left?: number;
  right?: number;
  // ... 기타 CSS 상세 정보
}
// 위에 두 인터페이스는 공모전

const ConvertButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [codeExample, setCodeExample] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState([false, false, false, false, false]);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const canvasInfo = useSelector((state: RootState) => state.canvas.canvasInfo);
  const dispatch = useDispatch();
  const [currentStatus, setCurrentStatus] = useState("NOT_STARTED");
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  // 컴포넌트 정보를 Canvas에서 가져오기 위해 useSelector를 사용
  const components = useSelector((state: RootState) => state.canvas.canvasElements);

  const getCodeExample = (language: string) => {
    if (language === "React") {
      return canvasInfo.reactCode;
    } else if (language === "Vue") {
      return canvasInfo.vueCode;
    } else if (language === "Angular") {
      return canvasInfo.angularCode;
    }
    return "";
  };

  const handleButtonClick = () => {
    setShowModal(true);
    setSelectedLanguage(""); // 선택한 언어 초기화

    // Canvas 위에 있는 모든 컴포넌트 정보를 JSON 문자열로 변환하여 codeExample에 저장
    const codeExampleJSON = JSON.stringify(components, null, 2);
    setCodeExample(codeExampleJSON);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedLanguage("");
    setCodeExample("");
    setLoading(false);
    setLoadingSteps([false, false, false, false, false]);
    setCurrentLoadingStep(0);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(codeExample)
        .then(() => {
          // 복사 성공 시 액션 (예: "복사 완료!" 알림 표시)
        })
        .catch(err => {
          // 복사 실패 시 액션 (예: "복사 실패" 알림 표시)
          console.error('Could not copy text: ', err);
        });
  };
  let compInfoArray: ComponentDetail[] = [
    { componentName: "left", css: {left:50} },  // CSS 상세 정보를 추가해야 함
    { componentName: "right", css: {right:50} }  // CSS 상세 정보를 추가해야 함
  ];
   // 공모전
  const handleLanguageClick = (language: string) => {
    setSelectedLanguage(language);
    setCodeExample(getCodeExample(language));
  };


  const sendSignalToBackend = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/component/save", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //공모전
        //compInfo: [], // 여기에 컴포넌트 정보를 보내야 합니다.
        body: JSON.stringify({
          framework: selectedLanguage,
          compInfo:compInfoArray ,
        }),
      });

      if (response.ok) {
        console.log('컴포넌트 정보가 성공적으로 백엔드에 전송되었습니다.');
      } else {
        console.error('컴포넌트 정보를 백엔드로 전송하는데 실패했습니다.');
      }
    } catch (error) {
      console.error('오류 발생: ', error);
    } finally {
      setLoading(false);
    }

    try {
      setShowLoadingModal(true);
      await checkStatus();  // 첫 호출을 await를 사용하여 완료되기를 기다립니다.

      const startLogicRes = await fetch('http://localhost:8080/api/startLogic', { method: 'POST' });
      if (!startLogicRes.ok) {
        throw new Error('startLogic API failed');
      }

      // 백엔드 로직 호출 완료 후 다시 상태 체크
      await checkStatus();
    } catch (error) {
      console.error('An error occurred:', error);
      setShowLoadingModal(false);
    }
  };

// 상태 체크 함수는 여기에 먼저 정의
// 상태 체크 함수
  const checkStatus = async () => {
    try {
      const statusRes = await fetch("http://localhost:8080/api/status");
      if (!statusRes.ok) {
        console.log("서버 에러, 상태 코드: ", statusRes.status);
        setTimeout(checkStatus, 2000);
        return;
      }

      const data = await statusRes.text();
      console.log("현재 상태 (checkStatus 함수): ", data);

      setCurrentStatus(data);

      if (data === "NOT_STARTED" || data === "GPT_COMPLETED" || data === "WEB_CRAWLING_COMPLETED" || data ==="GPT_TRAINING_COMPLETED") {
        setTimeout(checkStatus, 2000);
      } else if (data === "PROCESS_COMPLETED") {
        // 2초 동안 대기
        setTimeout(() => {
          fetch("http://localhost:8080/api/resetStatus", {
            method: 'POST',  // POST 메서드 사용
          })
              .then(response => response.json())
              .then(data => {
                if (data.status === "reset successful") {
                  // 2초 후에 로딩 모달을 숨김
                  setShowLoadingModal(false);
                }
              })
              .catch(error => {
                console.error('Reset status failed:', error);
              });
        }, 2000);

        return;
      } else {
        console.warn("알 수 없는 상태: ", data);
      }
    } catch (error) {
      console.error("상태를 불러오는 데 에러가 발생했습니다: ", error);
      setTimeout(checkStatus, 2000);
    }
  };


// 백엔드 로직 시작 함수



  return (
      <div className="convert-button-container">

        {showModal && (
            <div className="modal-background" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="language-selection">
                  <div className="language-buttons">
                    <button
                        className={`language-button ${
                            selectedLanguage === "React" ? "active" : ""
                        }`}
                        onClick={() => handleLanguageClick("React")}
                    >
                      React
                    </button>
                    <button
                        className={`language-button ${
                            selectedLanguage === "Vue" ? "active" : ""
                        }`}
                        onClick={() => handleLanguageClick("Vue")}
                    >
                      Vue
                    </button>
                    <button
                        className={`language-button ${
                            selectedLanguage === "Angular" ? "active" : ""
                        }`}
                        onClick={() => handleLanguageClick("Angular")}
                    >
                      Angular
                    </button>
                  </div>
                </div>

                <div className="code-container">
              <textarea
                  className="code-textarea"
                  value={codeExample}
                  readOnly
              />
                </div>
                <button className="copy-button" onClick={copyCodeToClipboard}>
                  복사하기
                </button>
                <button className="send-button" onClick={sendSignalToBackend}>
                  코드 변환
                </button>

                <button className="close-modal-button" onClick={closeModal}>
                  닫기
                </button>

                {/* 새로운 모달 부분 */}
                {showLoadingModal && (
                    <div className="loading-modal">
                      <div className="loading-modal-content">
                        <h4>Loading...</h4>
                        <p className="loading-modal-text">현재 상태: {currentStatus}</p>
                      </div>
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default ConvertButton;