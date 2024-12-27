import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private baseUrl = '/spotify'; // Utilisation d'un chemin relatif


  constructor(private http: HttpClient) {}

  // Récupérer les playlists
  getPlaylists(): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists`);
  }
}
