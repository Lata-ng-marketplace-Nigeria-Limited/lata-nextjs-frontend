export interface SearchOption {
  value: string;
  label?: string;
  disabled?: boolean;
}
export interface SelectOptionData {
  label?: string;
  options: SearchOption[];
}
