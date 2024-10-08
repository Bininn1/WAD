import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="Home-background">
      <h3 className="Home-h3">Build with the power of</h3>
      <h3 className="Home-h3-3">code - without writing any</h3>
      <Link to="/project-list" ><button className="Home-button-list">프로젝트 리스트</button></Link>
      <Link to="/project/compose"><button className="Home-button-create">프로젝트 생성</button></Link>
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
    </div>
  );
};

export default Home;
