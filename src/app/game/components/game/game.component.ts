import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../../services/webSocketService/web-socket.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  playlistId: string = '';
  blindTestStatus: string = '';
  currentSong: string | null = null;
  artistName: string | null = null;
  currentSecond: number = 20; // Durée initiale du chrono
  isReveal: boolean = false; // Indique si on est en mode "reveal"
  private timerInterval: any = null; // Référence pour le setInterval
  private socketSubscription: Subscription | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.webSocketService.connect();
  }

  ngOnDestroy() {
    this.clearTimer();
    this.unsubscribeFromSongUpdates();
  }

  startBlindTest() {
    if (!this.playlistId) {
      this.blindTestStatus = 'Veuillez sélectionner une playlist.';
      return;
    }

    this.blindTestStatus = 'Récupération de la playlist...';

    // Requête HTTP pour démarrer le blind test
    this.http
      .get<{ message: string }>(`http://localhost:8080/spotify/blindtest/start?playlistId=${this.playlistId}`)
      .subscribe(
        (response) => {
          console.log('Réponse du backend :', response.message);
        },
        (error) => {
          console.error('Erreur lors de l’appel HTTP :', error);
          this.blindTestStatus = 'Erreur lors de la récupération de la playlist.';
        }
      );

    // Connexion WebSocket et abonnement
    this.webSocketService
      .connect()
      .then(() => {
        console.log('Connexion WebSocket établie, abonnement en cours...');
        this.webSocketService.subscribe('/topic/playlist', (playlist: any[]) => {
          if (!playlist || playlist.length === 0) {
            this.blindTestStatus = 'Aucune chanson trouvée dans la playlist.';
            return;
          }

          this.blindTestStatus = 'Blind test démarré !';
          this.startPlayingSongs(playlist);
        });

        this.webSocketService.sendMessage('/app/blindtest/start', { playlistId: this.playlistId });
      })
      .catch((err) => {
        console.error('Échec de la connexion WebSocket :', err);
        this.blindTestStatus = 'Impossible de démarrer le blind test. Erreur de connexion WebSocket.';
      });
  }

  private startPlayingSongs(playlist: any[]) {
    let currentIndex = 0;
  
    const playNextSong = () => {
      if (currentIndex >= playlist.length) {
        // Aucun morceau restant, arrêter le blind test
        this.blindTestStatus = 'Blind test terminé.';
        console.log('Fin du blind test, arrêt de la musique.');
        this.webSocketService.sendMessage('/app/blindtest/action', { command: 'stop' }); 
        return;
      }
  
      const song = playlist[currentIndex];
      this.blindTestStatus = `Lecture de la chanson ${currentIndex + 1} / ${playlist.length}`;
  
      console.log('Lecture de la chanson : ', song);
  
      // Envoyer la commande au backend pour jouer la chanson
      this.webSocketService.sendMessage('/app/blindtest/action', { command: 'play', songId: song.id });
  
      // Lancer le timer pour le début de la chanson
      this.startTimer(20, () => {
        console.log('Timer terminé, préparation pour le reveal');
  
        // Arrêter la lecture de la chanson
        this.webSocketService.sendMessage('/app/blindtest/action', { command: 'stop', songId: song.id });
  
        // Révéler les détails de la chanson après une pause d'une seconde
        setTimeout(() => {
          console.log('Reveal de la chanson');
          this.revealSongDetails(song);
  
          // Lecture du refrain après une seconde
          setTimeout(() => {
            console.log('Lecture du refrain');
            this.webSocketService.sendMessage('/app/blindtest/action', { command: 'playAtRefrain', songId: song.id });
  
            // Passer à la chanson suivante après un délai
            setTimeout(() => {
              console.log('Passage à la chanson suivante');
              currentIndex++;
              playNextSong(); // Passer à la chanson suivante
            }, 15000); // Temps pour le refrain
          }, 1000); // Délai après le reveal
        }, 1000); // Délai avant le reveal
      });
    };
  
    playNextSong();
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
      this.cdr.detectChanges(); // Mise à jour explicite de l'interface
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
    this.currentSong = song.name || 'Chanson inconnue';
    this.artistName = song.artistName || 'Artiste inconnu';
  }

  pauseBlindTest() {
    this.blindTestStatus = 'Blind test mis en pause.';
    this.isReveal = false;
    this.clearTimer();

    this.webSocketService.sendMessage('/app/blindtest/pause', { action: 'pause' });
  }

  resumeBlindTest() {
    this.blindTestStatus = 'Blind test repris.';
    this.isReveal = false;

    this.webSocketService.sendMessage('/app/blindtest/resume', { action: 'resume' });
  }

  stopBlindTest() {
    this.blindTestStatus = 'Blind test arrêté.';
    this.isReveal = false;
    this.currentSong = null;
    this.artistName = null;

    this.clearTimer();
    this.unsubscribeFromSongUpdates();

    this.webSocketService.sendMessage('/app/blindtest/stop', { action: 'stop' });
  }

  private unsubscribeFromSongUpdates() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
      this.socketSubscription = null;
    }
    this.webSocketService.disconnect();
  }
}
