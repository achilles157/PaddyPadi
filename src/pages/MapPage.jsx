import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getReports } from '../services/reportService';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../components/common/Spinner';
import { Locate } from 'lucide-react';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const SAFE_RADIUS_METERS = 500;

const MapPage = () => {
    const { t } = useTranslation();
    const [userLocation, setUserLocation] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nearbyThreats, setNearbyThreats] = useState([]);

    useEffect(() => {
        // 1. Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback or alert user
                }
            );
        }

        // 2. Fetch Reports
        const fetchReports = async () => {
            try {
                const allReports = await getReports();
                // Filter reports that have location data
                const validReports = allReports.filter(r => r.location && r.location.lat && r.location.lng);
                setReports(validReports);
            } catch (err) {
                console.error("Error fetching reports for map:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    // 3. Calculate Threats
    useEffect(() => {
        if (userLocation && reports.length > 0) {
            const threats = reports.filter(report => {
                if (report.predictionClass === 'normal') return false;
                const distance = calculateDistanceInMeters(
                    userLocation.lat,
                    userLocation.lng,
                    report.location.lat,
                    report.location.lng
                );
                return distance <= SAFE_RADIUS_METERS;
            });
            setNearbyThreats(threats);
        }
    }, [userLocation, reports]);

    // Haversine formula
    const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen pb-20">
                <Spinner />
                <p className="ml-2 text-gray-500">{t('map.loading')}</p>
            </div>
        );
    }

    // Default center (Indonesia roughly) if no user location yet
    const center = userLocation || { lat: -2.5489, lng: 118.0149 };
    const zoom = userLocation ? 15 : 5;

    return (
        <div className="h-screen pb-20 relative">
            {/* Overlay Alert */}
            {userLocation && (
                <div className={`absolute top-4 left-4 right-4 z-[1000] p-4 rounded-xl shadow-lg border-l-8 ${nearbyThreats.length > 0 ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'
                    }`}>
                    <h3 className="font-bold text-lg">
                        {nearbyThreats.length > 0 ? t('map.warning_title') : t('map.safe_title')}
                    </h3>
                    <p className="text-sm">
                        {nearbyThreats.length > 0
                            ? t('map.warning_desc', { count: nearbyThreats.length, radius: SAFE_RADIUS_METERS })
                            : t('map.safe_desc', { radius: SAFE_RADIUS_METERS })
                        }
                    </p>
                </div>
            )}

            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
                zoomControl={false} // Disable default zoom control
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Custom Zoom Control Position */}
                <ZoomControl position="bottomright" />

                {/* Recenter Button */}
                {userLocation && (
                    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: '80px', marginRight: '10px', pointerEvents: 'auto', zIndex: 1000 }}>
                        <RecenterButton center={userLocation} />
                    </div>
                )}


                {/* User Marker */}
                {userLocation && (
                    <>
                        <Marker position={userLocation}>
                            <Popup>{t('map.your_location')}</Popup>
                        </Marker>
                        <Circle
                            center={userLocation}
                            radius={SAFE_RADIUS_METERS}
                            pathOptions={{
                                color: nearbyThreats.length > 0 ? 'red' : 'green',
                                fillColor: nearbyThreats.length > 0 ? 'red' : 'green',
                                fillOpacity: 0.1
                            }}
                        />
                    </>
                )}

                {/* Disease Markers */}
                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={report.location}
                    // Optional: Custom icon for diseases vs normal
                    >
                        <Popup>
                            <div className="text-center">
                                <h4 className="font-bold capitalize">{report.predictionClass.replace(/_/g, ' ')}</h4>
                                <p className="text-xs text-gray-500">
                                    {(report.confidence * 100).toFixed(0)}% • {new Date(report.timestamp?.seconds * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        </Popup>
                        {/* Circle for disease spread visualization */}
                        {report.predictionClass !== 'normal' && (
                            <Circle
                                center={report.location}
                                radius={100} // Visual radius for disease report
                                pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.2, weight: 1 }}
                            />
                        )}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

// Component to handle recentering
const RecenterButton = ({ center }) => {
    const map = useMap();
    const { t } = useTranslation();

    const handleRecenter = () => {
        map.flyTo(center, 15);
    };

    return (
        <button
            onClick={handleRecenter}
            className="bg-white p-2 rounded-md shadow-md border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
            title={t('map.recenter') || "Pusatkan Peta"}
            style={{ width: '34px', height: '34px' }}
        >
            <Locate className="w-5 h-5 text-gray-700" />
        </button>
    );
};

export default MapPage;
