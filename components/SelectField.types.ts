import { ReactNode } from 'react';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type SelectFieldProps<T extends string = string> = {
  label: string;
  required?: boolean;
  labelRight?: ReactNode;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  compact?: boolean;
  dense?: boolean;
};
