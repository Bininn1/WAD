// src/store/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { symlink } from 'fs';
import { type } from 'os';

// 초기 상태 정의
interface CanvasElement {
  type : string;  // 추가
  isSelected : boolean; // 추가
  left: number;
  top: number;
  width : number; // 추가
  height : number;  // 추가
  initialX?: number;
  initialY?: number;  // 초기 X, Y 좌표를 저장하기 위한 필드 추가
  isCollidingOther?: boolean; // 추가
  styles: StyleElement;
}
export interface StyleElement{
  layoutdisplay?: string;
  layoutdirection?: string;
  layoutalign?: string;
  layoutjustify?: string;
  typofontSize?: string;
  typofontHeight?: string;
  typotextSize?: number;
  typotextcolor?: string;
  typofont?: string;
  typoweight?: string;
  typotextalign?: string;
  typotextstyle?: string;
  backgroundcolor?: string;
  backgroundborder?: string;
  backgroundimage?: string;
  position?: string;
  effectopacity?: string;
  borderstyle?: string;
  tablestylerow?: number;
  tablestylecolmns?: number;
  borderradius?: string;
  bordertable?: string;
  borderimage?: string;
  spacingmargin?: number;
  spacingpadding?: number;
  sizewidth?: number;
  sizeheight?: number;
  sizeoverflow?: string;
}
interface CanvasSizeState {
  width: number;
  height: number;
}
interface CanvasSizeState {
  width: number;
  height: number;
}

//캔버스의 interface 구축
interface CanvasState {
  canvasInfo: CanvasInfo;
  canvasElements: CanvasElement[];
  selectedComponent: CanvasElement | null; // 클릭한 컴포넌트의 width와 height를 저장할 상태 추가
  canvasSize: CanvasSizeState; // 새로운 state 추가
  componentListVisible: boolean;
  
}

//캔버스의 정보를 배열로 저장
const initialState: CanvasState = {
  canvasInfo: {
    reactCode: '',
    vueCode: '',
    angularCode: '',
    boxWidth: 0,
    boxHeight: 0,
  },
  canvasElements: [],
  selectedComponent: null,
  canvasSize: { width: 1360, height: 1840 }, // canvasSize 초기값 설정
  componentListVisible: true,
};

// 컨버스 정보의 타입 정의
interface CanvasInfo {
  reactCode: string;
  vueCode: string;
  angularCode: string;
  boxWidth: number;
  boxHeight: number;
}

