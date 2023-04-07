<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { API_URL } from "./api/frankfurt";
import { AppState, UploadCurrencyEvent, UploadAmountEvent } from './types/index';
import { useToast } from "vue-toastification";
import CurrencyInput from './components/CurrencyInput.vue';
import CurrencyTimeserie from './components/CurrencyTimeserie.vue';

const toast = useToast();

const state: AppState = reactive({
    currencies: {},
    amount: 1,
    convertedAmount: 0,
    fromCurrency: 'EUR',
    toCurrency: 'USD',
    timeserie: '5g',
    timeserieData: null,
});

onMounted(async () => {
  const { amount, fromCurrency, toCurrency } = state;
  getCurrencies();
  getTimeserie();
  const data = await getConversion(amount, fromCurrency, toCurrency);
  if (data) {
    state.convertedAmount = data;
  }
})

async function getTimeserie() {
  try {
    const endDate = new Date();
    const endDateString = endDate.toISOString().slice(0, 10);
    const startDate = endDate;
    startDate.setMonth(endDate.getMonth() - 1);
    const startDateString = startDate.toISOString().slice(0, 10);

    const response = await fetch(`${API_URL}/${startDateString}..${endDateString}?base=${state.fromCurrency}&to=${state.toCurrency}`);
    if (response.ok) {
      const result = await response.json();
      const labels = Object.keys(result.rates);
      const data = labels.map(key => {
        const item = result.rates[key];
        return item[state.toCurrency];
      })
      state.timeserieData = {
        labels: labels,
        datasets: [
          {
            label: "1M",
            data: data,
            backgroundColor: (ctx: any) => {
              const canvas = ctx.chart.ctx;
              const gradient = canvas.createLinearGradient(0,0,0,450);

              gradient.addColorStop(0, 'rgba(0, 0, 255, 0.5)');
              gradient.addColorStop(.5, 'rgba(0, 0, 255, 0.25)');
              gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');

              return gradient;
            },
            borderColor: '#7c52df',
            pointRadius: 0,
            tension: 0.5,
            fill: true,
          }
        ]
      };
    } else {
      throw new Error("Something went wrong.");
    }
  } catch(error) {
    toast.error("Something went wrong", {
      timeout: 2000
    });
  }
}

async function getConversion(amount: number, fromCurrency: string, toCurrency: string): Promise<number | undefined> {
  try {
    const response = await fetch(`${API_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
    if (response.ok) {
      const result = await response.json();
      return result.rates[toCurrency];
    } else {
      throw new Error("Something went wrong.");
    }
  } catch(error) {
    toast.error("Something went wrong", {
      timeout: 2000
    });
  }
}

async function getCurrencies() {
  try {
    const response = await fetch(`${API_URL}/currencies`);
    if (response.ok) {
      const result = await response.json();
      state.currencies = result;
    } else {
      throw new Error("Something went wrong.");
    }
  } catch(error) {
    toast.error("Something went wrong", {
      timeout: 2000
    });
  }
}

async function onUpdateCurrency(origin: string, event: UploadCurrencyEvent) {
  const { amount, convertedAmount, fromCurrency, toCurrency } = state;
  if (origin === "from") {
    state.fromCurrency = event.payload;
    const data = await getConversion(amount, event.payload, toCurrency);
    if (data) {
      state.convertedAmount = Number(data.toFixed(2));
      getTimeserie();
    }
  } else {
    state.toCurrency = event.payload;
    const data = await getConversion(amount, fromCurrency, event.payload);
    if (data !== undefined) {
      state.convertedAmount = Number(data.toFixed(2));
      getTimeserie();
    }
  }
}

async function onUpdateAmount(origin: string, event: UploadAmountEvent) {
  const { fromCurrency, toCurrency } = state;
  if (origin === "from") {
    state.amount = event.payload;
    const data = await getConversion(event.payload, fromCurrency, toCurrency);
    if (data) {
      state.convertedAmount = Number(data.toFixed(2));
    }
  } else {
    state.convertedAmount = event.payload;
    const data = await getConversion(event.payload, toCurrency, fromCurrency);
    if (data) {
      state.amount = Number(data.toFixed(2));
    }
  }
}
</script>

<template>
  <div class="area header">
    <h3>{{ state.amount }} {{ state.fromCurrency }} uguale a</h3>
    <h2>{{ state.convertedAmount }} {{ state.toCurrency }}</h2>
  </div>
  <div class="area chart">
    <CurrencyTimeserie
      v-if="state.timeserieData"
      :data="state.timeserieData"
    />
  </div>
  <div class="area converter-from">
    <CurrencyInput
      title="I have"
      :amount="Number(state.amount)"
      :currency="state.fromCurrency"
      :currencies="state.currencies"
      @updateCurrency="onUpdateCurrency('from', $event)"
      @updateAmount="onUpdateAmount('from', $event)"
    />
  </div>
  <div class="area converter-to">
    <CurrencyInput
      title="I want"
      :amount="Number(state.convertedAmount)"
      :currency="state.toCurrency"
      :currencies="state.currencies"
      @updateCurrency="onUpdateCurrency('to', $event)"
      @updateAmount="onUpdateAmount('to', $event)"
    />
  </div>
</template>

<style scoped>
.area {
  padding: 2rem;
}
.header {
  grid-area: header;
}
.header h3 {
  font-weight: 300;
  font-size: 1.6rem;
}
.header h2 {
  font-weight: 700;
  font-size: 3rem;
}
.chart {
  grid-area: chart;
  background-color: var(--black);
  border-top-right-radius: var(--border-radius);
  border-top-left-radius: var(--border-radius);
}
.converter-from {
  grid-area: converter-from;
  background-color: var(--grey-light);
  border-bottom-left-radius: var(--border-radius);
}
.converter-to {
  grid-area: converter-to;
  background-color: var(--grey-dark);
  border-bottom-right-radius: var(--border-radius);
}

@media screen and (max-width: 768px) {
  .converter-from {
    border-bottom-left-radius: 0;
  }
  .converter-to {
    border-bottom-right-radius: 0;
  }
}
</style>
