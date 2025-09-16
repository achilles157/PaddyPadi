import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from './components/layout/MainLayout';

// Pages
import ScanPage from './pages/ScanPage';
import ResultPage from './pages/ResultPage';
import DiseaseDetailPage from './pages/DiseaseDetailPage';

// Halaman-halaman lain (kita buat sebagai placeholder dulu)
const ReportPage = () => <div className="text-center p-8 text-2xl font-bold">Halaman Laporan</div>;
const DiseaseInfoPage = () => <div className="text-center p-8 text-2xl font-bold">Halaman Info Penyakit</div>;
const ProfilePage = () => <div className="text-center p-8 text-2xl font-bold">Halaman Profil</div>;

function App() {
    return (
        <Router>
            <Routes>
                {/* Rute utama akan menggunakan MainLayout */}
                <Route path="/" element={<MainLayout />}>
                    {/* Halaman default saat membuka aplikasi */}
                    <Route index element={<Navigate to="/scan" replace />} />
                    
                    {/* Definisikan semua halaman yang ada di dalam BottomNav */}
                    <Route path="scan" element={<ScanPage />} />
                    <Route path="reports" element={<ReportPage />} />
                    <Route path="diseases" element={<DiseaseInfoPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="diseases" element={<DiseaseInfoPage />} />
                <Route path="diseases/:id" element={<DiseaseDetailPage />} />

                {/* Rute untuk halaman hasil, tidak menggunakan MainLayout agar fokus */}
                <Route path="/result" element={<ResultPage />} />
                
                {/* Nanti kita bisa tambahkan rute login di sini */}
            </Routes>
        </Router>
    );
}

export default App;