import React, { useState } from 'react';
import './ComponentStyles.css';
import { RootState } from '../store/Store'
import { useSelector } from 'react-redux';

//이미지 넣기
import Layoutalignmiddle from "../assets/img/images/alignmiddle1.png";
import Layoutalignup from "../assets/img/images/alignup.png";
import Layoutaligndown from "../assets/img/images/aligndown.png";
import Layoutjustifyleft from "../assets/img/images/alignleft.png";
import Layoutjustifycenter from "../assets/img/images/aligncenter.png";
import Layoutjustifyright from "../assets/img/images/alignright.png";
import Tyopgraphystylecurve from "../assets/img/images/textcurve.png";
import Typographystyleunderline from "../assets/img/images/testunderline.png";
import Typograhpystylebold from "../assets/img/images/textbold.png";
import LayoutDirectionexchange from "../assets/img/images/exchange.png";
import Sizeoverflowopen from "../assets/img/images/overflowopen.png";
import Sizeoverflowhide from "../assets/img/images/overflowhide.png";
import Mainmenuopencheck from "../assets/img/images/closecheck.png";
import Mainmenucheck from "../assets/img/images/opencheck.png";

const App: React.FC = () => {
  const componentListVisible = useSelector((state: RootState) => state.canvas.componentListVisible);

  const [expandedStates, setExpandedStates] = useState({
    LayoutExpanded: false,
    TypographyExpanded: false,
    BackgroundsExpanded: false,
    SpacingExpanded: false,
    PositionExpanded: false,
    EffectsExpanded: false,
    BordersExpanded: false,
    SizeExpanded: false,

  });

  const [typographyFont, setTypographyFont] = useState('');
  const [typographyWeight, setTypographyWeight] = useState('');
  const [typographySize, setTypographySize] = useState('');
  const [typographyHeight, setTypographyHeight] = useState('');
  const [typographyColor, setTypographyColor] = useState('#ffffff');
  //backgrounds color함수
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [positionValue, setPositionValue] = useState('');
  //backgrounds border 테두리 색상 함수
  const [borderColor, setBorderColor] = useState('#ffffff');
  //backgrounds image 테두리 색상 함수
  const [backimageColor, setBackimageColor] = useState('#ffffff');

  //image 토글에 추가
  const [showImage, setShowImage]= useState(false);
  //opacity 조절 함수
  const [opacitySliderValue, setOpacitySliderValue] = useState(50);
  const [effectsRows, setEffectsRows] = useState('');
  const [effectsColmns, setEffectsColmns] = useState('');
  //border스타일
  const [bordersstyle, setBordersStyle] = useState('');
  const [bordertablestyle, setBordertablestyle] = useState('');
  const [borderimagestyle, setBorderimagestyle] = useState('');
  //Size스타일
  const [sizewidthSize, setSizewidthSize] = useState('');
  const [sizeheightSize, setSizeheightSize] = useState('');
  //spacing스타일
  const [spacingmarignSize, setSpacingmarignSize] = useState('');
  const [spacingpaddingSize, setSpacingpaddingSize] = useState('');
  //effect borderstyle
  const [effborderstyle, setEffborderstyle] = useState('');
  const [menuImage, setMenuImage] = useState('Mainmenucheck');

  const [layoutImage, setLayoutImage] = useState(Mainmenucheck);
  const [typographyImage, setTypographyImage] = useState(Mainmenucheck);
  const [backgroundsImage, setBackgroundsImage] = useState(Mainmenucheck);
  const [positionImage, setPositionImage] = useState(Mainmenucheck);
  const [effectsImage, setEffectsImage] = useState(Mainmenucheck);
  const [bordersImage, setBordersImage] = useState(Mainmenucheck);
  const [spacingImage, setSpacingImage] = useState(Mainmenucheck);
  const [sizeImage, setSizeImage] = useState(Mainmenucheck);

  

  const handleImageClick = () => {
    const newImage = menuImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setMenuImage(newImage);
  };
  // 각 메뉴를 토글하는 함수`
  const toggleLayout = () => {
    const newImage = layoutImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setLayoutImage(newImage); 
    setExpandedStates({ ...expandedStates, LayoutExpanded: !expandedStates.LayoutExpanded });
  };

  const toggleTypography = () => {
    const newImage = typographyImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setTypographyImage(newImage); 
    setExpandedStates({ ...expandedStates, TypographyExpanded: !expandedStates.TypographyExpanded });
  };

  const toggleBackgrounds = () => {
    const newImage = backgroundsImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setBackgroundsImage(newImage); 
    setExpandedStates({ ...expandedStates, BackgroundsExpanded: !expandedStates.BackgroundsExpanded });
  };

  const toggleSpacing = () => {
    const newImage = spacingImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setSpacingImage(newImage); 
    setExpandedStates({ ...expandedStates, SpacingExpanded: !expandedStates.SpacingExpanded });
  };

  const togglePosition = () => {
    const newImage = positionImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setPositionImage(newImage); 
    setExpandedStates({ ...expandedStates, PositionExpanded: !expandedStates.PositionExpanded });
  };

  const toggleEffects = () => {
    const newImage = effectsImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setEffectsImage(newImage); 
    setExpandedStates({ ...expandedStates, EffectsExpanded: !expandedStates.EffectsExpanded });
  };

  const toggleBorders = () => {
    const newImage = bordersImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setBordersImage(newImage); 
    setExpandedStates({ ...expandedStates, BordersExpanded: !expandedStates.BordersExpanded });
  };

  const toggleSize = () => {
    const newImage = sizeImage === Mainmenucheck ? Mainmenuopencheck : Mainmenucheck;
    setSizeImage(newImage); 
    setExpandedStates({ ...expandedStates, SizeExpanded: !expandedStates.SizeExpanded });
  };





  //Typogrhpy 폰트 선택함수
  const handleTypographyFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypographyFont(event.target.value);
  };
  //Typogrphy weight 함수
  const handleTypographyWeightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypographyWeight(event.target.value);
  };
  //Typography size함수
  const handleTypographySizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypographySize(event.target.value);
  };
  //Typography height 함수
  const handleTypographyHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypographyHeight(event.target.value);
  };
