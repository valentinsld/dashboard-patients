<script setup>
import { Line } from "vue-chartjs";
import Chart from "chart.js/auto";

const props = defineProps({
  datas: Array,
});

const chartData = ref({
  labels: Array(props.datas[0].data.length).fill(""),
  datasets: props.datas,
});
const chartOptions = ref({
  responsive: true,
});

watch(
  () => props.datas,
  (newDatas) => {
    chartData.value = {
      labels: Array(newDatas[0].data.length).fill(""),
      datasets: newDatas,
    };
    // chartData.labels = Array(newDatas[0].data.length).fill('')
    // chartData.datasets = newDatas
  }
);
</script>

<template>
  <UCard>
    <Line :options="chartOptions" :data="chartData" />
  </UCard>
</template>
