import { ComponentStore } from '@ngrx/component-store';
import { filter } from 'rxjs';
import { Profile, User } from '../api';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface AuthState {
    user: User | null;
    profile: Profile | null;
    status: AuthStatus;
}

export function authStoreFactory(store: ComponentStore<AuthState>) {
    const user$ = store.select((s) => s.user);

    const isAuthenticated$ = store.select(
        store.select((s) => s.status).pipe(filter((status) => status !== 'idle')),
        (status) => status === 'authenticated',
        { debounce: true }
    );

    const auth$ = store.select(
        { isAuthenticated: isAuthenticated$, user: user$, profile: store.select((s) => s.profile) },
        { debounce: true }
    );

    const username$ = store.select(user$.pipe(filter((user): user is User => !!user)), (user) => user.username);

    return {
        effect: store.effect.bind(store),
        auth$,
        isAuthenticated$,
        username$,
        updateProfile: store.updater<Profile>((state, profile) => ({ ...state, profile })),
        updateCurrentUser: store.updater<User | null>((state, user) => ({
            ...state,
            user,
            status: user ? 'authenticated' : 'unauthenticated',
        })),
    };
}

export type AuthStoreApi = ReturnType<typeof authStoreFactory>;
