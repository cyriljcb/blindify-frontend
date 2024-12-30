import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlaylistService } from '../../../services/playlistService/playlist.service';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  playlistId: string = '';
  blindTestStatus: string = '';
  playlists: { id: string; name: string; banner: string | null }[] = [];
  currentSong: string | null = null;
  artistName: string | null = null;
  currentSecond: number = 20;
  isReveal: boolean = false;
  isPlaylistSelectorVisible: boolean = false;

  private timerInterval: any = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.fetchPlaylists();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  fetchPlaylists(): void {
    this.playlistService
      .getPlaylists()
      .pipe(
        catchError((err) => {
          console.error('Erreur lors du chargement des playlists :', err);
          this.blindTestStatus = 'Une erreur est survenue lors du chargement des playlists.';
          return of([]);
        })
      )
      .subscribe((data) => {
        console.log('Playlists reçues :', data);
        this.playlists = data;
      });
  }

  togglePlaylistSelector() {
    this.isPlaylistSelectorVisible = !this.isPlaylistSelectorVisible;
  }

  selectPlaylist(playlistId: string) {
    this.playlistId = playlistId;
    const selectedPlaylist = this.playlists.find((p) => p.id === playlistId)?.name || '';
    this.blindTestStatus = `Playlist sélectionnée : ${selectedPlaylist}`;
  }

  startBlindTest() {
    if (!this.playlistId) {
      this.blindTestStatus = 'Veuillez sélectionner une playlist.';
      return;
    }

    this.blindTestStatus = 'Récupération de la playlist...';

    this.http
      .get<{ playlist: any[] }>(`http://localhost:8080/spotify/blindtest/start?playlistId=${this.playlistId}`)
      .pipe(
        map((response) => response.playlist),
        catchError((err) => {
          console.error('Erreur lors de la récupération de la playlist :', err);
          this.blindTestStatus = 'Erreur lors de la récupération de la playlist.';
          return of([]);
        })
      )
      .subscribe((playlist) => {
        if (!playlist || playlist.length === 0) {
          this.blindTestStatus = 'Aucune chanson trouvée dans la playlist.';
        } else {
          this.blindTestStatus = 'Blind test démarré !';
          this.startPlayingSongs(playlist);
        }
      });
  }

  private startPlayingSongs(playlist: any[]) {
    let currentIndex = 0;

    const playNextSong = () => {
      if (currentIndex >= playlist.length) {
        this.blindTestStatus = 'Blind test terminé.';
        return;
      }

      const song = playlist[currentIndex];
      this.blindTestStatus = `Lecture de la chanson ${currentIndex + 1} / ${playlist.length}`;
      this.sendSongAction('play', song.id);

      this.startTimer(20, () => {
        this.sendSongAction('stop', song.id);

        setTimeout(() => {
          this.revealSongDetails(song);

          setTimeout(() => {
            this.sendSongAction('playAtRefrain', song.id);

            setTimeout(() => {
              currentIndex++;
              playNextSong();
            }, 15000); // Temps pour le refrain
          }, 1000); // Délai après le reveal
        }, 2000); // Délai avant le reveal
      });
    };

    playNextSong();
  }

  private sendSongAction(command: string, songId: string) {
    this.http
      .post(`http://localhost:8080/spotify/blindtest/action`, { command, songId })
      .pipe(
        catchError((err) => {
          console.error(`Erreur lors de l'envoi de la commande "${command}" :`, err);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log(`Commande "${command}" envoyée pour la chanson ${songId}`);
      });
  }

  private startTimer(seconds: number, onComplete: () => void) {
    this.clearTimer();
    this.currentSecond = seconds;
    this.isReveal = false;

    this.timerInterval = setInterval(() => {
      if (this.currentSecond > 0) {
        this.currentSecond--;
      } else {
        this.clearTimer();
        onComplete();
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private revealSongDetails(song: any) {
    this.isReveal = true;
    this.currentSong = song.songName || 'Chanson inconnue';
    this.artistName = song.artistName || 'Artiste inconnu';
  }

  pauseBlindTest() {
    this.blindTestStatus = 'Blind test mis en pause.';
    this.isReveal = false;
    this.clearTimer();
    this.sendSongAction('pause', this.playlistId);
  }

  resumeBlindTest() {
    this.blindTestStatus = 'Blind test repris.';
    this.isReveal = false;
    this.sendSongAction('resume', this.playlistId);
  }

  stopBlindTest() {
    this.blindTestStatus = 'Blind test arrêté.';
    this.isReveal = false;
    this.currentSong = null;
    this.artistName = null;
    this.clearTimer();
    this.sendSongAction('stop', this.playlistId);
  }
}
