import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import AppContent from "./AppContent";

function App() {
  return (
      <AuthProvider>
        <div>
          <Router>
            <AppContent />
          </Router>
        </div>
      </AuthProvider>
  );
}

export default App;
