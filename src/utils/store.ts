/**
 * In-memory data store for the gamification system.
 *
 * In production this would be backed by a database (PostgreSQL, etc.).
 * This implementation provides a simple Map-based store with basic
 * CRUD operations, filtering, and pagination.
 */

export class InMemoryStore<T extends { id: string }> {
  private data: Map<string, T> = new Map();

  create(item: T): T {
    this.data.set(item.id, { ...item });
    return { ...item };
  }

  getById(id: string): T | undefined {
    const item = this.data.get(id);
    return item ? { ...item } : undefined;
  }

  getAll(): T[] {
    return Array.from(this.data.values()).map(item => ({ ...item }));
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const existing = this.data.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.data.set(id, updated);
    return { ...updated };
  }

  delete(id: string): boolean {
    return this.data.delete(id);
  }

  find(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  findOne(predicate: (item: T) => boolean): T | undefined {
    for (const item of this.data.values()) {
      if (predicate(item)) return { ...item };
    }
    return undefined;
  }

  count(predicate?: (item: T) => boolean): number {
    if (!predicate) return this.data.size;
    return this.find(predicate).length;
  }

  paginate(items: T[], limit: number = 20, offset: number = 0): T[] {
    return items.slice(offset, offset + limit);
  }

  clear(): void {
    this.data.clear();
  }
}
