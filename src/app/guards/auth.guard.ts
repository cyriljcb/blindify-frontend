import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    const token = localStorage.getItem('spotify_access_token');

    if (token) {
      return true;
    } else {
      window.location.href = 'http://localhost:8080/spotify/login';
      return false;
    }
  }
}
