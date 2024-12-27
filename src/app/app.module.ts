import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/components/home/home.component';
import { SpotifyMockInterceptor } from './mocks/spotify-mock.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: SpotifyMockInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
