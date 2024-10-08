import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Register';
import FindId from './pages/ForgotId';
import FindPw from './pages/ForgotPassword';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectList from './pages/ProjectList';
import ProjectCompose from './pages/ProjectCompose';
import Framework from './components/FrameworkSelectionModal';
import MyPage from './pages/mypage';
import ProfileModify from './pages/ProfileModify';

function AppContent() {
    const excludePaths = ["/project/compose"];
    const { pathname } = useLocation(); // 현재 경로를 얻음
    const isExcludePage = excludePaths.includes(pathname);

    return (
        <div className="app-content-container"> {/* Flexbox를 적용할 부모 컴포넌트 */}
                    {!isExcludePage && <Header />}
            <div className="app-content-main"> {/* 실제 콘텐츠가 들어갈 영역 */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/project/compose" element={<ProjectCompose />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Signup />} />
                        <Route path="/FindId" element={<FindId />} />
                        <Route path="/FindPassword" element={<FindPw />} />
                        <Route path="/project-list" element={<ProjectList />} />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="/profilemodify" element={<ProfileModify />} />
                    </Routes>
            </div>
                    {!isExcludePage && <Footer />}
            </div>
    );
}

export default AppContent;
