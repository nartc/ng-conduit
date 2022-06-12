import { DOCUMENT } from '@angular/common';
import { inject, InjectFlags, InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage | null>(
  'local storage',
  {
    factory: () => {
      const document = inject(DOCUMENT, InjectFlags.Optional);

      if (document?.defaultView) {
        return document?.defaultView?.localStorage;
      }

      return null;
    },
  }
);
