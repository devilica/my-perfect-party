import { SelectField } from '@/components/SelectField';
import { DEFAULT_GUEST_CATEGORIES } from '@/constants/guestCategories';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';

type GuestCategoryPickerProps = {
  eventId: string;
  selected: string;
  onSelect: (category: string) => void;
};

export function GuestCategoryPicker({ eventId, selected, onSelect }: GuestCategoryPickerProps) {
  const language = useWeddingStore((s) => s.language);
  const event = useWeddingStore((s) => s.events.find((e) => e.id === eventId));
  const { t } = useTranslation(language);

  const categories = event?.guestCategories ?? DEFAULT_GUEST_CATEGORIES;

  return (
    <SelectField
      label={t('guests.category')}
      value={selected}
      options={categories.map((category) => ({ value: category, label: category }))}
      onChange={onSelect}
    />
  );
}
