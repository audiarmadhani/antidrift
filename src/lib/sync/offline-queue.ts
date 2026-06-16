export type QueuedMutation = {
  id: string;
  url: string;
  method: string;
  body?: unknown;
  createdAt: string;
};

const QUEUE_KEY = "antidrift-offline-queue";

async function getStore() {
  const { get, set } = await import("idb-keyval");
  return { get, set };
}

export async function getOfflineQueue(): Promise<QueuedMutation[]> {
  const { get } = await getStore();
  return (await get<QueuedMutation[]>(QUEUE_KEY)) ?? [];
}

export async function enqueueMutation(
  mutation: Omit<QueuedMutation, "id" | "createdAt">
): Promise<void> {
  const { get, set } = await getStore();
  const queue = await getOfflineQueue();
  queue.push({
    ...mutation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  await set(QUEUE_KEY, queue);
}

export async function flushOfflineQueue(
  fetchFn: typeof fetch = fetch
): Promise<number> {
  const { set } = await getStore();
  const queue = await getOfflineQueue();
  if (queue.length === 0) return 0;

  const remaining: QueuedMutation[] = [];
  let flushed = 0;

  for (const item of queue) {
    try {
      const res = await fetchFn(item.url, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: item.body ? JSON.stringify(item.body) : undefined,
      });
      if (res.ok) flushed++;
      else remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }

  await set(QUEUE_KEY, remaining);
  return flushed;
}

export async function clearOfflineQueue(): Promise<void> {
  const { set } = await getStore();
  await set(QUEUE_KEY, []);
}
