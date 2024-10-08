import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ComponentList.css';
import ProjectCanvas from './ProjectCanvas';
import UsedComponentList from './UsedComponentList';
import store from '../store/Store';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from "../store/Store";

const ComponentList = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [usedComponents, setUsedComponents] = useState<string[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [usedComponentListHeight, setUsedComponentListHeight] = useState<number>(0);
  const [showUsedComponents, setShowUsedComponents] = useState(true);
  const isDragging = useRef(false);
  const componentListVisible = useSelector((state: RootState) => state.canvas.componentListVisible);

  // 이미지 소스들
  const getImageSource = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      downarrow: require('../assets/img/component/downarrow.png'),
      uparrow: require('../assets/img/component/uparrow.png'),
      hr: require('../assets/img/component/hr.png'),
      pre: require('../assets/img/component/pre.png'),
      table: require('../assets/img/component/table.png'),
      image: require('../assets/img/component/image.png'),
      video: require('../assets/img/component/video.png'),
      button: require('../assets/img/component/button.png'),
      formblock: require('../assets/img/component/formblock.png'),
      input: require('../assets/img/component/input.png'),
      fileupload: require('../assets/img/component/fileupload.png'),
      textarea: require('../assets/img/component/textarea.png'),
      checkbox: require('../assets/img/component/checkbox.png'),
      select: require('../assets/img/component/select.png'),
      radio: require('../assets/img/component/radio.png'),
      heading: require('../assets/img/component/heading.png'),
      paragraph: require('../assets/img/component/paragraph.png'),
      textlink: require('../assets/img/component/textlink.png'),
      list: require('../assets/img/component/list.png'),
      container: require('../assets/img/component/container.png'),
      section: require('../assets/img/component/section.png'),
      grid: require('../assets/img/component/grid.png'),
      columns: require('../assets/img/component/columns.png'),
      divblock: require('../assets/img/component/divblock.png'),
      search: require('../assets/img/component/search.png'),
      component: require('../assets/img/component/component.png'),
      searchinputicon: require('../assets/img/component/searchinputicon.png')
    };

    return imageMap[imageName.toLowerCase()] || null;
  };

  // 컴포넌트 목록창 메뉴데이터
  const menuData = [
    {
      mainMenu: 'Layout',
      subMenus: ['Container', 'Section', 'Grid', 'Columns'],
    },
    {
      mainMenu: 'Contents',
      subMenus: ['Heading', 'Paragraph', 'TextLink', 'List', 'DivBlock'],
    },
    {
      mainMenu: 'Button & Input',
      subMenus: ['Button', 'FormBlock', 'Input', 'FileUpload', 'TextArea', 'CheckBox', 'Select', 'Radio'],
    },
    {
      mainMenu: 'Media',
      subMenus: ['Image', 'Video'],
    },
    {
      mainMenu: 'etc',
      subMenus: ['Hr', 'Pre', 'Table', 'Search'],
    },
  ];

  // 서브메뉴의 툴팁
  const imageDescriptions: { [key: string]: string } = {
    container: "Layout box.",
    section: "Content divider.",
    grid: "Grid arrangement.",
    columns: "Side-by-side columns.",
    heading: "Title or header.",
    paragraph: "Long text block.",
    textlink: "Clickable text link.",
    list: "List items.",
    divblock: "Content block.",
    button: "Clickable button.",
    formblock: "Input form block.",
    input: "Text or number input.",
    fileupload: "File upload button.",
    textarea: "Multi-line text input.",
    checkbox: "Multiple-choice checkbox.",
    select: "Dropdown menu.",
    radio: "Single-choice radio button.",
    image: "Image insertion.",
    video: "Video insertion.",
    hr: "Content separator.",
    pre: "Formatted text display.",
    table: "Organized data table.",
    search: "Add search function.",
  };

  // 서브메뉴의 드래그 앤 드롭 기능 구현
  useEffect(() => {
    const allMenus = menuData.map((menu) => menu.mainMenu);
    setExpandedMenus(allMenus);
  }, []);

  const [isVisible, setIsVisible] = useState(true);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value.toLowerCase());
  };

  const handleMainMenuClick = (mainMenu: string) => {
    setExpandedMenus((prevMenus) => {
      if (prevMenus.includes(mainMenu)) {
        return prevMenus.filter((menu) => menu !== mainMenu);
      } else {
        return [...prevMenus, mainMenu];
      }
    });
  };

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLLIElement>, componentName: string) => {
      event.dataTransfer.setData("text/plain", componentName);
      setSelectedComponent(componentName);
      isDragging.current = true;
    },
    []
  );

  const handleCanvasDrop = (event: React.DragEvent<HTMLDivElement>) => {
    console.log('Drop event occurred!'); // 디버깅 메시지
    event.preventDefault();
    event.stopPropagation();
    const componentName = event.dataTransfer.getData("text/plain");
    if (componentName) {
      setUsedComponents((prevComponents) => [...prevComponents, componentName]);
    }
    setSelectedComponent(null); // 선택된 컴포넌트 초기화
    isDragging.current = false;
  };

  // 서브메뉴 상세 구현
  const SubMenu = ({
    subMenu,
    onDragStart,
  }: {
    subMenu: string;
    onDragStart: (
      event: React.DragEvent<HTMLLIElement>,
      subMenu: string
    ) => void;
  }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    let tooltipTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
      tooltipTimeout = setTimeout(() => {
        setShowTooltip(true);
      }, 2000); // 2초 지연
    };

    const handleMouseLeave = () => {
      clearTimeout(tooltipTimeout);
      setShowTooltip(false);
    };

    const handleDragStartInternal = (
      event: React.MouseEvent<HTMLLIElement>
    ) => {
      const target = event.target as HTMLElement;
      if (target.tagName.toLowerCase() === "img") {
        setSelectedComponent(subMenu);
        isDragging.current = true;
      }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLLIElement>) => {
      if (isDragging.current) {
        // 여기서 드래그 이벤트 처리를 수행합니다.
      }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLLIElement>) => {
      if (isDragging.current) {
        const componentName = selectedComponent;
        if (componentName) {
          setUsedComponents((prevComponents) => [
            ...prevComponents,
            componentName,
          ]);
        }
        setSelectedComponent(null); // 선택된 컴포넌트 초기화
        isDragging.current = false;
      }
    };


    
    return (
      <li
        className={`SubMenu ${subMenu === 'Radio' ? 'SubMenuRadio' : ''}`}
        draggable
        onDragStart={(event) => onDragStart(event, subMenu)}
        onMouseDown={(event) => handleDragStartInternal(event)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}

      >
        <div className="SubMenuContent">
          <img src={getImageSource('component')} alt={subMenu} className="SubMenuIcon" />
          {showTooltip && <div className="SubMenuTooltip">{imageDescriptions[subMenu.toLowerCase()]}</div>}
          <span>{subMenu}</span>
        </div>
      </li>
    );
  };


  // 구현되고 보여주는 창 return 함수
  return (
    <div className="ComponentListContainer">

        <div className="CanvasContainer" onDrop={handleCanvasDrop} onDragOver={(event) => event.preventDefault()}>
          <Provider store={store}>
            <ProjectCanvas selectedComponent={selectedComponent} />
          </Provider>
        </div>
        <div className="ComponentLi" style={{ display: componentListVisible ? 'block' : 'none' }}>
          <div className="SearchInputContainer"> {/* 검색창과 아이콘을 감싸는 컨테이너 추가 */}
            <input
              type="text"
              className="SearchInput CustomInput"
              placeholder="검색어를 입력해주세요."
              value={searchKeyword}
              onChange={handleSearchInputChange}
            />
            {/* 오른쪽에 아이콘 추가 */}
            <img
              src={getImageSource('searchinputicon')}
              alt="search-icon"
              className="SearchIcon"
            />
          </div>
          {menuData.map((menu, index) => (
            <ul key={index} style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              {/* MainMenu 클릭을 처리하는 코드 */}
              <li
                className={`MainMenu ${!expandedMenus.includes(menu.mainMenu) ? 'Collapsed' : ''}`}
                onClick={() => handleMainMenuClick(menu.mainMenu)}
              >
                {menu.mainMenu}
                <img
                  src={expandedMenus.includes(menu.mainMenu) ? getImageSource('uparrow') : getImageSource('downarrow')}
                  alt="Icon"
                  className="MainMenuIcon"
                />
              </li>

              {/* 해당 MainMenu가 확장된 경우에만 SubMenu를 표시 */}
              {expandedMenus.includes(menu.mainMenu) && (
                <div className="SubMenuContainer">
                  {menu.subMenus
                    .filter((subMenu) => subMenu.toLowerCase().includes(searchKeyword))
                    .map((subMenu, subIndex) => (
                      <SubMenu
                        key={subIndex}
                        subMenu={subMenu}
                        onDragStart={(event, subMenu) => handleDragStart(event, subMenu)}
                      />
                    ))}
                </div>
              )}
            </ul>
          ))}
        </div>
    </div>
  );
};

export default ComponentList;