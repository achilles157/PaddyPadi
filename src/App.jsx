import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import AuthPage from './pages/AuthPage';
import ScanPage from './pages/ScanPage';
import ReportPage from './pages/ReportPage';
import DiseaseInfoPage from './pages/DiseaseInfoPage';
import ProfilePage from './pages/ProfilePage';
import ResultPage from './pages/ResultPage';
import DiseaseDetailPage from './pages/DiseaseDetailPage';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                {isAuthenticated ? (
                    <Route path="/" element={<MainLayout />}>
                        {/* Rute yang dilindungi */}
                        <Route index element={<Navigate to="/scan" replace />} />
                        <Route path="scan" element={<ScanPage />} />
                        <Route path="reports" element={<ReportPage />} />
                        <Route path="diseases" element={<DiseaseInfoPage />} />
                        <Route path="diseases/:id" element={<DiseaseDetailPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                ) : (
                    <Route path="/" element={<Navigate to="/auth" replace />} />
                )}
                
                {/* Rute publik */}
                <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/scan" replace />} />
                <Route path="/result" element={<ResultPage />} />
            </Routes>
        </Router>
    );
}

export default App;