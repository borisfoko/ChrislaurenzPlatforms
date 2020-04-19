# ChrislaurenzBackend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.2.

## Development server

Run `ng start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## ISlimScrollOptions bugs fix conflict solve
These instructions help you to solve conflict in case of error while running the build and start on this project with `npm start`
After installing all needed npm modules using `npm install`
Open the slimscroll-options.class.d.ts under the following location `..\ChrislaurenzPlatforms\chrislaurenz-admin\node_modules\ngx-slimscroll\dist\app\ngx-slimscroll\classes`
and remove the line `import { ISlimScrollOptions } from './slimscroll-options.class';` save it and run `npm start` again.

Problem solve :) Huppi
If not then contact the product owner