const defaultStyles: Partial<StyleElement> = {
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


// 액션 타입 정의
const ADD_CANVAS_ELEMENT = 'canvas/addCanvasElement';
const REMOVE_CANVAS_ELEMENT = 'canvas/removeCanvasElement';
const COPY_CANVAS_ELEMENT = 'canvas/copyCanvasElement';
const SELECT_COMPONENT = 'canvas/selectComponent';
// 캔버스의 컴포넌트 선택 관련 액션 타입 추가
const SET_SELECTED_COMPONENT = 'canvas/setSelectedComponent';
const UPDATE_SELECTED_COMPONENT_SIZE = 'canvas/updateSelectedComponentSize';
const UPDATE_CANVAS_ELEMENT_POSITION = 'canvas/updateCanvasElementPosition';
const UPDATE_COMPONENT_STYLES = 'canvas/updateComponentStyles';


const defaultButtonStyles: StyleElement = {
  // 버튼 관련 초기 스타일
  typotextcolor: 'blue',
  backgroundcolor : 'darkgreen',
  // 나머지 속성들은 undefined 또는 적절한 초기값으로 설정
  layoutdisplay: undefined,
  layoutdirection: undefined,
  layoutalign: undefined,
  layoutjustify: undefined,
  typofontSize: undefined,
  typofontHeight: undefined,
  typotextSize: undefined,
  typofont: undefined,
  typoweight: undefined,
  typotextalign: undefined,
  typotextstyle: undefined,
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
  sizeoverflow: undefined,
};

const defaultHeadingStyles: StyleElement = {
  // 헤딩 관련 초기 스타일
  typotextcolor: 'black',
  backgroundcolor : 'yellow',
  // 나머지 속성들은 undefined 또는 적절한 초기값으로 설정
  layoutdisplay: undefined,
  layoutdirection: undefined,
  layoutalign: undefined,
  layoutjustify: undefined,
  typofontSize: undefined,
  typofontHeight: undefined,
  typotextSize: undefined,
  typofont: undefined,
  typoweight: undefined,
  typotextalign: undefined,
  typotextstyle: undefined,
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
  sizeoverflow: undefined,
};


// 액션 생성 함수 생성
const addCanvasElement = (element: CanvasElement) => {
  let initialStyles = defaultStyles;
  if (element.type === 'Button') {
    initialStyles = { ...defaultStyles, ...defaultButtonStyles };
  } else if (element.type === 'Heading') {
    initialStyles = { ...defaultStyles, ...defaultHeadingStyles };
  }

  return {
    type: ADD_CANVAS_ELEMENT,
    payload: {
      ...element,
      styles: {
        ...initialStyles,
      },
    },
  };
};




const removeCanvasElement = (index: number) => ({
  type: REMOVE_CANVAS_ELEMENT,
  payload: index,
});

  const copyCanvasElement = (payload: { index: number; newElement: CanvasElement }) => ({
    type: COPY_CANVAS_ELEMENT,
    payload,
  });

  const updateCanvasElementPosition = (payload: { index: number; left: number; top: number }) => ({
    type: UPDATE_CANVAS_ELEMENT_POSITION,
    payload,
  });

  const updateSelectedComponentCSS = (updatedCSS: any) => ({
    type: 'canvas/updateSelectedComponentCSS',
    payload: updatedCSS,
  });

// 액션 생성 함수에 선택된 컴포넌트 설정 함수 추가
const setSelectedComponent = (component: CanvasElement) => ({
  type: SET_SELECTED_COMPONENT,
  payload: component,
});

const updateCanvasElements = (elements: CanvasElement[]) => ({
  type: 'canvas/updateCanvasElements',
  payload: elements,
});

const updateComponentStyles = (index: number, styles: any) => ({
  type: UPDATE_COMPONENT_STYLES,
  payload: { index, styles },
});
  
// Slice 생성
const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    toggleComponentListVisibility: (state) => {
      state.componentListVisible = !state.componentListVisible;
    },
    addCanvasElement: (state, action: PayloadAction<CanvasElement>) => {
      state.canvasElements.push(action.payload);
    },
    removeCanvasElement: (state, action: PayloadAction<number>) => {
      state.canvasElements.splice(action.payload, 1);
    },
    copyCanvasElement: (state, action: PayloadAction<{ index: number; newElement: CanvasElement }>) => {
        const { index, newElement } = action.payload;
        state.canvasElements.splice(index + 1, 0, newElement);
    },    setWidthAndHeight: (state, action: PayloadAction<{ width: number; height: number }>) => {
      const { width, height } = action.payload;
      state.canvasInfo.boxWidth = width;
      state.canvasInfo.boxHeight = height;
    },
    updateCanvasElementPosition :( state , action:
      PayloadAction<{ index:number ;left:number ;top:number } >) => {
      const { index,left,top } = action .payload ;
      state .canvasElements[index].left = left;
      state .canvasElements[index].top = top;
    },
    setSelectedComponent: (state, action: PayloadAction<CanvasElement>) => {
      state.selectedComponent = { ...action.payload };
    },    
    updateSelectedComponentCSS: (state, action: PayloadAction<any>) => {
      if (state.selectedComponent) {
        state.selectedComponent.styles = { ...state.selectedComponent.styles, ...action.payload };
      }
    },    
    updateCanvasElements: (state, action: PayloadAction<CanvasElement[]>) => {
      state.canvasElements = action.payload;
    },
    updateComponentStyles: (state, action: PayloadAction<{ index: number; styles: any }>) => {
      const { index, styles } = action.payload;
      state.canvasElements[index].styles = { ...state.canvasElements[index].styles, ...styles };
    },
    setCanvasSize: (state, action: PayloadAction<CanvasSizeState>) => {
      state.canvasSize = action.payload;
    },
  }
});

// 리듀서 및 액션 내보내기
export {
  addCanvasElement,
  removeCanvasElement,
  copyCanvasElement,
  updateCanvasElementPosition,
  setSelectedComponent,
  updateSelectedComponentCSS,
  updateCanvasElements,
  updateComponentStyles,
  defaultButtonStyles,
  defaultHeadingStyles
};
export const { 
  toggleComponentListVisibility,
  setCanvasSize
} = canvasSlice.actions;
export default canvasSlice.reducer;