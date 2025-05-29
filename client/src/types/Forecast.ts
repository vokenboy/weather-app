export interface Forecast {
    id?: number;
    iconUrl: string;
    temperature: number;
    city: string;
    country: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    sunsetTime: string;
    sunriseTime: string;
}
