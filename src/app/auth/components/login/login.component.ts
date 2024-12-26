import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor() {}

  loginWithSpotify(): void {
    // URL de l'endpoint backend qui initie l'authentification OAuth Spotify
    const spotifyLoginUrl = 'http://localhost:8080/spotify/login';
    
    // Redirection de l'utilisateur vers l'URL
    window.location.href = spotifyLoginUrl;
  }
}