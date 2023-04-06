export interface UploadCurrencyEvent {
  payload: string
}

export interface UploadAmountEvent {
  payload: number
}

export interface AppState {
  currencies: Object;
  amount: number;
  convertedAmount: number;
  fromCurrency: string;
  toCurrency: string;
  timeserie: string;
  timeserieData: TimeserieData | null;
}

export interface DatasetEntry {
  label?: string;
  data: any[];
  backgroundColor?: any;
  pointBackgroundColor?: any;
  fill?: any;
  borderColor?: any;
  pointRadius?: any;
  tension?: any;
}

export interface TimeserieData {
  labels: string[];
  datasets: DatasetEntry[];
}