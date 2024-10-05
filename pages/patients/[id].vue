<script setup>
const id = useRoute().params.id;
</script>

<template>
  <div>
    <h1>Patient {{ id }}</h1>
  </div>
</template>
