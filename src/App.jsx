import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Spinner } from './components/common/Spinner'; // <-- Ubah import Spinner

const AuthPage = lazy(() => import('./pages/AuthPage'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const DiseaseInfoPage = lazy(() => import('./pages/DiseaseInfoPage'));
const DiseaseDetailPage = lazy(() => import('./pages/DiseaseDetailPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const ReportDetailPage = lazy (() => import('./pages/ReportDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Komponen untuk melindungi rute
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            {/* 3. Bungkus Routes dengan Suspense */}
            <Suspense fallback={
                <div className="flex justify-center items-center h-screen w-full">
                    {/* Tampilkan loading spinner selagi halaman dimuat */}
                    <Spinner /> 
                </div>
            }>
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
                        <Route path="/report/:reportId" element={<ReportDetailPage />} />
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
            </Suspense>
        </Router>
    );
}

export default App;