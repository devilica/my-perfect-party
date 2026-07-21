import { SelectField } from '@/components/SelectField';
import { ATTENDANCE_FILTERS, getGuestFilterLabel } from '@/constants/guestFilters';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { GuestFilter } from '@/types/models';

type GuestFilterBarProps = {
  selected: GuestFilter;
  onSelect: (filter: GuestFilter) => void;
};

export function GuestFilterBar({ selected, onSelect }: GuestFilterBarProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  return (
    <SelectField
      label={t('guests.filterLabel')}
      value={selected}
      options={ATTENDANCE_FILTERS.map((filter) => ({
        value: filter,
        label: getGuestFilterLabel(filter, t),
      }))}
      onChange={onSelect}
    />
  );
}
