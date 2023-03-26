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

import { LoginUser } from '../models/login-user';
import { NewUser } from '../models/new-user';
import { UpdateUser } from '../models/update-user';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserAndAuthenticationApiClient extends BaseApiClient {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation login
   */
  static readonly LoginPath = '/users/login';

  /**
   * Existing user login.
   *
   * Login for existing user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login$Response(params: {

    /**
     * Credentials to use
     */
    body: {
'user': LoginUser;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'user': User;
}>> {

    const rb = new RequestBuilder(this.rootUrl, UserAndAuthenticationApiClient.LoginPath, 'post');
    if (params) {
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
        'user': User;
        }>;
      })
    );
  }

  /**
   * Existing user login.
   *
   * Login for existing user
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `login$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login(params: {

    /**
     * Credentials to use
     */
    body: {
'user': LoginUser;
}
  },
  context?: HttpContext

): Observable<{
'user': User;
}> {

    return this.login$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'user': User;
}>) => r.body as {
'user': User;
})
    );
  }

  /**
   * Path part for operation createUser
   */
  static readonly CreateUserPath = '/users';

  /**
   * Register a new user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createUser$Response(params: {

    /**
     * Details of the new user to register
     */
    body: {
'user': NewUser;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'user': User;
}>> {

    const rb = new RequestBuilder(this.rootUrl, UserAndAuthenticationApiClient.CreateUserPath, 'post');
    if (params) {
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
        'user': User;
        }>;
      })
    );
  }

  /**
   * Register a new user
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createUser(params: {

    /**
     * Details of the new user to register
     */
    body: {
'user': NewUser;
}
  },
  context?: HttpContext

): Observable<{
'user': User;
}> {

    return this.createUser$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'user': User;
}>) => r.body as {
'user': User;
})
    );
  }

  /**
   * Path part for operation getCurrentUser
   */
  static readonly GetCurrentUserPath = '/user';

  /**
   * Get current user.
   *
   * Gets the currently logged-in user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCurrentUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUser$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'user': User;
}>> {

    const rb = new RequestBuilder(this.rootUrl, UserAndAuthenticationApiClient.GetCurrentUserPath, 'get');
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
        'user': User;
        }>;
      })
    );
  }

  /**
   * Get current user.
   *
   * Gets the currently logged-in user
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCurrentUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUser(params?: {
  },
  context?: HttpContext

): Observable<{
'user': User;
}> {

    return this.getCurrentUser$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'user': User;
}>) => r.body as {
'user': User;
})
    );
  }

  /**
   * Path part for operation updateCurrentUser
   */
  static readonly UpdateCurrentUserPath = '/user';

  /**
   * Update current user.
   *
   * Updated user information for current user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateCurrentUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCurrentUser$Response(params: {

    /**
     * User details to update. At least **one** field is required.
     */
    body: {
'user': UpdateUser;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'user': User;
}>> {

    const rb = new RequestBuilder(this.rootUrl, UserAndAuthenticationApiClient.UpdateCurrentUserPath, 'put');
    if (params) {
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
        'user': User;
        }>;
      })
    );
  }

  /**
   * Update current user.
   *
   * Updated user information for current user
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateCurrentUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCurrentUser(params: {

    /**
     * User details to update. At least **one** field is required.
     */
    body: {
'user': UpdateUser;
}
  },
  context?: HttpContext

): Observable<{
'user': User;
}> {

    return this.updateCurrentUser$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'user': User;
}>) => r.body as {
'user': User;
})
    );
  }

}
