import React from 'react';
import './UsedComponentList.css';

const getImageSource = (imageName: string) => {
  const imageMap: { [key: string]: any } = {
    delete: require('../assets/img/component/delete.png'),
    downarrow: require('../assets/img/component/downarrow.png'),
      uparrow: require('../assets/img/component/uparrow.png')
  };
  
  return imageMap[imageName.toLowerCase()] || null;
};

interface UsedComponentListProps {
  usedComponents: string[];
  showUsedComponents: boolean;
  onToggleUsedComponents: () => void;
  onUsedComponentDragStart: (event: React.DragEvent<HTMLDivElement>, componentName: string) => void;
  onDeleteComponent: (index: number) => void;
}

const UsedComponentList: React.FC<UsedComponentListProps> = ({
  usedComponents,
  showUsedComponents,
  onToggleUsedComponents,
  onUsedComponentDragStart,
  onDeleteComponent,
}) => {
  return (
    <div className="UsedComponentList">
      Used...
      <button className="ToggleUsedComponentsButton" onClick={onToggleUsedComponents}>
        {showUsedComponents ? (
          <img src={getImageSource('uparrow')} alt="Up Arrow" />
        ) : (
          <img src={getImageSource('downarrow')} alt="Down Arrow" />
        )}
      </button>
      {showUsedComponents && (
        <div>
          {usedComponents.map((component, index) => (
            <div
              key={index}
              className="UsedComponent"
              draggable // 드래그 가능하도록 설정
              onDragStart={(event) => onUsedComponentDragStart(event, component)} // 드래그 앤 드롭 핸들러 추가
            >
              {component}
              <button className="UsedComponentDelete" onClick={() => onDeleteComponent(index)}>
                <img src={getImageSource('delete')} alt="Delete" className="UsedComponentDeleteButton" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsedComponentList;