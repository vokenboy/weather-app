# Weather-App

## Description

**Weather-App** is a single-page TypeScript application that lets you search for, add current weather forecasts for any city, ZIP code, or geographic coordinates.

## Tech Stack

-   **Language:** TypeScript
-   **Bundler:** Vite
-   **CSS Framework:** Bulma
-   **Server for Production Preview:** http-server
-   **API:** [OpenWeatherMap](https://openweathermap.org/current)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) ≥ 14
-   [npm](https://www.npmjs.com/) or other Node package manager
-   An OpenWeatherMap API key

### Installation

1. **Clone the repo**
    ```bash
    git clone https://github.com/vokenboy/weather-app
    cd ./weather-app
    cd ./client
    npm install
    ```
2. **Place enviroment variables**
   Make .env file in a root of the ./client
   Place your API_KEY
    ```bash
    VITE_WEATHER_API_KEY=<Your-api-key>
    ```
3. **Running in dev mode**
    ```bash
    npm run dev
    ```
4. **Running in http-server**
   Build the project
    ```bash
    npm run build
    ```
    To run in http-server
    ```bash
    npx http-server ./dist
    ```
