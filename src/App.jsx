import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import { MainLayout } from './components/layout/MainLayout';
import AuthPage from './pages/AuthPage';
import ScanPage from './pages/ScanPage';
import ResultPage from './pages/ResultPage';
import DiseaseInfoPage from './pages/DiseaseInfoPage';
import DiseaseDetailPage from './pages/DiseaseDetailPage'; // <-- 1. Impor komponen
import ReportPage from './pages/ReportPage';
import ProfilePage from './pages/ProfilePage';

// Komponen untuk melindungi rute
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                {/* Rute Utama (dilindungi) */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/scan" replace />} />
                    <Route path="scan" element={<ScanPage />} />
                    <Route path="reports" element={<ReportPage />} />
                    <Route path="diseases" element={<DiseaseInfoPage />} />
                    <Route path="/disease/:diseaseId" element={<DiseaseDetailPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Rute Publik (Login/Register) */}
                <Route 
                    path="/auth" 
                    element={isAuthenticated ? <Navigate to="/scan" replace /> : <AuthPage />} 
                />

                {/* Rute Hasil (diasumsikan bisa diakses setelah scan) */}
                <Route 
                    path="/result" 
                    element={
                        <ProtectedRoute>
                            <ResultPage />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;