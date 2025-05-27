<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { type Forecast } from "../types/Forecast";
import { type WeatherData } from "../types/WeatherData";
import ForecastModal from "../components/ForecastModal.vue";
import ForecastTable from "../components/ForecastTable.vue";

const isModalOpen = ref(false);
const searchTerm = ref("");
const forecasts = ref<Forecast[]>([]);
let nextId = ref(0);

const setModalState = (state: boolean) => {
    isModalOpen.value = state;
};

const handleRemove = (id: number) => {
    forecasts.value.splice(id, 1);
    localStorage.setItem("forecasts", JSON.stringify(forecasts.value));
};

const filteredForecasts = computed(() => {
    const term = searchTerm.value.trim().toLowerCase();
    if (!term) {
        return forecasts.value;
    }

    function matches(f: Forecast): boolean {
        const city = f.city.toLowerCase();
        const country = f.country.toLowerCase();
        return city.includes(term) || country.includes(term);
    }

    return forecasts.value.filter(matches);
});

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

onMounted(() => {
    const saved = localStorage.getItem("forecasts");
    if (saved) {
        const parsed: Forecast[] = JSON.parse(saved);
        forecasts.value = parsed;
        const maxId = parsed.reduce((m, f) => Math.max(m, f.id), 0);
        nextId.value = maxId + 1;
    }
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
            <ForecastTable :forecasts="filteredForecasts" @remove="handleRemove" />
        </div>
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
</style>
