import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";

enum RouteNames {
    HOME = "Home",
}

const routes = [
    {
        path: "/",
        name: RouteNames.HOME,
        component: Home,
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
