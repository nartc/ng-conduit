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

import { Article } from '../models/article';

@Injectable({
  providedIn: 'root',
})
export class FavoritesApiClient extends BaseApiClient {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation createArticleFavorite
   */
  static readonly CreateArticleFavoritePath = '/articles/{slug}/favorite';

  /**
   * Favorite an article.
   *
   * Favorite an article. Auth is required
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createArticleFavorite()` instead.
   *
   * This method doesn't expect any request body.
   */
  createArticleFavorite$Response(params: {

    /**
     * Slug of the article that you want to favorite
     */
    slug: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'article': Article;
}>> {

    const rb = new RequestBuilder(this.rootUrl, FavoritesApiClient.CreateArticleFavoritePath, 'post');
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
        'article': Article;
        }>;
      })
    );
  }

  /**
   * Favorite an article.
   *
   * Favorite an article. Auth is required
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createArticleFavorite$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  createArticleFavorite(params: {

    /**
     * Slug of the article that you want to favorite
     */
    slug: string;
  },
  context?: HttpContext

): Observable<{
'article': Article;
}> {

    return this.createArticleFavorite$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'article': Article;
}>) => r.body as {
'article': Article;
})
    );
  }

  /**
   * Path part for operation deleteArticleFavorite
   */
  static readonly DeleteArticleFavoritePath = '/articles/{slug}/favorite';

  /**
   * Unfavorite an article.
   *
   * Unfavorite an article. Auth is required
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteArticleFavorite()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteArticleFavorite$Response(params: {

    /**
     * Slug of the article that you want to unfavorite
     */
    slug: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'article': Article;
}>> {

    const rb = new RequestBuilder(this.rootUrl, FavoritesApiClient.DeleteArticleFavoritePath, 'delete');
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
        'article': Article;
        }>;
      })
    );
  }

  /**
   * Unfavorite an article.
   *
   * Unfavorite an article. Auth is required
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteArticleFavorite$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteArticleFavorite(params: {

    /**
     * Slug of the article that you want to unfavorite
     */
    slug: string;
  },
  context?: HttpContext

): Observable<{
'article': Article;
}> {

    return this.deleteArticleFavorite$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'article': Article;
}>) => r.body as {
'article': Article;
})
    );
  }

}
