import { DOCUMENT } from '@angular/common';
import { inject, InjectFlags } from '@angular/core';

export function injectLocalStorage(): Storage | null {
  const document = inject(DOCUMENT, InjectFlags.Optional);

  if (document?.defaultView) {
    return document?.defaultView?.localStorage;
  }

  return null;
}
