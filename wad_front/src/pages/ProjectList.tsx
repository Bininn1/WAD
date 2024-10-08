import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectList.css';
import gearIcon from '../assets/img/gear-icon.png';
import trashIcon from '../assets/img/trash-icon.png';
import copyIcon from '../assets/img/copy-icon.png';
import codecheck from '../assets/img/checkcode.png';
import CreateProjectModal from './CreateProjectModal';
import ReactDOM from 'react-dom';

interface Project {
  projectId: number;
  projectName: string;
  projectTime: Date;
  projectInfo: string;
  projectLastUpdate: Date;
  projectExplanation: string
  projectTimestamp : Date
  projectIcon?: string;
}

const ProjectList: React.FC = () => {

  
    // 검색어 상태 관리
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    // 팝업 열림 여부 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const [projects, setProjects] = useState<Project[]>([]);

    // 프로젝트 목록 상태 관리
    useEffect(() => {
      axios.get('http://localhost:8080/api/projects')
        .then(response => {
          // 서버 응답을 적절한 형태로 변환
          const fetchedProjects = response.data.map((project:any) => ({
            projectId : project.projectId,
            projectName : project.projectName,
            projectTime : new Date(project.projectTime),
            projectInfo : project.projectInfo,
            projectLastUpdate : new Date(project.projectLastUpdate),
            projectExplanation : project.explanation,
            projectTimestamp : new Date(project.timestamp)
          }));
          setProjects(fetchedProjects);
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
        });
    }, []);

    //아이콘 설명 텍스트
    interface HoveredIcon {
      id: number | null;
      type: IconType | null;
    }
    
    const [hoveredIcon, setHoveredIcon] = useState<HoveredIcon>({ id: null, type: null });
    
    type IconType = 'gear' | 'trash' | 'codecheck' | 'copy';

const handleIconHover = (id: number, type: IconType) => {
  setHoveredIcon({ id, type });
};

const handleIconHoverExit = () => {
  setHoveredIcon({ id: null, type: null });
};

    // ProjectList 컴포넌트 내 상태 추가
const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState<boolean>(false);
    // 화면 블러
const [isMainScreenBlurred, setIsMainScreenBlurred] = useState<boolean>(false);

    
      // 새 프로젝트 생성 모달 상태 관리
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleNewProjectModalClose = () => {
    setIsNewProjectModalOpen(false);
  };
 
  
    // 삭제 확인 모달 상태 관리
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteProjectId, setDeleteProjectId] = useState<number>(0);

    // 복사 확인 모달 상태 관리
    const [showCopyModal, setShowCopyModal] = useState<boolean>(false);
    const [copyProjectId, setCopyProjectId] = useState<number>(0);

    // 정렬 옵션 상태 관리
    const [sortOption, setSortOption] = useState<string>('최신순');

    // 아이콘 표시 상태 관리
    const [showIcons, setShowIcons] = useState<Record<number, boolean>>({});

    
     // 프로젝트 상세 정보 모달 상태 관리
    const [showProjectDetailsModal, setShowProjectDetailsModal] = useState<boolean>(false);
    const [projectDetails, setProjectDetails] = useState<Project | null>(null);


    // 검색어 변경 이벤트 핸들러
    const handleSearchInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(event.target.value.toLowerCase());
    };

    // 정렬 옵션 변경 이벤트 핸들러
    const handleSortOptionChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    };

    // ProjectList 컴포넌트 내 프로젝트 생성 버튼 이벤트 핸들러 추가
    const handleCreateProjectClick = () => {
      setIsMainScreenBlurred(true); // 화면 블러처리
      const popupWindow = window.open(
        "",
        "createProjectModalPopup",
        "width=600,height=400"
      );
      if (popupWindow) {
        popupWindow.document.write(`
          <html>
          <head>
            <title>Create Project Popup</title>
          </head>
          <body>
            <div id="modal-root"></div>
          </body>
          </html>`
        );
        const modalRoot = popupWindow.document.getElementById("modal-root");
        if (modalRoot) {
          const modalContainer = popupWindow.document.createElement("div");
          modalRoot.appendChild(modalContainer);
    
          ReactDOM.render( // CreateProjectModal 랜더링
            <CreateProjectModal
              isOpen={true}
              onClose={() => {
                ReactDOM.unmountComponentAtNode(modalContainer);
                popupWindow.close();
              }}
              onCreate={(project) => {
                setProjects((prevProjects) => [...prevProjects, project] as Project[]);
                popupWindow.close();
              }}/>,
            modalContainer
          );
        }
    
        popupWindow.addEventListener("beforeunload", () => {
          setIsMainScreenBlurred(false); // 모달이 팝업에서 닫힐 때 블러 상태를 변경
        });
      }
    };
    
     
    
        
    const handleCodecheckIconClick = (projectId: number) => {
    // 이미 팝업이 열려있는 경우에는 더 이상 동작하지 않음
    if (isPopupOpen) {
        return;
    }

    // 팝업을 여는 로직...
    const project = projects.find((project) => project.projectId === projectId);
    if (project) {
        setIsPopupOpen(true); // 팝업 열리는 시점에 상태 업데이트

        const popupWindow = window.open(
            '',
            '프로젝트 설명 ' + projectId, 
            'width=400,height=300'
        );

        if (popupWindow) {
            // 팝업이 열린 경우에만 내용을 추가하도록 수정
            popupWindow.document.write(`
            <html>
            <body>
              <h3>${project.projectName}</h3>
              <p id="project-explanation">${project.projectExplanation}</p> 
              <button id="copy-button">복사</button>
              <script>
                const copyButton = document.getElementById('copy-button');
                const projectExplanation = document.getElementById('project-explanation');
            
                copyButton.addEventListener('click', () => {
                  const copyText = projectExplanation.innerText;
                  navigator.clipboard.writeText(copyText)
                    .then(() => {
                      alert('프로젝트 설명이 복사되었습니다.');
                    })
                    .catch((error) => {
                      console.error('복사에 실패했습니다.', error);
                    });
                });
            
                // 팝업이 닫힐 때 상태를 업데이트하여 다시 팝업을 열 수 있도록 설정합니다.
                window.onunload = handlePopupClose;
              </script>
            </body>
            </html>
      `);

      // 팝업이 닫힐 때 상태를 업데이트하는 handlePopupClose 함수를 정의합니다.
const handlePopupClose = () => {
  setIsPopupOpen(false);
  setIsMainScreenBlurred(false);
};
popupWindow.addEventListener("beforeunload", handlePopupClose);
            // 팝업이 닫힐 때 오버레이 숨김
            popupWindow?.addEventListener('beforeunload', () => {
                const overlay = popupWindow.document.querySelector('.overlay');
                overlay?.remove();
                setIsMainScreenBlurred(false);
            });
        } else {
            console.error('새 창을 열 수 없습니다.');
            setIsPopupOpen(false); // 팝업이 열기에 실패하면 상태를 초기화
        }
    }
};

    // 아이콘 클릭 시 아이콘 비활성화 이벤트 핸들러
