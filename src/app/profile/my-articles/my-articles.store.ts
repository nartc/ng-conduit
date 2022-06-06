import { Injectable } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { injectComponentStore } from '../../shared/di/store';
import { ProfileStore } from '../profile.store';

@Injectable()
export class MyArticlesStore extends ComponentStore<{}> implements OnStateInit {
  private readonly profileStore = injectComponentStore(ProfileStore);

  readonly vm$ = this.profileStore.articlesVm$;

  constructor() {
    super({});
  }

  ngrxOnStateInit() {
    this.profileStore.getArticles('my');
  }
}
