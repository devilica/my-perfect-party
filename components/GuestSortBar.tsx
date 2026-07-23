import { SelectField } from '@/components/SelectField';
import { GUEST_SORT_OPTIONS, getGuestSortLabel } from '@/constants/guestSort';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { GuestSort } from '@/types/models';

type GuestSortBarProps = {
  selected: GuestSort;
  onSelect: (sort: GuestSort) => void;
};

export function GuestSortBar({ selected, onSelect }: GuestSortBarProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  return (
    <SelectField
      label={t('guests.sortLabel')}
      value={selected}
      options={GUEST_SORT_OPTIONS.map((sort) => ({
        value: sort,
        label: getGuestSortLabel(sort, t),
      }))}
      onChange={onSelect}
    />
  );
}
