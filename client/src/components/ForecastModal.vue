<script setup lang="ts">
import { defineProps, ref } from "vue";
import { type WeatherData } from "../types/WeatherData";
import { getWeatherByCity, getWeatherByZip, getWeatherByCords } from "../api/wheatherAPI.ts";

const props = defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    (emit: "close"): any;
    (emit: "add", data: WeatherData): any;
}>();

const search = ref("");
const error = ref("");

const handleClose = () => {
    emit("close");
    search.value = "";
    error.value = "";
};

const handleAdd = async () => {
    const query = search.value.trim();
    if (!query) {
        error.value = "Please enter a city, ZIP code, or coordinates.";
        return;
    }
    error.value = "";

    try {
        let data: WeatherData;

        const coordMatch = query.match(/^\s*([+\-]?\d+(\.\d+)?)\s*,\s*([+\-]?\d+(\.\d+)?)\s*$/);
        if (coordMatch) {
            const [, lat, , lon] = coordMatch;
            data = await getWeatherByCords(lat, lon, "metric");
        } else if (/^\d{5}(,[A-Za-z]{2})?$/.test(query)) {
            const [zip, country] = query.split(",");
            data = await getWeatherByZip(zip, country ?? "lt", "metric");
        } else {
            data = await getWeatherByCity(query, "metric");
        }

        emit("add", data);
        handleClose();
    } catch {
        error.value = "Could not find that location. Please try again.";
    }
};
</script>

<template>
    <div class="modal" :class="{ 'is-active': props.show }">
        <div class="modal-background" @click="handleClose"></div>
        <div class="modal-card">
            <div class="modal-card-head">
                <p class="modal-card-title">Add Forecast</p>
            </div>
            <div class="modal-card-body">
                <div class="field">
                    <input v-model="search" class="input" type="text" placeholder="e.g. City, ZIP, or Coordinates" />
                    <p v-if="error" class="help is-danger">{{ error }}</p>
                </div>
            </div>
            <div class="modal-card-foot">
                <div class="buttons">
                    <button @click="handleAdd" class="button is-primary">Add</button>
                    <button @click="handleClose" class="button">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
