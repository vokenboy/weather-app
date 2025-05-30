<script setup lang="ts">
import { type Forecast } from "../types/Forecast";

const props = defineProps<{
    forecasts: Forecast[];
}>();

const emit = defineEmits<{
    (e: "remove", id: number | undefined): void;
}>();
</script>

<template>
    <div class="table-container">
        <table class="table is-fullwidth is-hoverable is-bordered">
            <thead>
                <tr>
                    <th>Icon</th>
                    <th>°C</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Humidity</th>
                    <th>Pressure</th>
                    <th>Wind Speed</th>
                    <th>Sunset</th>
                    <th>Sunrise</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="forecast in props.forecasts" :key="forecast.id">
                    <td>
                        <div class="image is-32x32">
                            <img :src="forecast.iconUrl" alt="Weather icon" />
                        </div>
                    </td>
                    <td>{{ forecast.temperature }}</td>
                    <td>{{ forecast.city }}</td>
                    <td>{{ forecast.country }}</td>
                    <td>{{ forecast.humidity }}%</td>
                    <td>{{ forecast.pressure }} hPa</td>
                    <td>{{ forecast.windSpeed }} km/h</td>
                    <td>{{ forecast.sunsetTime }}</td>
                    <td>{{ forecast.sunriseTime }}</td>
                    <td>
                        <button class="button is-small is-danger" @click="emit('remove', forecast.id)">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
