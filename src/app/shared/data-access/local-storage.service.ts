import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../di/storage';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private ls: Storage) {}

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