const handleGearIconClick = (projectId: number) => {
  // 이미 팝업이 열려있는 경우에는 더 이상 동작하지 않음
  if (isPopupOpen) {
    return;
  }

  // 팝업을 여는 로직 시작
  setIsPopupOpen(true); // 팝업이 열리는 시점에 상태를 업데이트하여 중복 팝업 방지

  // 선택된 프로젝트 정보 가져오기
  const project = projects.find((project) => project.projectId === projectId);

  if (project) {
    setIsPopupOpen(true);
    // 선택된 프로젝트의 정보를 가져와 객체로 생성
    const projectDetails = {
      title: project.projectName,
      explanation: project.projectExplanation,
    };

    // 팝업 창 열기
    const popupWindow = window.open(
      '',
      '프로젝트 상세 정보 ' + projectId,
      'width=400,height=300'
    );

    if (popupWindow) {
      // 팝업 창에 HTML 내용 작성
      popupWindow.document.write(
        `
        <html>
        <head>
          <title>프로젝트 상세 정보</title>
        </head>
        <body>
          <h1 id="project-details-title">${projectDetails.title}</h1>
          <input type="text" id="project-name-input" value="${projectDetails.title}">
          <button id="save-button">저장</button>
          <textarea id="project-details-explanation">${projectDetails.explanation}</textarea>
        </body>
        </html>
        `
      );

      // "저장" 버튼 클릭 시 정보 업데이트
      const saveButton = popupWindow.document.getElementById('save-button');
      saveButton?.addEventListener('click', () => {
        // 수정된 프로젝트 이름과 설명 가져오기
        const updatedProjectName = (popupWindow.document.getElementById(
          'project-name-input'
        ) as HTMLInputElement)?.value;
        const updatedProjectExplanation = (popupWindow.document.getElementById(
          'project-details-explanation'
        ) as HTMLTextAreaElement)?.value;
        

        // 서버에 수정된 프로젝트 정보 업데이트 요청 보내기
        axios
          .put(`http://localhost:8080/api/projects/${projectId}`, {
            projectName: updatedProjectName,
            projectInfo: updatedProjectExplanation,
          })
          .then((response) => {
            // 서버 응답을 처리하고 프로젝트 정보를 업데이트하는 로직 추가
            const updatedProjects = projects.map((proj) =>
              proj.projectId === projectId
                ? {
                    ...proj,
                    projectName: updatedProjectName,
                    projectInfo: updatedProjectExplanation,
                  }
                : proj
            );
            setProjects(updatedProjects);

            // 팝업 창 닫기
            popupWindow.close();
          })
          .catch((error) => {
            console.error('프로젝트 정보 업데이트 실패', error);
          });
      });

      // 팝업 창 닫힐 때 상태 업데이트
      popupWindow.onunload = () => {
        setIsPopupOpen(false);
        setIsMainScreenBlurred(false);
      };
    } else {
      console.error('팝업 창을 열 수 없습니다.');
      setIsPopupOpen(false); // 팝업 열기 실패 시 상태 초기화
      setIsMainScreenBlurred(false);
    }
  }
};

    // 삭제 버튼 클릭 이벤트 핸들러
