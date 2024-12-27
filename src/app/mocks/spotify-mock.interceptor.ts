import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class SpotifyMockInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Mock pour récupérer une liste de playlists
    if (req.url === '/api/spotify/playlists') {
      const mockPlaylists = {
        playlists: [
          {
            id: '1',
            name: 'Hits 2023',
            tracks: [
              { id: 't1', title: 'Song 1', artist: 'Artist 1' },
              { id: 't2', title: 'Song 2', artist: 'Artist 2' },
            ],
          },
          {
            id: '2',
            name: 'Classiques 90s',
            tracks: [
              { id: 't3', title: 'Song 3', artist: 'Artist 3' },
              { id: 't4', title: 'Song 4', artist: 'Artist 4' },
            ],
          },
        ],
      };
      return of(new HttpResponse({ status: 200, body: mockPlaylists }));
    }

    // Mock pour le login
    if (req.url === 'http://localhost:8080/spotify/login') {
      const mockLoginResponse = {
        message: 'Login successful',
        token: 'mock-access-token', // Token simulé
      };
      return of(new HttpResponse({ status: 200, body: mockLoginResponse }));
    }

    // Mock pour récupérer les détails d'une playlist spécifique
    if (req.url.startsWith('/api/spotify/playlists/') && req.method === 'GET') {
      const playlistId = req.url.split('/').pop(); // Récupérer l'ID de la playlist depuis l'URL
      const mockPlaylistDetails = {
        id: playlistId,
        name: `Playlist ${playlistId}`,
        tracks: [
          { id: 't1', title: 'Song 1', artist: 'Artist 1' },
          { id: 't2', title: 'Song 2', artist: 'Artist 2' },
        ],
      };
      return of(new HttpResponse({ status: 200, body: mockPlaylistDetails }));
    }

    // Par défaut, passer la requête au prochain handler
    return next.handle(req);
  }
}
