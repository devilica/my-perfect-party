import { getCategoryColor, isPredefinedCategory } from '@/constants/categories';
import {
  CategoryBreakdownItem,
  Expense,
  ExpenseSummary,
} from '@/types/models';

export function getExpenseSummary(expenses: Expense[], eventId: string): ExpenseSummary {
  const eventExpenses = expenses.filter((e) => e.eventId === eventId);
  const total = eventExpenses.reduce((sum, e) => sum + e.amount, 0);
  const coveredByOthers = eventExpenses
    .filter((e) => e.coveredByOther)
    .reduce((sum, e) => sum + e.amount, 0);
  const yourShare = total - coveredByOthers;

  return { total, coveredByOthers, yourShare };
}

export function getExpenseBreakdown(
  expenses: Expense[],
  eventId: string
): CategoryBreakdownItem[] {
  const eventExpenses = expenses.filter((e) => e.eventId === eventId);
  const map = new Map<string, number>();

  for (const expense of eventExpenses) {
    const key = expense.category.trim() || 'other';
    map.set(key, (map.get(key) ?? 0) + expense.amount);
  }

  return Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      color: getCategoryColor(category),
      labelKey: isPredefinedCategory(category) ? `categories.${category}` : undefined,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getEventCustomExpenseCategories(
  expenses: Expense[],
  eventId: string
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const eventExpenses = expenses.filter((expense) => expense.eventId === eventId);

  for (let index = eventExpenses.length - 1; index >= 0; index -= 1) {
    const raw = eventExpenses[index].category.trim();
    if (!raw || isPredefinedCategory(raw)) continue;

    const key = raw.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(raw);
  }

  return result;
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('bs-BA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
