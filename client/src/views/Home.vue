<script setup lang="ts">
import { ref } from "vue";
import ForecastCard from "../components/ForecastCard.vue";
</script>
<template>
    <input class="input" type="text" placeholder="Text input" />
    <button class="button is-primary">Add forecast</button>
    <ForecastCard></ForecastCard>
</template>
