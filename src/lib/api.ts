export const api = {
  get: async (table: string) => {
    const res = await fetch(`/api/${table}`);
    if (!res.ok) throw new Error(`Failed to fetch ${table}`);
    return res.json();
  },
  upsert: async (table: string, body: any) => {
    const res = await fetch(`/api/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Failed to upsert ${table}`);
    return res.json();
  },
  delete: async (table: string, id: string) => {
    const res = await fetch(`/api/${table}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error(`Failed to delete from ${table}`);
    return res.json();
  },
  bulkUpsert: async (table: string, items: any[]) => {
    const res = await fetch('/api/bulk-upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, items }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed bulk upsert ${table}`);
    }
    return res.json();
  }
};
