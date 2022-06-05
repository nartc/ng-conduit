import { Injectable } from '@angular/core';
import { injectLocalStorage } from '../di/storage';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly ls = injectLocalStorage();

  getItem(key: string): string | null {
    if (!this.ls) {
      return null;
    }

    const item = this.ls.getItem(key);

    if (!item) {
      return null;
    }

    return item;
  }

  getItemObject<TData extends object>(key: string): TData | null {
    const item = this.getItem(key);

    if (!item) return null;
    return JSON.parse(item) as TData;
  }

  setItem(key: string, data: unknown): void {
    if (!this.ls) return;

    if (typeof data === 'object') {
      this.ls.setItem(key, JSON.stringify(data));
    } else {
      this.ls.setItem(key, data as string);
    }
  }
}
