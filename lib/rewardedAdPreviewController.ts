export type RewardedAdPreviewResult = 'rewarded' | 'closed';

type RewardedAdPreviewListener = (visible: boolean) => void;

let listeners: RewardedAdPreviewListener[] = [];
let pendingResolve: ((result: RewardedAdPreviewResult) => void) | null = null;

export function subscribeRewardedAdPreview(listener: RewardedAdPreviewListener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
  };
}

export function isRewardedAdPreviewVisible(): boolean {
  return pendingResolve !== null;
}

export function showRewardedAdPreview(): Promise<RewardedAdPreviewResult> {
  if (pendingResolve) {
    return Promise.resolve('closed');
  }

  return new Promise((resolve) => {
    pendingResolve = resolve;
    listeners.forEach((listener) => listener(true));
  });
}

export function finishRewardedAdPreview(result: RewardedAdPreviewResult): void {
  if (!pendingResolve) return;

  const resolve = pendingResolve;
  pendingResolve = null;
  listeners.forEach((listener) => listener(false));
  resolve(result);
}
