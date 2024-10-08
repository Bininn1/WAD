import React, { useState } from 'react';
import axios from 'axios';

interface Project {
    projectId?: number;  // MySQL에서 AUTO_INCREMENT로 설정되어 있으므로 옵셔널로 설정합니다.
    userId: number;  // 현재 사용자의 ID를 알아야 합니다. 로그인 상태에 따라 설정됩니다.
    generatedId: string;  // 임의로 생성된 고유한 ID입니다.
    projectName: string;
    projectInfo: string;  // 원래의 'explanation'을 'project_info'로 변경하였습니다.
    projectIcon: string;
    projectTime?: Date;  // 이것은 서버에서 기본값으로 설정됩니다.
    projectLastUpdate: Date;
}

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (project: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onCreate,
                                                               }) => {
    const [selectedIcon, setSelectedIcon] = useState('#ffffff');
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
    };
    // 아이콘 선택 시 처리하는 함수
    const handleIconChange = (icon: string) => {
        setSelectedIcon(icon);
    };

    const handleProjectDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setProjectDescription(event.target.value);
    };

    // 서버에 새 프로젝트 정보 전송하는 함수
    const postProjectToServer = async (project: Project) => {
        try {
            // 이 부분에 로그 출력 코드를 추가
            console.log("Sending project to server:", project);

            const response = await axios.post('http://localhost:8080/api/projects', project);
            if (response.status === 200) {
                console.log("Project successfully created!");
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    // "Create" 버튼 클릭 시 처리하는 함수
    const handleCreateButtonClick = () => {
        const generatedID = Date.now().toString();  // 예시로 사용되는 임의의 ID
        const userID = 1;  // 예시로 사용되는 사용자 ID
        // 새 프로젝트 객체 생성
        const newProject: Project = {
            userId: userID,
            generatedId: generatedID,
            projectName: projectName,
            projectInfo: projectDescription,
            projectIcon: selectedIcon,
            projectLastUpdate: new Date(),
        };
        // 서버에 새 프로젝트 정보 전송
        postProjectToServer(newProject);
        // 새 프로젝트 상태 업데이트 및 팝업 창 제어
        onCreate(newProject);
        const body = document.querySelector('body');
        if (body) {
            body.classList.add('blur');
        }
        onClose();
    };

    const colorButtons = [
        '#ff0000',
        '#ff8800',
        '#ffff00',
        '#00ff00',
        '#0000ff',
        '#000080',
        '#800080',
    ];
    return (
        <>
            <h3 style={{ textAlign: 'center' }}>Fill in your app's basic info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                    id="selected-icon-display"
                    style={{
                        width: 80,
                        height: 80,
                        textAlign: 'center',
                        backgroundColor: selectedIcon,
                        border: '1px solid #000',
                    }}
                >
                </div>
                <div style={{ marginTop: 10 }}>
                    {colorButtons.map((icon) => (
                        <button
                            key={icon}
                            style={{
                                backgroundColor: icon,
                                width: 25,
                                height: 25,
                                borderRadius: '50%',
                                border: 'none',
                                margin: '2px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleIconChange(icon)}
                        ></button>
                    ))}
                </div>
                <input
                    type="text"
                    id="projectName"
                    style={{ width: 225, marginTop: 10 }}
                    placeholder="Enter the project name (limit 15 words)"
                    maxLength={15}
                    value={projectName}
                    onChange={handleProjectNameChange}
                />
                <input
                    type="text"
                    id="projectExplanation"
                    style={{ width: 225, marginTop: 10 }}
                    placeholder="Enter project description"
                    value={projectDescription}
                    onChange={handleProjectDescriptionChange}
                />
            </div>
            <button
                id="createButton"
                style={{ display: 'block', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}
                onClick={handleCreateButtonClick}
                disabled={projectName === '' || projectDescription === ''}
            >
                Create
            </button>
        </>
    );
};
export default CreateProjectModal;