//Typography color함수
  const handleTypographyColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setTypographyColor(newColor);
  };

//backgrounds color함수
  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setBackgroundColor(newColor);
  };
//backgrounds border color함수
  const handleBorderColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setBorderColor(newColor);
  };
  //backgorunds Backimage color 함수
  const handleBackimageColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setBackimageColor(newColor);
  };

//Position position함수
  const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPositionValue(event.target.value);
  };

//effects- opacity 함수
  const handleOpacitySliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setOpacitySliderValue(newValue);
  };
//effects -borderstyle 함수handleEffborderstyleChange
  const handleEffborderstyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEffborderstyle(event.target.value);
  };
//effects-row함수
  const handleEffectsRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEffectsRows(event.target.value);
  };

//effect-colmns 함수
  const handleEffectsColmnsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEffectsColmns(event.target.value);
  };
//broder- style 함수
  const handleBordersStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBordersStyle(event.target.value);
  };
//border- tablestyle함수
  const handleBordertablestyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBordertablestyle(event.target.value);
  };
//border -imagestyle함수
  const handleBorderimagestyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBorderimagestyle(event.target.value);
  };
//size - width함수
  const handleSizewidthSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSizewidthSize(event.target.value);
  };
//size - height함수
  const handleSizeheightSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSizeheightSize(event.target.value);
  };

//spacing- marigin함수
  const handleSpacingmarignSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpacingmarignSize(event.target.value);
  };
