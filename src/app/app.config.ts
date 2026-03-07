import {
    ApplicationConfig, provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection, provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';
import {routes} from './app.routes';
import {provideToastr} from "ngx-toastr";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {UnitFilterPipe} from "./pipes/unit-filter/unit-filter-pipe";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideHttpClient(withFetch()),
        provideAnimations(),
        provideToastr(),
        provideRouter(routes, withHashLocation()),
        UnitFilterPipe
    ]
};
