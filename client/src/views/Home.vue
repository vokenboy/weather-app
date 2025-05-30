<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { type Forecast } from "../types/Forecast";
import { type WeatherData } from "../types/WeatherData";
import { getWeatherByCity } from "../api/wheatherAPI.ts";
import ForecastModal from "../components/ForecastModal.vue";
import ForecastTable from "../components/ForecastTable.vue";
import Pagination from "../components/Pagination.vue";

const UPDATE_INTERVAL = 5 * 60 * 1000;
const statusMessage = ref<string | null>(null);
const statusType = ref<"success" | "danger">("success");
const isModalOpen = ref(false);
const searchTerm = ref("");
const forecasts = ref<Forecast[]>([]);
const currentPage = ref(1);
let nextId = ref(0);

const setStatus = (message: string, type: "success" | "danger") => {
    statusMessage.value = message;
    statusType.value = type;
    setTimeout(() => (statusMessage.value = null), 3000);
};

const setModalState = (state: boolean) => {
    isModalOpen.value = state;
};

const handleRemove = (id: number | undefined) => {
    forecasts.value.splice(
        forecasts.value.findIndex((forecast) => forecast.id === id),
        1
    );
    localStorage.setItem("forecasts", JSON.stringify(forecasts.value));
    setStatus("Forecast removed", "success");
};

const handleAdd = (data: WeatherData) => {
    // if forecast exists
    // const exists = forecasts.value.some((forecast) => forecast.city === data.name);
    // if (exists) {
    //     setStatus(`Forecast for ${data.name} already added`, "danger");
    //     return;
    // }

    const id = nextId.value++;
    const forecast: Forecast = {
        id,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        temperature: Math.round(data.main.temp),
        city: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        sunsetTime: new Date(data.sys.sunset * 1000).toLocaleTimeString("lt-LT"),
        sunriseTime: new Date(data.sys.sunrise * 1000).toLocaleTimeString("lt-LT"),
    };
    forecasts.value.unshift(forecast);
    localStorage.setItem("forecasts", JSON.stringify(forecasts.value));
    setModalState(false);
    setStatus("Forecast added", "success");
};

const updateForecasts = async () => {
    const updated: Forecast[] = [];

    for (const oldForecast of forecasts.value) {
        try {
            const data = await getWeatherByCity(oldForecast.city);

            const updatedForecast: Forecast = {
                ...oldForecast,
                iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                temperature: Math.round(data.main.temp),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
                sunsetTime: new Date(data.sys.sunset * 1000).toLocaleTimeString("lt-LT"),
                sunriseTime: new Date(data.sys.sunrise * 1000).toLocaleTimeString("lt-LT"),
            };

            updated.push(updatedForecast);
        } catch (error) {
            console.error(`Failed to update forecast for ${oldForecast.city}:`, error);
        }
    }

    forecasts.value = updated;
    localStorage.setItem("forecasts", JSON.stringify(updated));
};

const filteredForecasts = computed(() => {
    const search = searchTerm.value.trim().toLowerCase();

    return forecasts.value.filter((forecast) => {
        const city = forecast.city.toLowerCase();
        const country = forecast.country.toLowerCase();
        return city.includes(search) || country.includes(search);
    });
});

const totalPages = computed(() => {
    const totalItems = filteredForecasts.value.length;
    const pages = Math.ceil(totalItems / 10);

    if (pages < 1) {
        return 1;
    } else {
        return pages;
    }
});

const paginatedForecasts = computed(() => {
    const start = (currentPage.value - 1) * 10;
    return filteredForecasts.value.slice(start, start + 10);
});

watch([searchTerm, filteredForecasts], () => {
    currentPage.value = 1;
});

onMounted(() => {
    const saved = localStorage.getItem("forecasts");
    if (saved) {
        const parsedForecasts: Forecast[] = JSON.parse(saved);
        forecasts.value = parsedForecasts;
        let highestId = 0;

        for (const forecast of parsedForecasts) {
            if (forecast.id !== undefined && forecast.id > highestId) {
                highestId = forecast.id;
            }
        }

        nextId.value = highestId + 1;
    }
    setInterval(updateForecasts, UPDATE_INTERVAL);
});
</script>

<template>
    <ForecastModal v-if="isModalOpen" :show="isModalOpen" @close="setModalState(false)" @add="handleAdd" />

    <div class="container">
        <div class="controls">
            <input v-model="searchTerm" class="input is-rounded" type="text" placeholder="Search by city or country" />
            <button @click="setModalState(true)" class="button is-primary">Add forecast</button>
        </div>
        <div class="mt-4">
            <div class="status">
                <p v-if="statusMessage" :class="`help is-${statusType}`">
                    {{ statusMessage }}
                </p>
                <p v-else-if="searchTerm.trim() !== '' && filteredForecasts.length === 0" class="help is-danger">
                    No forecast found for {{ searchTerm }}
                </p>
                <p v-else-if="forecasts.length === 0" class="help is-danger">No forecasts available</p>
            </div>
            <ForecastTable
                v-show="paginatedForecasts.length > 0"
                :forecasts="paginatedForecasts"
                @remove="handleRemove"
            />
        </div>
        <Pagination
            v-show="paginatedForecasts.length > 0"
            v-if="paginatedForecasts.length > 0"
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:currentPage="currentPage = $event"
        />
    </div>
</template>

<style scoped>
.controls {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
}
.status {
    min-height: 1.5em;
}
button {
    margin-left: 1rem;
}
input {
    max-width: 600px;
}
</style>
