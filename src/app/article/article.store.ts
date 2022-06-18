import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  exhaustMap,
  filter,
  forkJoin,
  iif,
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
export class ArticleStore extends ComponentStore<ArticleState> {
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
          if (comment.author.username === auth.user?.username)
            return { ...comment, isOwner: true };
          return { ...comment, isOwner: false };
        }),
        status,
        currentUser: auth.profile!,
        isOwner: auth.user?.username === article?.author.username,
      };
    },
    { debounce: true }
  );

  constructor(
    private apiClient: ApiClient,
    private route: ActivatedRoute,
    private router: Router,
    private authStore: AuthStore
  ) {
    super(initialArticleState);
  }

  ngrxOnStateInit() {
    this.getArticle(this.slug$);
  }

  private readonly getArticle = this.effect<string>(
    pipe(
      tap(() => this.patchState({ status: 'loading' })),
      switchMap((slug) =>
        forkJoin([
          this.apiClient.getArticle(slug),
          this.apiClient.getArticleComments(slug),
        ]).pipe(
          tapResponse(
            ([{ article }, { comments }]) => {
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
      iif(
        () => article.favorited,
        this.apiClient.deleteArticleFavorite(article.slug),
        this.apiClient.createArticleFavorite(article.slug)
      ).pipe(
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
      iif(
        () => profile.following,
        this.apiClient.unfollowUserByUsername(profile.username),
        this.apiClient.followUserByUsername(profile.username)
      ).pipe(
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