//spacing- padding함수
  const handleSpacingpaddingSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpacingpaddingSize(event.target.value);
  };





  return (
    <div className="css-container" style={{ display: componentListVisible ? 'block' : 'none' }}>

        <div className="content">
          {/* */}
        </div>
        <div className={`right-sidebar ${expandedStates.LayoutExpanded || expandedStates.TypographyExpanded || expandedStates.BackgroundsExpanded || expandedStates.SpacingExpanded || expandedStates.PositionExpanded || expandedStates.EffectsExpanded || expandedStates.BordersExpanded ? 'expanded' : ''}`}>

          {/* menu1-layout */}
          <div className={`css-menu ${expandedStates.LayoutExpanded ? 'active' : ''}`} onClick={toggleLayout}>
            <label htmlFor="layouttext" className="mainboxtext">Layout</label><img src={layoutImage}/>
          </div>
          {expandedStates.LayoutExpanded &&  (
              <div className="layoutsidebar-content">
                

                <div className="css-menu-container">
                  {/*layout부분의 direction 메뉴 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="directiontext" className="subboxtext">Direction</label>
                  </div>
                  <div className='button-container3'>
                    <button className="direction-button1" style={{ fontSize: '12px', color: '#ffffff' }}>Horizontal</button>
                    <button className="direction-button2" style={{ fontSize: '12px', color: '#ffffff' }}>Vertical</button>
                    <button className="direction-button3" ><img src={LayoutDirectionexchange} alt="Button4" /></button>
                  </div>
                </div>

                <div className="css-menu-container">
                  {/*layout부분의 align 메뉴*/}
                  <div className='subboxtext-container'>
                    <label htmlFor="aligntext" className="subboxtext">Align</label>
                  </div>
                  <div className='button-container3'>
                    <button className="align-button1"><img src={Layoutalignup} alt="Button1" /></button>
                    <button className="align-button2"><img src={Layoutalignmiddle} alt="Button2" /></button>
                    <button className="align-button3"><img src={Layoutaligndown} alt="Button3" /></button>
                  </div>
                </div>

                <div className="css-menu-container">
                  {/*layout부분의 justify 메뉴 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="Justifytext" className="subboxtext">Justify</label>
                  </div>
                  <div className='button-container3'></div>
                  <button className="Justify-button1"><img src={Layoutjustifyleft} alt="Button1" /></button>
                  <button className="Justify-button2"><img src={Layoutjustifycenter} alt="Button2" /></button>
                  <button className="Justify-button3"><img src={Layoutjustifyright} alt="Button3" /></button>

                </div>

              </div>
          )}


          {/* menu2-Typography */}
          {/* Typography기본 박스 형태 */}
          <div className={`css-menu ${expandedStates.TypographyExpanded ? 'active' : ''}`} onClick={toggleTypography}>
            <label htmlFor="typotext" className="mainboxtext" >Typography</label><img src={typographyImage}/>
          </div>

          {expandedStates.TypographyExpanded &&  (
              <div className="Typographysidebar-content">
                <div className="css-menu-container">
                  {/*typo font 폰트 선택하는 메뉴 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="fonttext" className="subboxtext">Font</label>
                  </div>
                  <select id="typography-font" className="typoselect" value={typographyFont} onChange={handleTypographyFontChange}>
                    <option value="">Select a font</option>
                    <option value="Arial" >Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>

                <div className="css-menu-container">
                  {/*typo weight 선택하는 메뉴 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="weighttext" className="subboxtext">Weight</label>
                  </div>
                  <select id="typography-weight" className="typoweight" value={typographyWeight} onChange={handleTypographyWeightChange}>
                    <option value="">Select a weight</option>
                    <option value="Normal" >Normal</option>
                    <option value="Bold">Bold</option>
                    <option value="Light">Light</option>
                  </select>
                </div>

                <div className="css-menu-container">
                  {/* typo 텍스트 size 설정 및 텍스트 height 설정*/}
                  <div className='subboxtext-container'>
                    <label htmlFor="sizetext" className="subboxtext">textSize</label>
                  </div>
                  <input type="text" id="typography-size" className="typography-size"  value={typographySize} onChange={handleTypographySizeChange} />
                  <div className='subboxtext-container'>
                    <label htmlFor="heighttext" className="subboxtext">Height</label>
                  </div>
                  <input type="text" id="typography-height" value={typographyHeight} onChange={handleTypographyHeightChange} />
                </div>

                <div className="css-menu-container">
                  {/*typo color 선택 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="colortext" className="subboxtext">textColor</label>
                  </div>
                  <input type="color" id="typography-color" value={typographyColor} onChange={handleTypographyColorChange} />
                </div>

                <div className="css-menu-container">
                  {/*typo 텍스트 위치 설정 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="fonttext" className="subboxtext">align</label>
                  </div>
                  <button className="typoalign-button1"><img src={Layoutalignup} alt="Button1" /></button>
                  <button className="typoalign-button2"><img src={Layoutalignmiddle} alt="Button2" /></button>
                  <button className="typoalign-button2"><img src={Layoutaligndown} alt="Button3" /></button>
                </div>

                <div className="css-menu-container">
                  {/*typo 텍스트 기울기.밑줄.볼드 설정 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="fonttext" className="subboxtext">style</label>
                  </div>
                
                    <button className="typostyle-button1"><img src={Tyopgraphystylecurve} alt="Button1" /></button>
                    <button className="typostyle-button2"><img src={Typographystyleunderline} alt="Button2" /></button>
                    <button className="typostyle-button3"><img src={Typograhpystylebold} alt="Button3" /></button>
                  </div>
                

              </div>
          )}





          {/* menu3-Backgrounds */}
          
          <div className={`css-menu ${expandedStates.BackgroundsExpanded ? 'active' : ''}`} onClick={toggleBackgrounds}>
            <label htmlFor="layouttext" className="mainboxtext">Backgrounds</label><img src={backgroundsImage}/>
          </div>

          {expandedStates.BackgroundsExpanded && (
              <div className="Backgroundsidebar-content">
                {/* */}
                <div className="css-menu-container">
                  <div className='subboxtext-container'>
                    <label htmlFor="colortext" className="subboxtext">Color</label>
                  </div>
                  <input type="color" id="background-color" value={backgroundColor} onChange={handleBackgroundColorChange}/>
                </div>

                <div className="css-menu-container">
                  {/* */}
                  <div className='subboxtext-container'>
                    <label htmlFor="bordertext" className="subboxtext">border</label>
                  </div>
                  <input type="color" id="background-color" value={borderColor} onChange={handleBorderColorChange}/>
                </div>

                <div className="css-menu-container">
                  {/* */}
                  <div className='subboxtext-container'>
                    <label htmlFor="backimagetext" className="subboxtext">image</label>
                  </div>
                  <input type="color" id="background-color" value={backimageColor} onChange={handleBackimageColorChange}/>

                </div>

              </div>

          )}



          {/* menu4-Position */}
          
          <div className={`css-menu ${expandedStates.PositionExpanded ? 'active' : ''}`} onClick={togglePosition}>
            <label htmlFor="Positiontext" className="mainboxtext">Position</label><img src={positionImage}/>
          </div>

          {expandedStates.PositionExpanded && (
              <div className="Positionsidebar-content">
                <div className="css-menu-container">
                  <div className='subboxtext-container'>
                    <label htmlFor="Positiontext" className="subboxtext">Position</label>
                  </div>
                  <select id="position" className="positionselect" value={positionValue} onChange={handlePositionChange}>
                    <option value="">위치를 선택하세요</option>
                    <option value="static">static</option>
                    <option value="relative">relative</option>
                    <option value="absolute">absolute</option>
                    <option value="fixed">fixed</option>
                  </select>
                </div>
              </div>


          )}



          {/* menu5-effects */}
          
          <div className={`css-menu ${expandedStates.EffectsExpanded ? 'active' : ''}`} onClick={toggleEffects}>
            <label htmlFor="Effectstext" className="mainboxtext">Effects</label><img src={effectsImage}/>
          </div>

          {expandedStates.EffectsExpanded && (
              <div className="Effectssidebar-content">
                <div className="css-menu-container">
                  {/* effect opacity 투명 조정 그래프 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="effopacitytext" className="subboxtext">opacity</label>
                  </div>
                  <input type="range" min="0" max="100" value={opacitySliderValue} onChange={handleOpacitySliderChange} className="opacityrange"/>
                  {/* 숫자를 바로 오른쪽에 표시 */}
                  <span className="slider-value">{opacitySliderValue}%</span>
                </div>


                <div className="css-menu-container">
                  {/* effect테두리 스타일 메뉴  */}
                  <div className='subboxtext-container1'>
                    <label htmlFor="borderstylestext" className="subboxtext" >borderstyle</label>
                  </div>
                </div>
                <div className="css-menu-container">
                  {/* effect테두리 스타일 선택 칸 =>토글하고 싶은데 못했음 */}
                  <select id="border" className="effborderselect" value={effborderstyle} onChange={handleEffborderstyleChange}>
                    <option value=" "> Select a Image style</option>
                    <option value=" not"> 없음</option>
                    <option value=" solid"> solid</option>
                    <option value=" dotted"> dotted</option>
                    <option value=" double"> double</option>
                  </select>
                </div>


                <div className="css-menu-container">
                  {/* effect 테이블(row,colmns) 스타일 =>토글하고 싶은데 못했음 */}
                  <div className='subboxtext-container'>
                    <label htmlFor="tablestyletext" className="subboxtext">tablestyle</label>
                  </div>
                </div>
                <div className="css-menu-container">
                  <span className="subboxtext">{effectsRows}Row</span>
                  <input type="table" id="effecttable-row" value={effectsRows} onChange={handleEffectsRowsChange} className="tablerow" />

                  <span className="subboxtext">{effectsColmns}Colmns</span>
                  <input type="table" id="effecttable-row" value={effectsColmns} onChange={handleEffectsColmnsChange} className="tablecolmns" />

                </div>

              </div>


          )}



          {/* menu6-borders */}
          
          <div className={`css-menu ${expandedStates.BordersExpanded ? 'active' : ''}`} onClick={toggleBorders}>
            <label htmlFor="Borderstext" className="mainboxtext">Borders</label><img src={bordersImage}/>
          </div>

          {expandedStates.BordersExpanded && (
              <div className="Borderssidebar-content">
                <div className="css-menu-container">
                  <div className='subboxtext-container'>
                    <label htmlFor="Borderstext" className="subboxtext">radius</label>
                  </div>
                  {/* 테두리 모서리 스타일 선택*/}
                  <select id="Borders-font" className="Bordersselect" value={bordersstyle} onChange={handleBordersStyleChange}>
                    <option value="">Select a Border style</option>
                    <option value="not" >없음</option>
                    <option value="solid" >solid</option>
                    <option value="dotted">dotted</option>
                    <option value="double">double</option>
                  </select>
                </div>

                <div className="css-menu-container">
                  <div className='subboxtext-container'>
                    <label htmlFor="Borderstext" className="subboxtext">table</label>
                  </div>
                  {/* 테이블 모서리 스타일 선택*/}
                  <select id="Bordertable-select" className="Bordertableselect" value={bordertablestyle} onChange={handleBordertablestyleChange} >
                    <option value=" "> Select a Table style</option>
                    <option value=" not"> 없음</option>
                    <option value=" solid"> solid</option>
                    <option value=" dotted"> dotted</option>
                    <option value=" double"> double</option>
                  </select>

                </div>

                <div className="css-menu-container">
                  {/* 이미지 모서리 스타일 선택*/}
                  <div className='subboxtext-container'>
                    <label htmlFor="Borderstext" className="subboxtext">image</label>
                  </div>
                  <select id="Borderimage-select" className="Borderimageselect" value={borderimagestyle} onChange={handleBorderimagestyleChange} >
                    <option value=" "> Select a Image style</option>
                    <option value=" not"> 없음</option>
                    <option value=" solid"> solid</option>
                    <option value=" dotted"> dotted</option>
                    <option value=" double"> double</option>
                  </select>
                </div>


              </div>

          )}




          {/* menu7-spacing */}
          
          <div className={`css-menu ${expandedStates.SpacingExpanded ? 'active' : ''}`} onClick={toggleSpacing}>
            <label htmlFor="Spacingtext" className="mainboxtext">Spacing</label><img src={spacingImage}/>
          </div>

          {expandedStates.SpacingExpanded && (
              <div className="Spacingsidebar-content">
                <div className="css-menu-container">
                  <span className="subboxtext">{spacingmarignSize}margin</span>
                  <input type="table" id="Spacing-margin" value={spacingmarignSize} onChange={handleSpacingmarignSizeChange} className="Spacingmargin" />

                  <span className="subboxtext">{spacingpaddingSize}padding</span>
                  <input type="table" id="Spacing-padding" value={spacingpaddingSize} onChange={handleSpacingpaddingSizeChange} className="Spacingpadding" />

                </div>


              </div>




          )}



          {/* menu8-Size */}
          <div className={`css-menu ${expandedStates.SizeExpanded ? 'active' : ''}`} onClick={toggleSize}>
            <label htmlFor="Sizetext" className="mainboxtext">Size</label><img src={sizeImage}/>
          </div>

          {expandedStates.SizeExpanded && (
              <div className="Sizesidebar-content">
                <div className="css-menu-container">
                  <span className="subboxtext">{sizewidthSize}Width</span>
                  <input type="table" id="Size-width" value={sizewidthSize} onChange={handleSizewidthSizeChange} className="sizewidth" />

                  <span className="subboxtext">{sizeheightSize}Height</span>
                  <input type="table" id="Size-height" value={sizeheightSize} onChange={handleSizeheightSizeChange} className="sizeheight" />


                </div>



                <div className="css-menu-container">
                  <div className='subboxtext-container'>
                    <label htmlFor="Sizetext" className="subboxtext">overflow</label>
                  </div>
                  {/*보이기 숨기기*/}
                  <div className='button-container2'>
                    <button className="sizeoverflow-button1"><img src={Sizeoverflowopen} alt="Button1" /></button>
                    <button className="sizeoverflow-button2"><img src={Sizeoverflowhide} alt="Button2" /></button>
                  </div>
                </div>



              </div>


          )}


        </div>
      </div>
  );
}

export default App;