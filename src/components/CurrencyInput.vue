<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string;
  amount: number,
  currency: string,
  currencies: Object,
}>();

const emit = defineEmits(['updateCurrency', 'updateAmount']);

let selectedCurrency = ref(props.currency);

function updateCurrency(event: any) {
  const value = event.target.value;
  selectedCurrency.value = value;
  emit('updateCurrency', { payload: value });
}

function updateAmount(event: any) {
  const value = event.target.value;
  emit('updateAmount', { payload: value });
}
</script>

<template>
  <div class="converter-container">
    <h4>{{ title }}</h4>
    <select name="currency" @input="updateCurrency">
      <option
        v-for="item in Object.keys(currencies)"
        :key="item"
        :value="item"
        :selected="item === selectedCurrency"
      >
        ({{ item }}) {{ currencies[item as keyof Object] }}
      </option>
    </select>
    <input
      type="number"
      :value="amount"
      min="0.01"
      max="100000"
      step=".01"
      @input="updateAmount"
    >
  </div>
</template>

<style scoped>
.converter-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
}
h4 {
  font-size: 1.6rem;
  font-weight: 200;
}
select {
  width: 250px;
  padding: 12px;
  font-size: 1rem;
  background-color: transparent;
  color: inherit;
  border-color: #545659;
  border-radius: 6px;
}
select:focus, select:active {
  outline: none;
}
input {
  width: 100%;
  font-size: 2rem;
  text-align: center;
  background-color: transparent;
  color: #545659;
  border: 0;
  border-bottom: 1px solid #545659;
  transition: .5s;
}
input:focus, input:active {
  color: var(--white);
  outline: none;
  border-bottom: 1px solid var(--white);
}
@media screen and (max-width: 768px) {
  select {
    margin: 20px 0;
  }
}
</style>