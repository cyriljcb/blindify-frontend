import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../../models/playlist.model';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>('/spotify/playlists');
  }

  getPlaylistById(playlistId: string): Observable<Playlist> {
    return this.http.get<Playlist>(`/spotify/playlists/${playlistId}`);
  }
}
