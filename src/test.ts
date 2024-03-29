// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { getTestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { configure } from '@testing-library/angular';
import '@testing-library/jasmine-dom';
import JasmineDOM from '@testing-library/jasmine-dom';
import 'zone.js/testing';

// Install custom matchers from jasmine-dom
beforeEach(() => {
    jasmine.addMatchers(JasmineDOM);
});

configure({
    defaultImports: [ReactiveFormsModule],
});

declare const require: {
    context(
        path: string,
        deep?: boolean,
        filter?: RegExp
    ): {
        <T>(id: string): T;
        keys(): string[];
    };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().forEach(context);
