import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app-routing.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from "./components/header/header.component";
import { DbService } from "./services/db.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    DbService
  ],
};
