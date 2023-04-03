import { ComponentStore } from '@ngrx/component-store';
import { processAuthErrors } from '../../utils/process-auth-errors';

export function errorsApiFactory(store: ComponentStore<{ errors: Record<string, string[]> }>) {
    return {
        errors$: store.select(
            store.select((s) => s.errors),
            processAuthErrors,
            { debounce: true }
        ),
        updateErrors: store.updater<Record<string, string[]>>((state, errors) => ({ ...state, errors })),
    };
}

export type ErrorsApi = ReturnType<typeof errorsApiFactory>;
