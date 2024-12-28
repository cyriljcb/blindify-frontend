import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlindTestService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Démarrer le blind test
  startBlindTest(playlistId: string) {
    return this.http.get(
      `${this.apiUrl}/blindtest/sequence?playlistId=${playlistId}`,
      { responseType: 'text' }
    );
  }

  // Mettre en pause
  pauseBlindTest() {
    return this.http.put(`${this.apiUrl}/blindtest/pause`, null, {
      responseType: 'text',
    });
  }

  // Reprendre
  resumeBlindTest() {
    return this.http.put(`${this.apiUrl}/blindtest/resume`, null, {
      responseType: 'text',
    });
  }

  // Arrêter
  stopBlindTest() {
    return this.http.put(`${this.apiUrl}/blindtest/stop`, null, {
      responseType: 'text',
    });
  }
}
