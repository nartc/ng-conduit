/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseApiClient } from '../base-api-client';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Comment } from '../models/comment';
import { NewComment } from '../models/new-comment';

@Injectable({
  providedIn: 'root',
})
export class CommentsApiClient extends BaseApiClient {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getArticleComments
   */
  static readonly GetArticleCommentsPath = '/articles/{slug}/comments';

  /**
   * Get comments for an article.
   *
   * Get the comments for an article. Auth is optional
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getArticleComments()` instead.
   *
   * This method doesn't expect any request body.
   */
  getArticleComments$Response(params: {

    /**
     * Slug of the article that you want to get comments for
     */
    slug: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'comments': Array<Comment>;
}>> {

    const rb = new RequestBuilder(this.rootUrl, CommentsApiClient.GetArticleCommentsPath, 'get');
    if (params) {
      rb.path('slug', params.slug, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'comments': Array<Comment>;
        }>;
      })
    );
  }

  /**
   * Get comments for an article.
   *
   * Get the comments for an article. Auth is optional
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getArticleComments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getArticleComments(params: {

    /**
     * Slug of the article that you want to get comments for
     */
    slug: string;
  },
  context?: HttpContext

): Observable<{
'comments': Array<Comment>;
}> {

    return this.getArticleComments$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'comments': Array<Comment>;
}>) => r.body as {
'comments': Array<Comment>;
})
    );
  }

  /**
   * Path part for operation createArticleComment
   */
  static readonly CreateArticleCommentPath = '/articles/{slug}/comments';

  /**
   * Create a comment for an article.
   *
   * Create a comment for an article. Auth is required
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createArticleComment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createArticleComment$Response(params: {

    /**
     * Slug of the article that you want to create a comment for
     */
    slug: string;

    /**
     * Comment you want to create
     */
    body: {
'comment': NewComment;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'comment': Comment;
}>> {

    const rb = new RequestBuilder(this.rootUrl, CommentsApiClient.CreateArticleCommentPath, 'post');
    if (params) {
      rb.path('slug', params.slug, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'comment': Comment;
        }>;
      })
    );
  }

  /**
   * Create a comment for an article.
   *
   * Create a comment for an article. Auth is required
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createArticleComment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createArticleComment(params: {

    /**
     * Slug of the article that you want to create a comment for
     */
    slug: string;

    /**
     * Comment you want to create
     */
    body: {
'comment': NewComment;
}
  },
  context?: HttpContext

): Observable<{
'comment': Comment;
}> {

    return this.createArticleComment$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'comment': Comment;
}>) => r.body as {
'comment': Comment;
})
    );
  }

  /**
   * Path part for operation deleteArticleComment
   */
  static readonly DeleteArticleCommentPath = '/articles/{slug}/comments/{id}';

  /**
   * Delete a comment for an article.
   *
   * Delete a comment for an article. Auth is required
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteArticleComment()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteArticleComment$Response(params: {

    /**
     * Slug of the article that you want to delete a comment for
     */
    slug: string;

    /**
     * ID of the comment you want to delete
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, CommentsApiClient.DeleteArticleCommentPath, 'delete');
    if (params) {
      rb.path('slug', params.slug, {});
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Delete a comment for an article.
   *
   * Delete a comment for an article. Auth is required
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteArticleComment$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteArticleComment(params: {

    /**
     * Slug of the article that you want to delete a comment for
     */
    slug: string;

    /**
     * ID of the comment you want to delete
     */
    id: number;
  },
  context?: HttpContext

): Observable<void> {

    return this.deleteArticleComment$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
