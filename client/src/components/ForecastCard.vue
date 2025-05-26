<script setup lang="ts">
// This component is a hardcoded example of a weather forecast card.
// Later, you can replace hardcoded values with props for dynamic data.
</script>

<template>
    <div class="card" style="width: 18rem">
        <header class="card-header">
            <p class="card-header-title">Vilnius, LT</p>
            <button
                class="card-header-icon button is-small is-danger"
                title="Remove"
            >
                &times;
            </button>
        </header>
        <div class="card-content has-text-centered">
            <img
                src="https://openweathermap.org/img/wn/01d@2x.png"
                alt="Clear sky"
            />
            <p>20°C | 60% Humidity | 5 m/s Wind</p>
            <p>Pressure: 1013 hPa</p>
            <p>Sunrise: 05:12 | Sunset: 20:45</p>
        </div>
    </div>
</template>
