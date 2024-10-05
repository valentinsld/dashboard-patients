<script setup>
defineProps({
    isLoading: Boolean,
})
</script>

<template>
    <div class="loader" :class="{'is-loading': isLoading}">
        <UIcon class="loader__icon w-5 h-5" name="i-heroicons-arrow-path-20-solid" />
    </div>
</template>

<style lang="scss" scoped>
.loader {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    transition: opacity 0.3s;
    opacity: 0;
    pointer-events: none;

    &.is-loading {
        opacity: 1;
        pointer-events: all;
    }

    & > span {
        animation: spin 1s linear infinite;

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }
}
</style>