<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { type Forecast } from "../types/Forecast";
import { type WeatherData } from "../types/WeatherData";
import { getWeatherByCity } from "../api/wheatherAPI.ts";
import ForecastModal from "../components/ForecastModal.vue";
import ForecastTable from "../components/ForecastTable.vue";

const UPDATE_INTERVAL = 5 * 60 * 1000;
const isModalOpen = ref(false);
const searchTerm = ref("");
const forecasts = ref<Forecast[]>([]);
const currentPage = ref(1);
const pageSize = 10;
let nextId = ref(0);

const setModalState = (state: boolean) => {
    isModalOpen.value = state;
};

const handleRemove = (id: number | undefined) => {
    forecasts.value.splice(
        forecasts.value.findIndex((f) => f.id === id),
        1
    );
    localStorage.setItem("forecasts", JSON.stringify(forecasts.value));
};

const handleAdd = (data: WeatherData) => {
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
        sunsetTime: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
    };
    forecasts.value.push(forecast);
    localStorage.setItem("forecasts", JSON.stringify(forecasts.value));
    setModalState(false);
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
                sunsetTime: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
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

    if (search === "") {
        return forecasts.value;
    }

    return forecasts.value.filter((forecast) => {
        const city = forecast.city.toLowerCase();
        const country = forecast.country.toLowerCase();
        return city.includes(search) || country.includes(search);
    });
});

const totalPages = computed(() => {
    const totalItems = filteredForecasts.value.length;
    const pages = Math.ceil(totalItems / pageSize);

    if (pages < 1) {
        return 1;
    } else {
        return pages;
    }
});

const paginatedForecasts = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredForecasts.value.slice(start, start + pageSize);
});

watch([searchTerm, filteredForecasts], () => {
    currentPage.value = 1;
});

onMounted(() => {
    const saved = localStorage.getItem("forecasts");
    if (saved) {
        const parsed: Forecast[] = JSON.parse(saved);
        forecasts.value = parsed;
        let highestId = 0;

        for (const forecast of parsed) {
            if (forecast.id > highestId) {
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
            <ForecastTable v-show="" :forecasts="paginatedForecasts" @remove="handleRemove" />
        </div>

        <nav class="pagination is-centered mt-4" role="navigation" aria-label="pagination">
            <button class="pagination-previous" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
            <button class="pagination-next" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
            <ul class="pagination-list">
                <li v-for="n in totalPages" :key="n">
                    <button
                        class="pagination-link"
                        :class="{ 'is-current': n === currentPage }"
                        @click="currentPage = n"
                    >
                        {{ n }}
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>
.controls {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
}
button {
    margin-left: 1rem;
}
input {
    max-width: 600px;
}
.pagination-list .pagination-link {
    margin: 0 0.25rem;
}
</style>
