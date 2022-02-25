import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchComponent} from './components/search/search.component';
import {CollectionComponent} from './components/collection/collection.component';
import {MaterialModule} from './material/material.modul';
import {ReactiveFormsModule} from '@angular/forms';
import {LogInComponent} from './components/log-in/log-in.component';
import {RegisterComponent} from './components/register/register.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {NgxSpinnerModule} from 'ngx-spinner';
import { CollectionDetailsComponent } from './components/collection/collection-details/collection-details.component';

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent,
        CollectionComponent,
        LogInComponent,
        RegisterComponent,
        NavbarComponent,
        CollectionDetailsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule,
        SnotifyModule,
        NgxSpinnerModule
    ],
    providers: [{provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
        JwtHelperService,
        {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
        SnotifyService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
