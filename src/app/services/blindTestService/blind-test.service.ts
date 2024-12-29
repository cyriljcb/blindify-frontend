import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BlindTestService {
  constructor(private http: HttpClient) {}

  // Récupérer la chanson actuelle (utile pour synchroniser l'état du lecteur)
  notifyCurrentSong() {
    return this.http.get('/spotify/player/current-song');
  }
}
