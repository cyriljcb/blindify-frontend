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
    console.log('Intercepted request:', req.url);

    // Mock pour le login
    // if (req.url.includes('/auth/login') && req.method === 'POST') {
    //   console.log('Mock intercepted /auth/login');
    //   const mockLoginResponse = {
    //     message: 'Login successful',
    //     token: 'mock-access-token',
    //   };
    //   return of(new HttpResponse({ status: 200, body: mockLoginResponse }));
    // }

    // // Liste complète des chansons de la playlist "Twenty One"
    // const songs = [
    //   {
    //     id: "0sXvjZV7p4uvyPN4uQo3FH",
    //     name: "Neon Gravestones",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 240266,
    //   },
    //   {
    //     id: "2OdfQjIJlomZFUBTEDKMre",
    //     name: "No Chances",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 226449,
    //   },
    //   {
    //     id: "5P3yUXUC9rZPJPNmYGKEAz",
    //     name: "Goner",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 236733,
    //   },
    //   {
    //     id: "01vv2AjxgP4uUyb8waYO5Y",
    //     name: "Morph",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 258853,
    //   },
    //   {
    //     id: "4Oyl6oYSNeeZZP0OAxPVaU",
    //     name: "Message Man",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 240080,
    //   },
    //   {
    //     id: "2XPmTamsj7d9i3gzLCL4JI",
    //     name: "Redecorate",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 245842,
    //   },
    //   {
    //     id: "6GmkJJMe9U1tEcrJ3Hq3A1",
    //     name: "Polarize",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 226786,
    //   },
    //   {
    //     id: "57yL3161hUMuw06zzzUCHi",
    //     name: "Doubt",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 191493,
    //   },
    //   {
    //     id: "1LAlLBTGBUO0MDA8IbSysd",
    //     name: "Overcompensate",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 236000,
    //   },
    //   {
    //     id: "5SehvGGC53A7SZKCLXQcyt",
    //     name: "Nico and the Niners",
    //     artistName: "Twenty One Pilots",
    //     previewUrl: null,
    //     duration: 225040,
    //   },
    //   {
    //     id: "1QJbDTZAO8rpGOMG4UahFM",
    //     name: "The Line (from the series Arcane League of Legends)",
    //     artistName: "Arcane",
    //     previewUrl: null,
    //     duration: 192000,
    //   },
    // ];

    // // Mock pour récupérer les détails d'une playlist spécifique
    // if (req.url.startsWith('/api/spotify/playlists/') && req.method === 'GET') {
    //   const playlistId = req.url.split('/').pop(); // Récupérer l'ID de la playlist depuis l'URL
      
    //   // Sélectionner aléatoirement deux chansons
    //   const selectedSongs = songs
    //     .sort(() => Math.random() - 0.5) // Mélanger la liste
    //     .slice(0, 2); // Prendre les 2 premières chansons

    //   const mockPlaylistDetails = {
    //     id: playlistId,
    //     name: `Playlist ${playlistId}`,
    //     songs: selectedSongs,
    //     banner: null,
    //   };

    //   console.log('Mock playlist details response:', mockPlaylistDetails);
    //   return of(new HttpResponse({ status: 200, body: mockPlaylistDetails }));
    // }

    // // Mock pour les playlists
    // if (req.url === '/spotify/playlists' && req.method === 'GET') {
    //   const mockPlaylists = {
    //     playlists: [
    //       {
    //         id: '3sPP4AKZEKKatQ4R79U5mf',
    //         name: 'Twenty One',
    //         songs: [],
    //         banner:
    //           'https://mosaic.scdn.co/640/ab67616d00001e022df0d98a423025032d0db1f7ab67616d00001e029cf15c7323fb85b7112197d5ab67616d00001e02ca964f2c3c069b3fb9ec11beab67616d00001e02d1d301e737da4324479c6660',
    //       },
    //       {
    //         id: '2',
    //         name: 'Classiques 90s',
    //         songs: [],
    //         banner:
    //           'https://mosaic.scdn.co/640/ab67616d00001e022df0d98a423025032d0db1f7ab67616d00001e029cf15c7323fb85b7112197d5ab67616d00001e02ca964f2c3c069b3fb9ec11beab67616d00001e02d1d301e737da4324479c6660',
    //       },
    //     ],
    //   };
    //   console.log('Mock playlists response:', mockPlaylists);
    //   return of(new HttpResponse({ status: 200, body: mockPlaylists }));
    // }

    // // Par défaut, passer la requête au prochain handler
     return next.handle(req);
  }
}
