import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private http: HttpClient) {}

  loginWithSpotify(): void {
    // Appeler l'endpoint /auth/login simulé par le mock
    this.http.post('/auth/login', {}).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        // Si nécessaire, rediriger après une réponse réussie
        // Exemple : localStorage.setItem('token', response.token);
        window.location.href = '/playlists';
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }
}
