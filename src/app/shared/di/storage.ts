import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage | null>('local storage', {
    factory: () => {
        const document = inject(DOCUMENT, { optional: true });

        if (document?.defaultView) {
            return document?.defaultView?.localStorage;
        }

        return null;
    },
});
