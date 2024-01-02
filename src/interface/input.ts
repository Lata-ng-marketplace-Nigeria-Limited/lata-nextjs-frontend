export interface SearchOption {
  value: string;
  label?: string;
  extra?: string;
  disabled?: boolean;
}
export interface SelectOptionData {
  label?: string;
  options: SearchOption[];
}
