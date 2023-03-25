import { inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../di/storage';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly ls = inject(LOCAL_STORAGE);

  getItem<TData = string>(
    key: string
  ): (TData extends object ? TData : string) | null {
    if (!this.ls) {
      return null;
    }

    const item = this.ls.getItem(key);

    if (!item) {
      return null;
    }

    try {
      const parsed = JSON.parse(item);
      if (typeof parsed === 'object') {
        return parsed;
      }

      return item as TData extends object ? TData : string;
    } catch (e) {
      return item as TData extends object ? TData : string;
    }
  }

  setItem(key: string, data: unknown): void {
    if (!this.ls) return;

    if (typeof data === 'object') {
      this.ls.setItem(key, JSON.stringify(data));
    } else {
      this.ls.setItem(key, data as string);
    }
  }

  removeItem(key: string) {
    if (this.ls) {
      this.ls.removeItem(key);
    }
  }
}
