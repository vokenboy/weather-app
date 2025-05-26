import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import { RouteNames } from "./routes";
import Home from "./views/Home.vue";

const routes = [
    {
        path: "/",
        name: RouteNames.HOME,
        component: Home,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount("#app");
