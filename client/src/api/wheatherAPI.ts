import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeatherByCity = async (city: string, units = "metric") => {
    try {
        const { data } = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units,
            },
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export const getWeatherByZip = async (zip: string, countryCode: string, units: string = "metric") => {
    try {
        const zipParam = `${zip},${countryCode}`;
        const { data } = await axios.get(`${BASE_URL}/weather`, {
            params: {
                zip: zipParam,
                appid: API_KEY,
                units,
            },
        });
        return data;
    } catch (err) {
        console.error("Error fetching weather by ZIP code:", err);
        throw err;
    }
};

export const getWeatherByCords = async (lat: string, lon: string, units: string = "metric") => {
    try {
        const { data } = await axios.get(`${BASE_URL}/weather`, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units,
            },
        });
        return data;
    } catch (err) {
        console.error("Error fetching weather by coordinates:", err);
        throw err;
    }
};
