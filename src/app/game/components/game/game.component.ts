import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlindTestService } from '../../../services/blindTestService/blind-test.service';
import { TimerService } from '../../../services/timerService/timer.service';
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
  revealDuration: number = 15;
  discoveryDuration: number = 20;
  pauseBetweenTracks: number = 2;

  playlists: { id: string; name: string; banner: string | null }[] = [];
  currentSong: string | null = null;
  artistNames: string | null = null;
  currentSecond?: number;
  isReveal: boolean = false;
  isPlaylistSelectorVisible: boolean = false;
  isBlindTestRunning: boolean = false;
  isPaused: boolean = false;

  private playlist: any[] = [];

  constructor(
    private blindTestService: BlindTestService,
    private timerService: TimerService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.fetchPlaylists();
  }

  ngOnDestroy() {
    this.timerService.clearTimer();
  }

  getStrokeDashArray() {
    const progress = ((this.currentSecond||0) / this.discoveryDuration) * 100;
    const circumference = 2 * Math.PI * 16;
    return `${(progress * circumference) / 100}, ${circumference}`;
  }
  

  selectPlaylistAndClose(playlistId: string): void {
    this.selectPlaylist(playlistId); 
    this.isPlaylistSelectorVisible = false; 
  }
  

  /** Affiche ou cache le sélecteur de playlists */
  togglePlaylistSelector() {
    
    this.isPlaylistSelectorVisible = !this.isPlaylistSelectorVisible;

  }

  /** Récupère les playlists disponibles */
  fetchPlaylists(): void {
    this.playlistService.getPlaylists().subscribe(
      (data) => (this.playlists = data),
      (err) => (this.blindTestStatus = 'Erreur lors du chargement des playlists.')
    );
  }

  /** Sélectionne une playlist spécifique */
  selectPlaylist(playlistId: string) {
    this.playlistId = playlistId;
    const selectedPlaylist = this.playlists.find((p) => p.id === playlistId)?.name || '';
    this.blindTestStatus = `Playlist sélectionnée : ${selectedPlaylist}`;
  }
  
  togglePauseResume() {
    if (this.isPaused) {
      this.resumeBlindTest();
    } else {
      this.pauseBlindTest();
    }
  }

  /** Démarre le blind test */
  startBlindTest() {
    if (!this.playlistId) {
      this.blindTestStatus = 'Veuillez sélectionner une playlist.';
      return;
    }

    this.blindTestStatus = 'Récupération de la playlist...';

    this.isReveal = false;
    this.currentSong = null;
    this.artistNames = null;
    this.currentSecond = this.discoveryDuration;
    this.isBlindTestRunning = true;
    this.isPlaylistSelectorVisible = false;
    this.isPaused = false;

    this.blindTestService.startBlindTest(this.playlistId).subscribe((playlist) => {
      if (!playlist.length) {
        this.blindTestStatus = 'Aucune chanson trouvée dans la playlist.';
      } else {
        this.blindTestStatus = 'Blind test démarré !';
        this.playlist = playlist;
        this.playNextSong(0);
      }
    });
  }

  /** Lit la prochaine chanson de la playlist */
  private playNextSong(index: number) {
    if (index >= this.playlist.length) {
        this.blindTestStatus = 'Blind test terminé.';
        return;
    }

    const song = this.playlist[index];
    this.blindTestStatus = `Lecture de la chanson ${index + 1} / ${this.playlist.length}`;

    this.isReveal = false;
    this.currentSong = null;
    this.artistNames = null;
    this.currentSecond = this.discoveryDuration;

    this.blindTestService.sendSongAction('play', song.id).subscribe();

    this.timerService.startTimer(
      this.discoveryDuration,
      (remaining) => {
          this.currentSecond = remaining;
      },
      () => {
          this.blindTestService.sendSongAction('stop', song.id).subscribe();
          setTimeout(() => {
              this.revealSongDetails(song, index);
          }, this.pauseBetweenTracks * 1000);
      }
  );
  
}
private revealSongDetails(song: any, index: number) {
  console.log("Song object:", song);
  console.log("les artistes : "+song.artistNames);
  let pauseBetweenTracksMs: number = this.pauseBetweenTracks * 1000;
    this.isReveal = true;
    this.currentSong = song.songName || 'Chanson inconnue';
    this.artistNames = song.artistNames || 'Artistes inconnus';

    this.currentSecond = this.revealDuration;

    this.blindTestService.sendSongAction('playAtRefrain', song.id).subscribe();
    this.timerService.startTimer(
        this.revealDuration,
        (remaining) => (this.currentSecond = remaining),
        () => {
            this.blindTestService.sendSongAction('stop', song.id).subscribe();
            setTimeout(() => {
              this.playNextSong(index + 1); 
          }, pauseBetweenTracksMs);
        }
    );
}



  /** Met le blind test en pause */
  pauseBlindTest() {
    this.blindTestStatus = 'Blind test mis en pause.';
    if (this.playlistId) {
      this.blindTestService.sendSongAction('stop', this.playlistId).subscribe();
    }
  }

  /** Reprend le blind test après une pause */
  resumeBlindTest() {
    this.blindTestStatus = 'Blind test repris.';
    this.isReveal = false;
    if (this.playlistId) {
      this.blindTestService.sendSongAction('resume', this.playlistId).subscribe();
    }
  }

  /** Arrête complètement le blind test */
  stopBlindTest() {
    this.blindTestStatus = 'Blind test arrêté.';
    this.isReveal = false;
    this.currentSong = null;
    this.artistNames = null;
    this.timerService.clearTimer();
    this.isBlindTestRunning = false;
    if (this.playlistId) {
      this.blindTestService.sendSongAction('stop', this.playlistId).subscribe();
    }
  }
}
