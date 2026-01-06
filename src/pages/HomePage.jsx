import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Map, NotebookText, ShieldHalf, CloudRain, Sun, Droplets, Wind, AlertTriangle, ChevronRight } from 'lucide-react';
import { getWeather, calculateDiseaseRisk } from '../services/weatherService';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [weather, setWeather] = useState(null);
    const [riskAnalysis, setRiskAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Get location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const { latitude, longitude } = position.coords;
                        const data = await getWeather(latitude, longitude);
                        setWeather(data);
                        setRiskAnalysis(calculateDiseaseRisk(data));
                        setLoading(false);
                    }, async () => {
                        // Location permission denied, using default/mock data
                        const data = await getWeather(null, null);
                        setWeather(data);
                        setRiskAnalysis(calculateDiseaseRisk(data));
                        setLoading(false);
                    });
                } else {
                    const data = await getWeather(null, null);
                    setWeather(data);
                    setRiskAnalysis(calculateDiseaseRisk(data));
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to load weather", error);
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const QuickNavCard = ({ icon: Icon, label, desc, path, color }) => (
        <div
            onClick={() => navigate(path)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">{label}</h3>
                    <p className="text-xs text-gray-500">{desc}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Halo, Petani! 👋</h1>
                    <p className="text-gray-500 text-sm">{t('app_name')} Dashboard</p>
                </div>
                <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CloudRain size={100} />
                </div>

                {loading ? (
                    <div className="animate-pulse flex space-x-4">
                        <div className="h-20 w-full bg-blue-400/50 rounded"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start z-10 relative">
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{Math.round(weather?.main?.temp)}°C</h2>
                                <p className="opacity-90 flex items-center gap-1">
                                    <Sun size={14} /> {weather?.weather[0]?.main}
                                </p>
                                <p className="text-xs opacity-75 mt-1">{weather?.name}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="flex items-center gap-1 justify-end text-sm">
                                    <Droplets size={14} /> {weather?.main?.humidity}%
                                </div>
                                <div className="flex items-center gap-1 justify-end text-sm">
                                    <Wind size={14} /> {weather?.wind?.speed} m/s
                                </div>
                            </div>
                        </div>

                        {/* Risk Alert */}
                        {riskAnalysis && riskAnalysis.status === 'Warning' ? (
                            <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="text-yellow-300 w-5 h-5" />
                                    <span className="font-bold text-sm text-yellow-50">Resiko Penyakit Tinggi</span>
                                </div>
                                {riskAnalysis.risks.map((risk, idx) => (
                                    <div key={idx} className="mb-1 last:mb-0">
                                        <p className="text-xs font-semibold text-white">{risk.type} ({risk.level})</p>
                                        <p className="text-[10px] text-blue-50">{risk.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 bg-green-500/30 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                                <ShieldHalf size={16} />
                                <span className="text-xs font-medium">Kondisi cuaca mendukung kesehatan tanaman.</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">Fitur Utama</h2>
            <div className="space-y-3">
                <QuickNavCard
                    icon={Map}
                    label="Peta Sebaran"
                    desc="Lihat zona merah & aman"
                    path="/map"
                    color="bg-orange-500"
                />
                <QuickNavCard
                    icon={NotebookText}
                    label="Riwayat Laporan"
                    desc="Arsip hasil diagnosa anda"
                    path="/reports"
                    color="bg-purple-500"
                />
                <QuickNavCard
                    icon={ShieldHalf}
                    label="Ensiklopedia Penyakit"
                    desc="Pelajari cara penanganan"
                    path="/diseases"
                    color="bg-teal-500"
                />
            </div>
        </div>
    );
};

export default HomePage;
