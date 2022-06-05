import { inject, Type } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export type PublicComponentStore<
  TState extends object,
  TStore extends ComponentStore<TState>
> = Omit<
  TStore,
  'ngOnDestroy' | 'patchState' | 'setState' | 'state$' | 'updater' | 'effect'
>;

export function injectComponentStore<
  TState extends object,
  TStore extends ComponentStore<TState>
>(store: Type<TStore>): PublicComponentStore<TState, TStore> {
  const instance = inject(store);
  return instance as PublicComponentStore<TState, TStore>;
}
