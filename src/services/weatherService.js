import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (lat, lon) => {
    if (!API_KEY) {
        console.warn("OpenWeatherMap API Key is missing. Using mock data.");
        return getMockWeather();
    }

    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                lat,
                lon,
                units: 'metric',
                appid: API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather:", error);
        throw error;
    }
};

export const calculateDiseaseRisk = (weatherData) => {
    if (!weatherData || !weatherData.main) return null;

    const { temp, humidity } = weatherData.main;
    const weatherId = weatherData.weather[0].id; // 2xx: Thunderstorm, 3xx: Drizzle, 5xx: Rain

    let risks = [];

    // High Humidity (> 80%)
    if (humidity > 80) {
        risks.push({
            type: 'Jamur (Fungal)',
            level: 'High',
            diseases: ['Blast', 'Hawar Pelepah (Sheath Blight)'],
            description: 'Kelembaban tinggi memicu pertumbuhan jamur.'
        });
    }

    // Rain (Weather ID 5xx or 2xx)
    if (weatherId >= 200 && weatherId < 600) {
        risks.push({
            type: 'Bakteri',
            level: 'Medium',
            diseases: ['Hawar Daun Bakteri (BLB)'],
            description: 'Hujan dapat menyebarkan bakteri antar tanaman.'
        });
    }

    // High Temp (> 32°C)
    if (temp > 32) {
        risks.push({
            type: 'Hama & Cekaman Panas',
            level: 'Medium',
            diseases: ['Wereng', 'Stress Panas'],
            description: 'Suhu tinggi dapat mempercepat siklus hidup hama.'
        });
    }

    if (risks.length === 0) {
        return { status: 'Low', message: 'Kondisi cuaca saat ini relatif aman.' };
    }

    return { status: 'Warning', risks };
};

const getMockWeather = () => {
    return {
        name: "Jakarta (Mock)",
        main: {
            temp: 28,
            humidity: 85,
        },
        weather: [
            { id: 500, main: "Rain", description: "light rain" }
        ],
        wind: {
            speed: 5
        }
    };
};
