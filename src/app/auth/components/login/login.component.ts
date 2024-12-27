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
    // this.http.get('http://localhost:8080/spotify/login', { responseType: 'text' }).subscribe({
    //   next: (response: any) => {
    //     console.log('Login successful:', response);
    //     window.location.href = '/home'; 
    //   },
    //   error: (err) => {
    //     console.error('Login failed:', err);
    //   },
    // });
    window.location.href = 'http://localhost:8080/spotify/login';
  }
}
