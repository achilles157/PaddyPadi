import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Spinner } from './components/common/Spinner';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const DiseaseInfoPage = lazy(() => import('./pages/DiseaseInfoPage'));
const DiseaseDetailPage = lazy(() => import('./pages/DiseaseDetailPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const ReportDetailPage = lazy(() => import('./pages/ReportDetailPage'));

const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const SaringanTestPage = lazy(() => import('./pages/SaringanTestPage'));

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Spinner />
                <p className="text-gray-500 ml-2">Memverifikasi sesi...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Suspense fallback={
                    <div className="flex justify-center items-center h-screen w-full">
                        <Spinner />
                        <p className="text-gray-500 ml-2">Memuat aplikasi...</p>
                    </div>
                }>
                    <Routes>
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
                            <Route path="/result" element={<ResultPage />} />
                            <Route path="/map" element={<MapPage />} />
                            <Route path="test-saringan" element={<SaringanTestPage />} />
                        </Route>

                        <Route
                            path="/auth"
                            element={
                                <AuthRedirect />
                            }
                        />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
}

const AuthRedirect = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Spinner />
                <p className="text-gray-500 ml-2">Memverifikasi sesi...</p>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/scan" replace /> : <AuthPage />;
};

export default App;