const handleDeleteClick = (projectId : number) => {
  setDeleteProjectId(projectId);
  setShowDeleteModal(true);
};

// 프로젝트 삭제
const deleteProject = () => {
    axios.delete(`http://localhost:8080/api/projects/${deleteProjectId}`)
      .then(() => {
        const updatedProjects = projects.filter(
            (project) => project.projectId !== deleteProjectId
        );
        setProjects(updatedProjects);
        setShowDeleteModal(false);
      })
      .catch((error) => {
          console.error('Error deleting project:', error);
      });
};

    // 검색 결과 필터링
    const filteredProjects = projects.filter(
      (project) => typeof project.projectName === 'string' && project.projectName.toLowerCase().includes(searchKeyword)
    );
    

    // copy Icon 클릭 이벤트
const handleCopyIconClick = (projectId: number) => {
  // 프로젝트 복사 확인 모달을 열기 위해 상태를 업데이트합니다.
  setShowCopyModal(true);
  setCopyProjectId(projectId);
};

    // 복사 확인 이벤트 핸들러
    const handleCopyConfirm = () => {
      const projectToCopy = projects.find((project) => project.projectId === copyProjectId);
    
      if (projectToCopy) {
        const newProjectName = window.prompt('프로젝트명을 입력하세요', projectToCopy.projectName);
    
        if (newProjectName) {
          // 새로운 프로젝트 객체를 생성하여 기존 프로젝트 정보를 복사합니다.
          const newProject = {
            ...projectToCopy,
            projectId: Math.max(...projects.map((project) => project.projectId)) + 1, // 새로운 ID를 생성합니다.
            projectName: newProjectName, // 새로운 프로젝트명을 설정합니다.
            userId: 1, // 이 부분은 실제 사용자 ID가 들어가야 합니다.
            generatedId: Date.now().toString(), // 임의의 고유한 ID를 생성합니다. 
            projectIcon : projectToCopy.projectIcon,
          };
    
          axios.post('http://localhost:8080/api/projects', newProject)
            .then(response => {
              const newProjectFromServer = response.data;
              // 서버 응답을 적절한 형태로 변환
              const processedProject = {
                ...newProjectFromServer,
                projectTime : new Date(newProjectFromServer.projectTime),
                projectLastUpdate : new Date(newProjectFromServer.projectLastUpdate),
                timestamp : new Date(newProjectFromServer.timestamp)
              };
        
              // 성공적으로 저장되었다면 상태 업데이트
              setProjects(prevProjects => [...prevProjects, processedProject]);
              setShowCopyModal(false);
              setCopyProjectId(0);
            })
            .catch(error => console.error('Error creating copied project:', error));
        }
      }
    };
    
    
    // 복사 취소 이벤트 핸들러
