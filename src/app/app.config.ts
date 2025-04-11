import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.route'; // Import des routes définies dans `app.routes.ts`
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // 📌 Fournit le RouterModule
    provideHttpClient(),   // 📌 Fournit HttpClientModule
    provideAnimations()    // 📌 Fournit BrowserAnimationsModule
  ]
};
