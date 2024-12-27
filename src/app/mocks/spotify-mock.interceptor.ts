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
    // Log pour vérifier si l'intercepteur capture la requête
    console.log('Intercepted request:', req.url);


    // Mock pour récupérer une liste de playlists
    if (req.url === '/spotify/playlists') {
      const mockPlaylists = {
        playlists: [
          {
            id: '3sPP4AKZEKKatQ4R79U5mf',
            name: 'Twenty One',
            songs: [], // Si nécessaire, ajoutez des chansons ici
            banner:
              'https://mosaic.scdn.co/640/ab67616d00001e022df0d98a423025032d0db1f7ab67616d00001e029cf15c7323fb85b7112197d5ab67616d00001e02ca964f2c3c069b3fb9ec11beab67616d00001e02d1d301e737da4324479c6660',
          },
          {
            id: '2',
            name: 'Classiques 90s',
            songs: [], // Exemple vide pour une autre playlist
            banner:
              'https://mosaic.scdn.co/640/ab67616d00001e022df0d98a423025032d0db1f7ab67616d00001e029cf15c7323fb85b7112197d5ab67616d00001e02ca964f2c3c069b3fb9ec11beab67616d00001e02d1d301e737da4324479c6660',
          },
        ],
      };
      console.log('Mock playlists response:', mockPlaylists);
      return of(new HttpResponse({ status: 200, body: mockPlaylists }));
    }

    // Mock pour le login
    if (req.url.includes('/auth/login')) {
      console.log('Mock intercepted /auth/login');
      const mockLoginResponse = {
        message: 'Login successful',
        token: 'mock-access-token', // Simulated token
      };
      return of(new HttpResponse({ status: 200, body: mockLoginResponse }));
    }

    // Mock pour récupérer les détails d'une playlist spécifique
    if (req.url.startsWith('/api/spotify/playlists/') && req.method === 'GET') {
      const playlistId = req.url.split('/').pop(); // Récupérer l'ID de la playlist depuis l'URL
      const mockPlaylistDetails = {
        id: playlistId,
        name: `Playlist ${playlistId}`,
        songs: [
          { id: 't1', title: 'Song 1', artist: 'Artist 1' },
          { id: 't2', title: 'Song 2', artist: 'Artist 2' },
        ],
        banner:
          'https://mosaic.scdn.co/640/ab67616d00001e022df0d98a423025032d0db1f7ab67616d00001e029cf15c7323fb85b7112197d5ab67616d00001e02ca964f2c3c069b3fb9ec11beab67616d00001e02d1d301e737da4324479c6660',
      };
      
      return of(new HttpResponse({ status: 200, body: mockPlaylistDetails }));
    }

    // Par défaut, passer la requête au prochain handler
    return next.handle(req);
  }
}
