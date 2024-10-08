import React, { useState, useEffect } from 'react';
import './ProjectCanvas.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/Store'; // RootState 타입을 가져올 때 Store.tsx에서 정의한 것과 일치해야 합니다.
import {
  addCanvasElement,
  removeCanvasElement,
  copyCanvasElement,
  updateCanvasElementPosition,
  setSelectedComponent,
  updateCanvasElements,
  StyleElement
} from '../store/Slice'; // 컴포넌트의 상태 관리를 위해 Slice.tsx의 로직을 바탕으로 Redux dispatch 추가
import { createNoSubstitutionTemplateLiteral } from 'typescript';
import {
  defaultButtonStyles,
  defaultHeadingStyles
} from '../store/Slice';



interface CanvasElement {
  type: string;
  isSelected: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
  initialX?: number;  // 초기 X 좌표를 저장하기 위한 필드
  initialY?: number;  // 초기 Y 좌표를 저장하기 위한 필드
  
}

 


// Canvas와 사용된 컴포넌트 목록창의 연결을 위한 interface 구축
interface ProjectCanvasProps {
  selectedComponent: string | null;
}


const ProjectCanvas: React.FC<ProjectCanvasProps> = ({ selectedComponent }) => {
  // 캔버스 크기 관리를 위한 함수
 const canvasSize = useSelector((state: RootState) => state.canvas.canvasSize);

  const canvasElements = useSelector((state: RootState) => state.canvas.canvasElements); 
  const selectedElement = canvasElements.find(element => element.type === selectedComponent);
  const buttonColor = selectedElement?.styles?.backgroundcolor || defaultButtonStyles.backgroundcolor;
  const buttonTextColor = selectedElement?.styles?.typotextcolor || defaultButtonStyles.typotextcolor;
  const dispatch = useDispatch();

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // 드래그 앤 드롭 이벤트 처리를 위한 함수
  const handleCanvasDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const componentRef = React.useRef<HTMLDivElement>(null);

  const [draggedSize, setDraggedSize] = useState({width: 0, height: 0});

  
  // 드롭한 요소를 캔버스에 추가하는 함수
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(event);
    const target = event.target;
    let tesss : any  = target;
    



    const canvasPosition = getCanvasPosition();
    const droppedType = event.dataTransfer.getData('text/plain');

    

    const defaultStyles : StyleElement = {
    layoutdisplay: undefined,
    layoutdirection: undefined,
    layoutalign: undefined,
    layoutjustify: undefined,
    typofontSize: undefined,
    typofontHeight: undefined,
    typotextSize: undefined,
    typotextcolor: undefined,
    typofont: undefined,
    typoweight: undefined,
    typotextalign: undefined,
    typotextstyle: undefined,
    backgroundcolor: undefined,
    backgroundborder: undefined,
    backgroundimage: undefined,
    position: undefined,
    effectopacity: undefined,
    borderstyle: undefined,
    tablestylerow: undefined,
    tablestylecolmns: undefined,
    borderradius: undefined,
    bordertable: undefined,
    borderimage: undefined,
    spacingmargin: undefined,
    spacingpadding: undefined,
    sizewidth: undefined,
    sizeheight: undefined,
    sizeoverflow: undefined
    };

    const newElement = {
      type: droppedType, 
      isSelected: true, 
      left: event.clientX - canvasPosition.left,
      top: event.clientY - canvasPosition.top,
      width: draggedSize.width,
      height: draggedSize.height,
      initialX: undefined,
      initialY: undefined,
      isCollidingOther: false,
      styles: defaultStyles
  };

    
  
     //겹치는지 여부를 확인하고 겹치지 않는 경우에만 추가
    const isCollidingWithOther = canvasElements.some((element) =>
      isColliding(newElement, element)
    );
  
    if (!isCollidingWithOther) {
      dispatch(addCanvasElement(newElement));
    } else {
      console.warn("컴포넌트가 겹쳐 배치할 수 없습니다!");
    }
  };
  
  const getComputedStylesForElement = (element: HTMLElement) => {
    const computedStyles = window.getComputedStyle(element);
    console.log(element);
    return {
        layoutdisplay: computedStyles.display,
        layoutdirection: computedStyles.flexDirection,
        layoutalign: computedStyles.alignItems,
        layoutjustify: computedStyles.justifyContent,
        typofontSize: computedStyles.fontSize,
        typofontHeight: parseFloat(computedStyles.lineHeight).toString(),
        typotextSize: parseFloat(computedStyles.fontSize), // 동일한 fontSize 값이 필요한 경우
        typotextcolor: computedStyles.color,
        typofont: computedStyles.fontFamily,
        typoweight: computedStyles.fontWeight,
        typotextalign: computedStyles.textAlign,
        typotextstyle: computedStyles.fontStyle,
        backgroundcolor: computedStyles.backgroundColor,
        backgroundborder: computedStyles.border,
        backgroundimage: computedStyles.backgroundImage,
        position: computedStyles.position,
        effectopacity: computedStyles.opacity,
        borderstyle: computedStyles.borderStyle,
        borderradius: computedStyles.borderRadius,
        spacingmargin: parseFloat(computedStyles.margin),
        spacingpadding: parseFloat(computedStyles.padding),
        sizewidth: parseFloat(computedStyles.width),
        sizeheight: parseFloat(computedStyles.height),
        sizeoverflow: computedStyles.overflow
    };
  }
  
  const handleComponentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const styles = getComputedStylesForElement(target);
    
    
  };

  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  
  // 캔버스 내 드래그한 요소의 마우스 다운 이벤트 핸들러
  const handleCanvasElementMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // 드래그가 시작된 위치를 저장
    const canvasPosition = getCanvasPosition();
    const initialX = event.clientX - canvasPosition.left;
    const initialY = event.clientY - canvasPosition.top;
    
    const elementPosition = canvasElements[index];

    // 여기에서 오프셋 계산
    const offsetX = initialX - elementPosition.left;
    const offsetY = initialY - elementPosition.top;
    
    setDragOffset({ x: offsetX, y: offsetY });  // 이렇게 계산된 오프셋을 상태에 저장
    setDraggingIndex(index);

    // 선택된 컴포넌트 상태 업데이트
    const updatedElements = canvasElements.map((element, idx) => {
      if (idx === index) {
        return { ...element, isSelected: true };
      } else {
        return { ...element, isSelected: false };
      }
    });
  
    // Redux에 선택된 컴포넌트 저장
    const selectedCanvasElement = updatedElements[index];
    dispatch(setSelectedComponent(selectedCanvasElement)); // 선택된 컴포넌트를 Redux 상태에 저장

    dispatch(updateCanvasElements(updatedElements));

};

