import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from "./components/header/header.component";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
