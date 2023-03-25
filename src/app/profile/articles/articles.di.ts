import { InjectionToken, Provider } from '@angular/core';
import { ProfileArticlesType } from '../profile.store';

export const PROFILE_ARTICLES_TYPE = new InjectionToken<ProfileArticlesType>(
  'articles type in profile'
);

export function provideProfileArticlesType(
  type: ProfileArticlesType
): Provider {
  return { provide: PROFILE_ARTICLES_TYPE, useValue: type };
}
