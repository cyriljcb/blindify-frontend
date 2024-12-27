import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<any> {
    return this.http.get('/spotify/playlists'); // Cette URL sera interceptée par le mock
  }
}
