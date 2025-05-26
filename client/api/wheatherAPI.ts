import axios from "axios";

const baseURL = "http://api.openweathermap.org";
const apiKey = import.meta.env.VITE_SOME_KEY;

export const getWheather = async () => {
  const data = await axios.get(`${baseURL}/data/2.5/weather`);
};
