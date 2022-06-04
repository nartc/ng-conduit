import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { API_BASE_URL } from "./app/shared/api";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [{ provide: API_BASE_URL, useValue: environment.apiUrl }],
}).catch((err) => console.error(err));
