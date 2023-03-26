/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl: string = '/api';
}

/**
 * Parameters for `.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
