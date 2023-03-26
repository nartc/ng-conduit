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


@Injectable({
  providedIn: 'root',
})
export class TagsApiClient extends BaseApiClient {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getTags
   */
  static readonly GetTagsPath = '/tags';

  /**
   * Get tags.
   *
   * Get tags. Auth not required
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getTags()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTags$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'tags': Array<string>;
}>> {

    const rb = new RequestBuilder(this.rootUrl, TagsApiClient.GetTagsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'tags': Array<string>;
        }>;
      })
    );
  }

  /**
   * Get tags.
   *
   * Get tags. Auth not required
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getTags$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTags(params?: {
  },
  context?: HttpContext

): Observable<{
'tags': Array<string>;
}> {

    return this.getTags$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'tags': Array<string>;
}>) => r.body as {
'tags': Array<string>;
})
    );
  }

}
