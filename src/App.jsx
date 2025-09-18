import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import { MainLayout } from './components/layout/MainLayout';
import ScanPage from './pages/ScanPage';
import ReportPage from './pages/ReportPage';
import DiseaseInfoPage from './pages/DiseaseInfoPage';
import ProfilePage from './pages/ProfilePage';
import ResultPage from './pages/ResultPage';
import DiseaseDetailPage from './pages/DiseaseDetailPage';
import AuthPage from './pages/AuthPage';

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
                    <Route path="diseases/:id" element={<DiseaseDetailPage />} />
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