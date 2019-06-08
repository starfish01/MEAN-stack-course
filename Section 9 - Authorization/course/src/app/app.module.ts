import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';

import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatInputModule, MatButtonModule, MatExpansionModule, MatToolbarModule} from '@angular/material';

import {MatCardModule} from '@angular/material/card';
import {HeaderComponent} from './header/header.component';
import {PostListComponent} from './posts/post-list/post-list.component';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {SignupComponent} from './auth/signup/signup.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {ErrorInterceptor} from './error-interceptor';


@NgModule({
    declarations: [
        AppComponent,
        PostCreateComponent,
        HeaderComponent,
        PostListComponent,
        SignupComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatPaginatorModule

    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],

    bootstrap: [AppComponent]
})
export class AppModule {
}
