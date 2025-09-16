import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import ScanPage from './pages/ScanPage';
import ReportPage from './pages/ReportPage';
import DiseaseInfoPage from './pages/DiseaseInfoPage';
import ProfilePage from './pages/ProfilePage';
import ResultPage from './pages/ResultPage';
import DiseaseDetailPage from './pages/DiseaseDetailPage';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { isAuthenticated } = useAuth();
    return (
        <Router>
            <Routes>
                {isAuthenticated ? (
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Navigate to="/scan" replace />} />
                        <Route path="scan" element={<ScanPage />} />
                        <Route path="reports" element={<ReportPage />} />
                        <Route path="diseases" element={<DiseaseInfoPage />} />
                        <Route path="diseases/:id" element={<DiseaseDetailPage />} /> {/* Pindahkan ke sini */}
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                ) : (
                    // ... Rute untuk halaman login/register
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
                {/* Pisahkan ResultPage jika ingin tampilan fullscreen tanpa nav */}
                <Route path="/result" element={<ResultPage />} />
            </Routes>
        </Router>
    );
}

export default App;