// 캔버스 내에서 마우스 이동 시 호출되는 함수
const handleCanvasMouseMove = (event: MouseEvent) => {
  if (draggingIndex !== null && canvasElements[draggingIndex] && dragOffset) {
    const canvasPosition = getCanvasPosition();
    
    // 오프셋을 사용하여 컴포넌트의 위치 업데이트
    const left = event.clientX - canvasPosition.left - dragOffset.x;
    const top = event.clientY - canvasPosition.top - dragOffset.y;

    // 캔버스 내에서 요소가 이동하는 범위 제한
    const canvasWidth = canvasPosition.width;
    const canvasHeight = canvasPosition.height;
    const blockWidth = 100;
    const blockHeight = 60;

    const limitedLeft = Math.min(Math.max(left, 0), canvasWidth - blockWidth);
    const limitedTop = Math.min(Math.max(top, 0), canvasHeight - blockHeight);

    const updatedElements = canvasElements.map((element, index) => {
      
      if (index === draggingIndex) {
        // 새로운 객체를 반환하여 상태를 업데이트
        return {
          ...element,
          left: limitedLeft,
          top: limitedTop,
        };
      }
      return element;
    });

    // Redux 상태를 업데이트
   
    dispatch(updateCanvasElementPosition({ index: draggingIndex, left: limitedLeft, top: limitedTop }));
  }
};