const handleCopyCancel = () => {
  // 프로젝트 복사 확인 모달을 닫고, 상태를 초기화합니다.
  setShowCopyModal(false);
  setCopyProjectId(0);
};

    // 정렬 옵션에 따라 프로젝트 목록 정렬
const sortedProjects = filteredProjects.sort((a, b) => {
  if (sortOption === '최신순') {
      return (b.projectTimestamp?.getTime() ?? 0) - (a.projectTimestamp?.getTime() ?? 0);
  } else if (sortOption === '이름순') {
      return a.projectName.localeCompare(b.projectName);
  }
  return 0;
});

    const handleEllipsisClick = (projectId: number) => {
      setShowIcons((prevShowIcons) => {
        const updatedShowIcons = { ...prevShowIcons };
  
        // 현재 프로젝트의 아이콘 표시 상태를 업데이트하고, 다른 프로젝트의 아이콘은 모두 숨깁니다.
        for (const key in updatedShowIcons) {
          updatedShowIcons[key] = false;
        }
  
        // 이미 삭제 모달이 열려있는 경우에는 닫습니다.
        if (prevShowIcons[projectId] && showDeleteModal) {
          setShowDeleteModal(false);
        } else {
          // 선택한 프로젝트의 아이콘 표시 상태를 변경합니다.
          updatedShowIcons[projectId] = !prevShowIcons[projectId];
  
          // 선택한 프로젝트의 아이디를 설정합니다.
          setDeleteProjectId(projectId);
        }
  
        return updatedShowIcons;
      });
    };

  return (
    <div className={`app${isMainScreenBlurred ? ' app-blur' : ''}`}>
        <header>
      </header>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
     
  
      <button id="new-project-btn" onClick={handleCreateProjectClick}>
      Create
    </button>
    {isCreateProjectModalOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <CreateProjectModal
            isOpen={true}
            onClose={() => {
              setIsCreateProjectModalOpen(false);
              setIsMainScreenBlurred(false);
            }}
            onCreate={(project) => {
              setProjects((prevProjects) => [...prevProjects, project] as Project[]);
              setIsCreateProjectModalOpen(false);
            }}
          />
        </div>
      </div>
    )}
    <CreateProjectModal
      isOpen={isNewProjectModalOpen}
      onClose={() => setIsNewProjectModalOpen(false)}
      onCreate={(project) => {
        setProjects((prevProjects) => [...prevProjects, project] as Project[]);
        setIsNewProjectModalOpen(false);
      }}
    />

      <br />
      <hr />
      <br />
      <div id="project-list-container">
        <div id="search-form">
          <input
            type="text"
            id="search-input"
            placeholder="기존 프로젝트 검색"
            value={searchKeyword}
            onChange={handleSearchInputChange}
          />
          <button id="search-button" style={{ display: 'none' }}></button>
          <div id="search-icon"></div>
          <select
            id="sort-select"
            value={sortOption}
            onChange={handleSortOptionChange}
          >
            <option value="최신순">최신순</option>
            <option value="이름순">이름순</option>
          </select>
        </div>
        <div id="project-list">
        {sortedProjects.map((project) => (
          <div
          key={project.projectId}
          className="project-item"
          data-name={project.projectName}
          data-timestamp={project.projectTimestamp}
    style={{
      border: '1px solid black',
      borderRadius: '10px',
      marginBottom: '10px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
        <div className="project-name-container">
            <span style={{ fontSize: '18px' }}>{project.projectName}</span>
            <p style={{ fontSize: '12px' }}>{project.projectInfo}</p>
            <span style={{ fontSize: '10px' }}>Create Project : {new Intl.DateTimeFormat('ko-KR').format(project.projectTime)}</span>
            <br />
            <span style={{ fontSize: '10px' }}>Last Upload : {new Intl.DateTimeFormat('ko-KR').format(project.projectLastUpdate)}</span>
        </div>
    {showIcons[project.projectId] && (
      <div className="button-container">
        <button
  className="gear-icon-btn"
  onClick={() => handleGearIconClick(project.projectId)}
  onMouseEnter={() => handleIconHover(project.projectId, 'gear')}
  onMouseLeave={handleIconHoverExit}
>
  <img src={gearIcon} alt="Gear Icon" />
  {hoveredIcon.id === project.projectId && hoveredIcon.type === 'gear' && (
    <span className="icon-description">Settings</span>
  )}
</button>
<button
  className="trash-icon-btn"
  onClick={() => handleDeleteClick(project.projectId)}
  onMouseEnter={() => handleIconHover(project.projectId, 'trash')}
  onMouseLeave={handleIconHoverExit}
>
  <img src={trashIcon} alt="Trash Icon" />
  {hoveredIcon.id === project.projectId && hoveredIcon.type === 'trash' && (
    <span className="icon-description">Delete</span>
  )}
</button>

<button
  className="codecheck-icon-btn"
  onClick={() => handleCodecheckIconClick(project.projectId)}
  onMouseEnter={() => handleIconHover(project.projectId, 'codecheck')}
  onMouseLeave={handleIconHoverExit}
>
  <img src={codecheck} alt="Codecheck Icon" />
  {hoveredIcon.id === project.projectId && hoveredIcon.type === 'codecheck' && (
    <span className="icon-description">Code Check</span>
  )}
</button>

<button
  className="copy-icon-btn"
  onClick={() => handleCopyIconClick(project.projectId)}
  onMouseEnter={() => handleIconHover(project.projectId, 'copy')}
  onMouseLeave={handleIconHoverExit}
>
  <img src={copyIcon} alt="Copy Icon" />
  {hoveredIcon.id === project.projectId && hoveredIcon.type === 'copy' && (
    <span className="icon-description">Copy</span>
  )}
  </button>
                  <button
                    className="ellipsis-button"
                    onClick={() => handleEllipsisClick(project.projectId)}
                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                  >
                    ≡
                  </button>   
                </div>
              )}

{!showIcons[project.projectId] && (
      <div className="ellipsis-container">
        <button
          className="ellipsis-button"
          onClick={() => handleEllipsisClick(project.projectId)}
          style={{ fontSize: '20px', fontWeight: 'bold' }}
        >
          ≡
        </button>
      </div>
    )}

{(showDeleteModal || showCopyModal) && (
    <div id="delete-modal">
        <div className="delete-modal-content">
            <h3>
                {showDeleteModal
                    ? '프로젝트를 삭제하시겠습니까?'
                    : '프로젝트를 복사하시겠습니까?'}
            </h3>
            <div className="btn-container">
                <button
                    id="confirm-delete-btn"
                    onClick={
                        showDeleteModal ? deleteProject : handleCopyConfirm
                    }
                >
                    예
                </button>
                <button
                    id="cancel-delete-btn"
                    onClick={
                        showDeleteModal ? () => setShowDeleteModal(false) : handleCopyCancel
                    }
                >
                    아니오
                </button>
            </div>
        </div>
    </div>
)}
  </div>
))}
        </div>
      </div>
      <div id="project-details-container" style={{ display: 'none' }}>
        <h2 id="project-details-title"></h2>
        <p id="project-details-description"></p>
      </div>
      <footer>

      </footer>
    </div>
  );
};

export default ProjectList;