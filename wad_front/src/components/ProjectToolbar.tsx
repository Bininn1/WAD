import React, { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import './ProjectToolbar.css';
import "./FrameworkSelectionModal.css";
import { setCanvasSize } from '../store/Slice';
import { toggleComponentListVisibility } from '../store/Slice';
//mode 이미지들
import modedesktop from "../assets/img/sidebar-mode/mode-desktop.png"
import Modetablet from "../assets/img/sidebar-mode/Mode-tablet.png"
import ModeMobilelandscape from "../assets/img/sidebar-mode/Mode-Mobilelandscape.png"
import Modemobileportrait from "../assets/img/sidebar-mode/Mode-mobileportrait.png"
import Modeundo from "../assets/img/sidebar-mode/Mode-undo.png"
import Moderedo from "../assets/img/sidebar-mode/Mode-redo.png"
import Checksave from "../assets/img/sidebar-mode/checksave.png"
import Threebar from "../assets/img/sidebar-mode/threebar.png"
import Eyes from "../assets/img/sidebar-mode/eyes.png"
import UseComponent from "../assets/img/sidebar-mode/usecomponent.png"
import Exit from "../assets/img/sidebar-mode/exit.png"
import {useNavigate} from "react-router-dom";

interface ComponentDetail {
    componentName: string;
    css: CSSDetail;
}
interface CSSDetail {
    left?: number;
    right?: number;
    // ... 기타 CSS 상세 정보
}

const ProjectToolbar: React.FC = () => {
    const navigate = useNavigate();
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
    const [selectedMode, setSelectedMode] = useState("");
    const handleLogoClick = () => navigate("/project-list");
    const handleButtonClick = () => {
        setShowModal(true);
        setCodeExample("")
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
    const handleEyesClick = () => {
        dispatch(toggleComponentListVisibility());
      };
    const closeModal = () => {
        setShowModal(false);
        setSelectedLanguage("");
        setCodeExample("");
    };

    const handleModeButtonClick = (mode: string) => {
        setSelectedMode(mode); // 버튼 클릭에 따라 선택한 모드를 설정
        let canvasWidth = 0;
    let canvasHeight = 1840; // 높이는 기본값으로 설정

    switch (mode) {
        case "Mode-desktop":
            canvasWidth = 1240;
            break;
        case "Mode-tablet":
            canvasWidth = 768;
            break;
        case "Mode-Mobilelandscape":
            canvasWidth = 568;
            break;
        case "Mode-mobileportrait":
            canvasWidth = 320;
            break;
        default:
            console.error("Unknown mode: ", mode);
    }

    dispatch(setCanvasSize({ width: canvasWidth, height: canvasHeight }));
    };

    const handleLanguageClick = (language: string) => {
        setSelectedLanguage(language);
        setCodeExample("");
    };
    const modeContents: { [key: string]: string } = {
        "Mode-desktop": "1240px",
        "Mode-tablet": "768px",
        "Mode-Mobilelandscape": "568px",
        "Mode-mobileportrait": "320px",
    };

    const getCodeExample = (language: string) => {
        if (language === "reactjs") {
            return canvasInfo.reactCode;
        } else if (language === "Vuejs") {
            return canvasInfo.vueCode;
        } else if (language === "Angular") {
            return canvasInfo.angularCode;
        }
        return "";
    };
    const checkStatus = async () => {
        try {
            const statusRes = await fetch("http://localhost:8080/api/component/status");
            if (statusRes.ok) {
                const data = await statusRes.text();
                setCurrentStatus(data);
                if (data !== "PROCESS_COMPLETED") {
                    // 2초 후에 다시 상태 확인
                    setTimeout(checkStatus, 2000);
                } else {
                    // 모든 프로세스가 완료되면 로딩 모달 숨기기
                    setShowLoadingModal(false);
                }
            } else {
                console.error("서버 에러, 상태 코드:", statusRes.status);
                setTimeout(checkStatus, 2000);
            }
        } catch (error) {
            console.error("상태를 불러오는 데 에러가 발생했습니다:", error);
            setTimeout(checkStatus, 2000);
        }
    };
    const sendSignalToBackend = async () => {
        setShowLoadingModal(true);
        setLoading(true);
        setCurrentStatus("코드 생성중");
        try {
            const response = await fetch(`http://localhost:8080/api/component/execute-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    framework: selectedLanguage,
                    projectId: selectedLanguage, // projectId는 실제 프로젝트 ID로 대체해야 함
                    compInfo: components.map(element => ({
                        componentName: element.type,
                        left: element.left,
                        top: element.top,
                        width: element.width,
                        height: element.height,
                        isSelected: element.isSelected,
                        isCollidingOther: element.isCollidingOther,
                        css: { /* css 속성 추가 */ }
                    }))
                }),
            });

            if (response.ok) {
                const data = await response.text();
                setCodeExample(data); // 받아온 데이터를 codeExample에 저장
            } else {
                console.error('Failed to fetch data from backend');
                // 여기에 실패 상황에 대한 추가 로직을 넣을 수 있습니다.
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // 오류 발생 시 처리 로직을 넣을 수 있습니다.
        } finally {
            await checkStatus(); // 성공, 실패, 오류 상관없이 항상 상태를 확인
            setLoading(false); // 로딩 종료
        }
    };

    const componentListVisible = useSelector((state: RootState) => state.canvas.componentListVisible);

    const handleThreeImageClick = () => {// 삼단메뉴바 아직기능구현x
        // 이미지 버튼을 클릭했을 때 수행할 작업을 여기에 추가합니다.
    };



    const handleUseComponentImageClick = () => {// 삼단메뉴바 아직기능구현x
        // 이미지 버튼을 클릭했을 때 수행할 작업을 여기에 추가
    };
    return (
        <div className="project-toolbar">

            <div className="Center-Modes">



                <div className="Modes">
                    <button
                        className={`Mdoe-button ${selectedMode === "Mode-desktop" ? "active" : ""}`}
                        onClick={() => handleModeButtonClick("Mode-desktop")}
                    >
                        <img src={modedesktop} className="iconsize2" />
                    </button> {/*Mode-desktop 버튼*/}

                    <button
                        className={`Mdoe-button ${selectedMode === "Mode-tablet" ? "active" : ""}`}
                        onClick={() => handleModeButtonClick("Mode-tablet")}
                    >
                        <img src={Modetablet} className="iconsize2" />
                    </button>{/*Mode-tablet 버튼*/}

                    <button
                        className={`Mdoe-button ${selectedMode === "Mode-Mobilelandscape" ? "active" : ""}`}
                        onClick={() => handleModeButtonClick("Mode-Mobilelandscape")}
                    >
                        <img src={ModeMobilelandscape} className="iconsize2" />
                    </button>{/*Mode-Mobilelandscape 버튼*/}

                    <button
                        className={`Mdoe-button ${selectedMode === "Mode-mobileportrait" ? "active" : ""}`}
                        onClick={() => handleModeButtonClick("Mode-mobileportrait")}
                    >
                        <img src={Modemobileportrait} className="iconsize2" />
                    </button>{/*Mode-mobileportrait 버튼*/}
                </div>
                <div className="mode-width-box" >
                    {modeContents[selectedMode] || "1240px"}
                </div>
                <button className="eyes" onClick={handleEyesClick}>
                    <img src={Eyes} className="iconsize" />
                </button>

                <button className="undo">
                    <img src={Modeundo} className="iconsize2"/>
                </button>{/*이전 버튼*/}
                &nbsp;
                <button className="redo">
                    <img src={Moderedo} className="iconsize2"/>
                </button>{/*복구 버튼*/}
                &nbsp; &nbsp;
                <button className="Save-button" style={{ filter: "none" }}>
                    <img src={Checksave} className="iconsize2"/>
                </button>{/*자동저장 버튼*/}
                &nbsp;
                <button className="convert-button" onClick={handleButtonClick} >
                    &lt; &gt;
                </button>
                {showModal && (
                    <div className="modal-background" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="language-selection">
                                <div className="language-buttons">
                                    <button
                                        className={`language-button ${
                                            selectedLanguage === "reactjs" ? "active" : ""
                                        }`}
                                        onClick={() => handleLanguageClick("reactjs")}
                                    >
                                        React
                                    </button>
                                    <button
                                        className={`language-button ${
                                            selectedLanguage === "Vuejs" ? "active" : ""
                                        }`}
                                        onClick={() => handleLanguageClick("Vuejs")}
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

                            {/* 로딩 모달 */}
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

            <button
                className="three-image-button"
                onClick={() => handleThreeImageClick()} // 클릭 이벤트 핸들러 설정
            >
                <img src={Threebar} alt="Three Bar" /> {/* 이미지를 표시합니다 */}
            </button>

            <button className="three-image-button2 ">
                <img src={UseComponent} className="iconsize" />
            </button>
            <button
  className="Exit "
  onClick={handleLogoClick}
>
  <img src={Exit} className="Exiticon" />
  
</button>
        </div>
    );
};
export default ProjectToolbar;