// 마우스 업 이벤트 핸들러
  const handleCanvasMouseUp = () => {
    setDraggingIndex(null);
  };

  // 키다운 이벤트 핸들러
  const handleKeyDown = (event: KeyboardEvent) => {
    // Delete 키를 누르면 선택된 요소 삭제
    if (event.key === 'Delete' && draggingIndex === null) {
      const selectedIndex = canvasElements.findIndex(element => element.isSelected);
      if (selectedIndex !== -1) {
        dispatch(removeCanvasElement(selectedIndex));
      }
    }
  };

  //복사 버튼 클릭 핸들러
  const handleCopyClick = (index: number) => {
    const selectedElement = canvasElements[index];
    const newElement = { ...selectedElement, isSelected: false }; // 복사된 컴포넌트는 선택되지 않은 상태로 설정

    // 복사본의 위치를 설정 (캔버스 왼쪽 상단으로 이동)
    newElement.left += 10; // 적절한 x 좌표 값
    newElement.top += 10; // 적절한 y 좌표 값

    // Redux 액션을 통해 업데이트
    dispatch(copyCanvasElement({ index, newElement }));

  };



  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (index: number) => {
    const updatedElements = canvasElements.filter((_, i) => i !== index);
    dispatch(removeCanvasElement(index));
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleCanvasMouseMove);
    document.addEventListener('mouseup', handleCanvasMouseUp);
    document.addEventListener('keydown', handleKeyDown);



    return () => {
      document.removeEventListener('mousemove', handleCanvasMouseMove);
      document.removeEventListener('mouseup', handleCanvasMouseUp);
      document.removeEventListener('keydown', handleKeyDown);

    };
  }, [draggingIndex, canvasElements]);

  // 캔버스의 위치 정보를 가져오는 함수
  const getCanvasPosition = () => {
    const canvasElement = document.querySelector('.Canvas');
    if (canvasElement) {
      const canvasRect = canvasElement.getBoundingClientRect();
      return {
        left: canvasRect.left,
        top: canvasRect.top,
        width: canvasRect.width,
        height: canvasRect.height,
      };
    }
    return { left: 0, top: 0, width: 0, height: 0 };
  };

  // 요소간의 충돌 여부를 판단하는 함수
  const isColliding = (element1: CanvasElement, element2: CanvasElement) => {
    return (
      element1 !== element2 &&
      element1.left < element2.left + element2.width &&
      element1.left + element1.width > element2.left &&
      element1.top < element2.top + element2.height &&
      element1.top + element1.height > element2.top
    );
};


  // 캔버스에 있는 모든 코드를 가져오는 함수
  const getAllCanvasCode = () => {
    const canvasCode = canvasElements.map((element, index) => {
      // 각 컴포넌트 정보를 가져와서 이를 원하는 형식으로 가공합니다.
      const { type, left, top } = element;

      // 각 컴포넌트 정보를 문자열로 가공하거나 다른 형식으로 사용할 수 있습니다.
      const componentCode = `Type: ${type}, Left: ${left}, Top: ${top}`;

      
      return componentCode;
    });

    // canvasCode 배열에는 캔버스에 있는 각 컴포넌트 정보가 문자열 형태로 들어가게 됩니다.
    return canvasCode;
  };


  // 이 함수를 호출하면 캔버스에 있는 모든 코드를 가져올 수 있습니다.
  const canvasCode = getAllCanvasCode();

  
  // 아래부터 캔버스 내 컴포넌트들을 정의하는 부분입니다.
  // 각 컴포넌트가 드래그될 때의 이벤트 핸들러가 정의되어 있습니다.

  const ButtonSubMenu = () => {
    const handleDragStart = (event: React.DragEvent<HTMLButtonElement>) => { //handleDragStart함수: 드래그가 시작될때 호출되는 이벤트
        event.dataTransfer.setData('text/plain', 'Button'); //텍스트 형식으로 값을 설정

        const target = event.target as HTMLElement;
        const styles = getComputedStylesForElement(target);

        // newElement 생성 및 초기화
        const canvasPosition = getCanvasPosition();
            
        const newElement = {
        type: 'Button',
        isSelected: true,
        left: event.clientX - canvasPosition.left,
        top: event.clientY - canvasPosition.top,
        width: draggedSize.width,
        height: draggedSize.height,
        initialX: undefined,
        initialY: undefined,
        isCollidingOther: false
        };

        // Redux에 저장합니다.
        dispatch(addCanvasElement({ ...newElement, styles }));
    };
    return (
      <button
      className="button-submenu btn-style"
      style={{ backgroundColor: buttonColor, color: buttonTextColor }}
      draggable
      onDragStart={handleDragStart}
    >
      Button
    </button>
    
    );
};

  const InputSubMenu = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Input');
    };

    
    return (
      <div
        className="input-submenu"
        draggable
        onDragStart={handleDragStart}
      >
        <label htmlFor="input-field"></label>
        <input type="text" id="input-field" name="name" placeholder="input" />
      </div>
    );
  };

  const FormBlock = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'FormBlock');
    };

    return (
      <div className="formblock" draggable onDragStart={handleDragStart}>
        <form>
          <label>ID</label><br></br><input type='text' /><br></br>
          <label>Password</label><br></br><input type='password' /><br></br>
          <button>Submit</button>
        </form>
      </div>
    );
  };

  const FileUpload = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'FileUpload');
    };

    return (
      <div className="fileupload" draggable onDragStart={handleDragStart}>
        <input type="file" />
      </div>
    );
  };

  const TextArea = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'TextArea');
    };

    return (
      <div className="textarea" draggable onDragStart={handleDragStart}>
        <textarea placeholder="Textarea"></textarea>
      </div>
    );
  };

  const CheckBox = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'CheckBox');
    };

    return (
      <div className="checkbox" draggable onDragStart={handleDragStart}>
        <input type="checkbox" />
        <label>Checkbox</label>
      </div>
    );
  };

  const Select = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Select');
    };

    return (
      <div className="select" draggable onDragStart={handleDragStart}>
        <select>
          {/* Select의 옵션들을 여기에 추가 */}
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
    );
  };

  const Radio = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Radio');
    };

    return (
      <div className="radio" draggable onDragStart={handleDragStart}>
        <input type="radio" name="radio-group" />
        <label>Radio</label>
      </div>
    );
  };

  const Video = ({ videoSrc }: { videoSrc: string }) => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Video');
    };

    return (
      <div className="canvas-video" draggable onDragStart={handleDragStart}>
        <video controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };


  const Image = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Image');
    };

    return (
      <div className="canvas-image" draggable onDragStart={handleDragStart}>
        {/* 이미지 소스를 적절한 태그를 사용하여 설정하세요 */}
        <img src="이미지_경로" alt="이미지" />
      </div>
    );
  };

  const Hr = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Hr');
    };

    return (
      <div className="canvas-hr" draggable onDragStart={handleDragStart}>
        Hr
      </div>
    );
  };

  const Pre = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Pre');
    };

    return (
      <div className="canvas-pre" draggable onDragStart={handleDragStart}>
        Pre
      </div>
    );
  };

  const Table = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Table');
    };

    return (
      <div className="canvas-table" draggable onDragStart={handleDragStart}>
        <table>
          <tr>
            <td>Cell1</td>
            <td>Cell2</td>
            <td>Cell3</td>
          </tr>
          <tr>
            <td>Cell4</td>
            <td>Cell5</td>
            <td>Cell6</td>
          </tr>
          <tr>
            <td>Cell7</td>
            <td>Cell8</td>
            <td>Cell9</td>
          </tr>
        </table>
      </div>
    );
  };

  const Search = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Search');
    };

    return (
      <div className="canvas-search" draggable onDragStart={handleDragStart}>
        <form action="http://www.google.co.kr/search">
          <div className="search">
            <input type="text" name="query" value="" />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
    );
  };

  const Heading = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState("Heading");
    const [showModal, setShowModal] = useState(false);
  
    // 더블클릭 이벤트 핸들러
    const handleDoubleClick = () => {
      setShowModal(true); // 모달 표시
    };
  
    // 모달에서 "확인" 버튼 클릭
    const handleModalConfirm = () => {
      setShowModal(false); // 모달 숨기기
      setIsEditing(false); // 편집 모드 종료
    };
  
    // 모달에서 텍스트 변경
    const handleModalTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value); // 텍스트 업데이트
    };
  
    return (
      <div>
        {/* 본문 */}
        <h1 onDoubleClick={handleDoubleClick}>{text}</h1>
  
        {/* 모달 */}
        {showModal && (
          <div className="modal">
            <input
              type="text"
              value={text}
              onChange={handleModalTextChange}
            />
            <button onClick={handleModalConfirm}>확인</button>
          </div>
        )}
      </div>
    );
  };
  
  const Paragraph = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Paragraph');
    };

    return (
      <div className="canvas-paragraph" draggable onDragStart={handleDragStart}>
        <p>Paragraph Text</p>
      </div>
    );
  };

  const TextLink = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'TextLink');
    };

    return (
      <div className="canvas-textlink" draggable onDragStart={handleDragStart}>
        <a href="#">Text Link</a>
      </div>
    );
  };

  const List = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'List');
    };

    return (
      <div className="canvas-list" draggable onDragStart={handleDragStart} onDrop={handleDrop}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    );
  };

  const DivBlock = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'DivBlock');
    };

    return (
      <div className="canvas-divblock" draggable onDragStart={handleDragStart}>
      </div>
    );
  }

  const Container = () => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', 'Container');
    };

    return (
      <div className="canvas-container" draggable onDragStart={handleDragStart}>
      </div>
    );
  }

  return (
    <div
      className="Canvas"
      onDragOver={handleCanvasDragOver}
      onDrop={handleDrop}
      onMouseUp={handleCanvasMouseUp}
      //Canvas 크기 변동을 위한 style코드
      style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}

    >
      {canvasElements.map((element, index) => (
        <div
          key={index}
          className={`CanvasElement ${element.isSelected ? 'selected' : ''} ${element.isCollidingOther ? 'colliding' : ''}`}
          style={{ top: element.top, left: element.left }}
          onMouseDown={(event) => handleCanvasElementMouseDown(event, index)}
        >
          {element.isSelected && (
            <div className="element-actions">
              <div className="selectbutton-container">
                <button onClick={() => handleCopyClick(index)}>
                  <img src={require('../assets/img/component/copy-icon.png')} alt="복사" />
                </button>
                <button onClick={() => handleDeleteClick(index)}>
                  <img src={require('../assets/img/component/trash-icon.png')} alt="삭제" />
                </button>
              </div>
            </div>
          )}
          {element.type === 'Button' && <ButtonSubMenu />}
          {element.type === 'Input' && <InputSubMenu />}
          {element.type === 'FormBlock' && <FormBlock />}
          {element.type === 'FileUpload' && <FileUpload />}
          {element.type === 'TextArea' && <TextArea />}
          {element.type === 'CheckBox' && <CheckBox />}
          {element.type === 'Select' && <Select />}
          {element.type === 'Radio' && <Radio />}
          {element.type === 'Video' && <Video videoSrc="video_source_url_here" />}
          {element.type === 'Image' && <Image />}
          {element.type === 'Hr' && <Hr />}
          {element.type === 'Pre' && <Pre />}
          {element.type === 'Table' && <Table />}
          {element.type === 'Search' && <Search />}
          {element.type === 'Heading' && <Heading />}
          {element.type === 'Paragraph' && <Paragraph />}
          {element.type === 'TextLink' && <TextLink />}
          {element.type === 'List' && <List />}
          {element.type === 'DivBlock' && <DivBlock />}
          {element.type === 'Container' && <Container />}
        </div>
      ))}
    </div>
  );
};

export default ProjectCanvas;