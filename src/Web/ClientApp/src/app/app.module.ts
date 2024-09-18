import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routing';
import { NotfoundComponent } from './notfound/notfound.component';
import { UserDefaultRoute } from './user-default-route';
import { SharedModule } from './shared/shared.module';
import { D2UDialogService } from './shared/services/dialogs/dialog.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    UnauthorizedComponent,
    NotfoundComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    RouterModule,
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    SharedModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
  ],
  providers: [
    UserDefaultRoute,
    D2UDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
