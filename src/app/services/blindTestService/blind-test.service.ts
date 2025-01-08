import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlindTestService {
  constructor(private http: HttpClient) {}

  startBlindTest(playlistId: string): Observable<any[]> {
    return this.http
      .get<{ playlist: any[] }>(`/spotify/blindtest/start?playlistId=${playlistId}`)
      .pipe(
        catchError((err) => {
          console.error('Erreur lors de la récupération de la playlist :', err);
          return of({ playlist: [] });
        }),
        map((response) => response.playlist || [])
      );
  }

  sendSongAction(command: string, songId: string): Observable<any> {
    return this.http
      .post(`/spotify/blindtest/action`, { command, songId })
      .pipe(
        catchError((err) => {
          console.error(`Erreur lors de l'envoi de la commande "${command}" :`, err);
          return of(null);
        })
      );
  }
}
