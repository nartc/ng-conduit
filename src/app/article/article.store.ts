import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import {
  defer,
  exhaustMap,
  filter,
  forkJoin,
  Observable,
  pipe,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  ApiClient,
  Article,
  Comment,
  Profile,
} from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { ApiStatus, CommentWithOwner } from '../shared/data-access/models';

export interface ArticleState {
  article: Article | null;
  comments: Comment[];
  status: ApiStatus;
}

export const initialArticleState: ArticleState = {
  comments: [],
  article: null,
  status: 'idle',
};

export type ArticleVm = Omit<ArticleState, 'comments'> & {
  isOwner: boolean;
  comments: CommentWithOwner[];
  currentUser: Profile;
};

@Injectable()
export class ArticleStore
  extends ComponentStore<ArticleState>
  implements OnStateInit, OnStoreInit
{
  private readonly apiClient = inject(ApiClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  readonly slug$ = this.select(
    this.route.params,
    (params) => params['slug'] as string
  );

  readonly article$ = this.select((s) => s.article);
  readonly comments$ = this.select((s) => s.comments);
  readonly status$ = this.select((s) => s.status);

  readonly vm$: Observable<ArticleVm> = this.select(
    this.authStore.auth$,
    this.article$,
    this.comments$,
    this.status$.pipe(filter((status) => status !== 'idle')),
    (auth, article, comments, status) => {
      return {
        article,
        comments: comments.map((comment) => {
          return {
            ...comment,
            isOwner: comment.author.username === auth.user?.username,
          };
        }),
        status,
        currentUser: auth.profile!,
        isOwner: auth.user?.username === article?.author.username,
      };
    },
    { debounce: true }
  );

  ngrxOnStoreInit() {
    this.setState(initialArticleState);
  }

  ngrxOnStateInit() {
    this.getArticle(this.slug$);
  }

  private readonly getArticle = this.effect<string>(
    pipe(
      tap(() => this.patchState({ status: 'loading' })),
      switchMap((slug) =>
        forkJoin({
          article: this.apiClient.getArticle(slug),
          comments: this.apiClient.getArticleComments(slug),
        }).pipe(
          tapResponse(
            ({ article: { article }, comments: { comments } }) => {
              this.patchState({ article, comments, status: 'success' });
            },
            (error) => {
              console.error('error getting article/comments: ', error);
              this.patchState({ status: 'error' });
            }
          )
        )
      )
    )
  );

  readonly toggleFavorite = this.effect<Article>(
    exhaustMap((article) =>
      defer(() => {
        if (article.favorited)
          return this.apiClient.deleteArticleFavorite(article.slug);
        return this.apiClient.createArticleFavorite(article.slug);
      }).pipe(
        tapResponse(
          (response) => {
            this.patchState({ article: response.article });
          },
          (error) => {
            console.error('error toggling article favorite: ', error);
          }
        )
      )
    )
  );

  readonly deleteArticle = this.effect<Article>(
    exhaustMap((article) =>
      this.apiClient.deleteArticle(article.slug).pipe(
        tapResponse(
          () => {
            void this.router.navigate(['/']);
          },
          (error) => {
            console.error('error deleting article: ', error);
          }
        )
      )
    )
  );

  readonly toggleFollowAuthor = this.effect<Profile>(
    exhaustMap((profile) =>
      defer(() => {
        if (profile.following)
          return this.apiClient.unfollowUserByUsername(profile.username);
        return this.apiClient.followUserByUsername(profile.username);
      }).pipe(
        tapResponse(
          (response) => {
            this.patchState((state) => ({
              article: {
                ...state.article!,
                author: response.profile,
              },
            }));
          },
          (error) => {
            console.error('error toggling following author: ', error);
          }
        )
      )
    )
  );

  readonly createComment = this.effect<string>(
    pipe(
      withLatestFrom(this.article$),
      exhaustMap(([comment, article]) =>
        this.apiClient
          .createArticleComment(article!.slug, {
            comment: { body: comment },
          })
          .pipe(
            tapResponse(
              (response) => {
                this.patchState((state) => ({
                  comments: [...state.comments, response.comment],
                }));
              },
              (error) => {
                console.error('error creating new comment: ', error);
              }
            )
          )
      )
    )
  );

  readonly deleteComment = this.effect<CommentWithOwner>(
    pipe(
      withLatestFrom(this.article$),
      exhaustMap(([commentWithOwner, article]) =>
        this.apiClient
          .deleteArticleComment(article!.slug, commentWithOwner.id)
          .pipe(
            tapResponse(
              () => {
                this.patchState((state) => ({
                  comments: state.comments.filter(
                    (comment) => comment.id !== commentWithOwner.id
                  ),
                }));
              },
              (error) => {
                console.error('error deleting comment: ', error);
              }
            )
          )
      )
    )
  );
}
