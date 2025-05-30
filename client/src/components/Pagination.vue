<script setup lang="ts">
const props = defineProps<{
    currentPage: number;
    totalPages: number;
}>();

const emit = defineEmits<{
    (e: "update:currentPage", page: number): void;
}>();

const changePage = (page: number) => {
    if (page < 1) page = 1;
    if (page > props.totalPages) page = props.totalPages;
    emit("update:currentPage", page);
};
</script>
<template>
    <nav class="pagination is-centered mt-4" role="navigation" aria-label="pagination">
        <button class="pagination-previous" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            Previous
        </button>
        <button class="pagination-next" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            Next
        </button>
        <ul class="pagination-list">
            <li v-for="page in totalPages" :key="page">
                <button
                    class="pagination-link"
                    :class="{ 'is-current': page === currentPage }"
                    @click="changePage(page)"
                >
                    {{ page }}
                </button>
            </li>
        </ul>
    </nav>
</template>
