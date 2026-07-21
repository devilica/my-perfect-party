import { Language } from '@/types/models';

export type DatePickerFieldProps = {
  label: string;
  value?: string;
  onChange: (iso: string | undefined) => void;
  placeholder?: string;
  clearLabel?: string;
  locale?: Language;
  error?: string;
  mode?: 'date' | 'datetime';
  clearable?: boolean;
};
