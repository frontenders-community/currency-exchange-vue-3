<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { TimeserieData } from '../types/index';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  data: TimeserieData
}>();

const totalDuration = 150;
const delayBetweenPoints = totalDuration / props.data.datasets.length;
const previousY = (ctx: any) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: false,
  },
  animation: {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
    },
  },
  scales: {
    x: {
      border: {
        display: true,
      },
      grid: {
        display: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        callback: function (val: any, index: number) {
          return index % 4 === 0 ? props.data.labels[val] : '';
        }
      }
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        color: '#545659'
      }
    }
  }
}
</script>

<template>
  <Line :data="data" :options="options" />
</template>

<style scoped></style>