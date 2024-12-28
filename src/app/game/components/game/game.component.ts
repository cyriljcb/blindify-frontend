import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BlindTestService } from '../../../services/blindTestService/blind-test.service';
import { WebSocketService } from '../../../services/webSocketService/web-socket.service';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnDestroy {
  playlistId: string = ''; // ID de la playlist
  blindTestStatus: string = ''; // Statut du blindtest
  currentSong: string | null = null; // Chanson en cours
  private socketSubscription: Subscription | null = null;

  constructor(
    private blindTestService: BlindTestService,
    private webSocketService: WebSocketService
  ) {}

  // Démarre le blindtest
  startBlindTest() {
    if (!this.playlistId) {
      this.blindTestStatus = 'Veuillez sélectionner une playlist.';
      return;
    }

    this.blindTestService.startBlindTest(this.playlistId).subscribe(
      (response: string) => {
        this.blindTestStatus = response;
        this.subscribeToSongUpdates(); // Écouter les mises à jour via WebSocket
      },
      (error) => {
        console.error('Erreur lors du démarrage du blindtest :', error);
        this.blindTestStatus = 'Erreur lors du démarrage du blindtest.';
      }
    );
  }

  // Met en pause le blindtest
  pauseBlindTest() {
    this.blindTestService.pauseBlindTest().subscribe(
      (response: string) => {
        this.blindTestStatus = response;
      },
      (error) => {
        console.error('Erreur lors de la mise en pause :', error);
        this.blindTestStatus = 'Erreur lors de la mise en pause.';
      }
    );
  }

  // Reprend le blindtest
  resumeBlindTest() {
    this.blindTestService.resumeBlindTest().subscribe(
      (response: string) => {
        this.blindTestStatus = response;
      },
      (error) => {
        console.error('Erreur lors de la reprise :', error);
        this.blindTestStatus = 'Erreur lors de la reprise.';
      }
    );
  }

  // Arrête le blindtest
  stopBlindTest() {
    this.blindTestService.stopBlindTest().subscribe(
      (response: string) => {
        this.blindTestStatus = response;
        this.currentSong = null;
        this.unsubscribeFromSongUpdates();
      },
      (error) => {
        console.error('Erreur lors de l\'arrêt :', error);
        this.blindTestStatus = 'Erreur lors de l\'arrêt.';
      }
    );
  }

  // S'abonner aux mises à jour des chansons via WebSocket
  private subscribeToSongUpdates() {
    this.unsubscribeFromSongUpdates(); // Arrête toute souscription précédente

    this.webSocketService.connect();
    this.socketSubscription = new Subscription();

    const songSubscription = this.webSocketService.subscribe(
      '/topic/song',
      (message: any) => {
        this.currentSong = message?.songName
          ? `${message.songName} - ${message.artistName}`
          : null;
      }
    );

    this.socketSubscription.add(songSubscription);
  }

  // Arrêter l'écoute des mises à jour
  private unsubscribeFromSongUpdates() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
      this.socketSubscription = null;
    }

    this.webSocketService.disconnect();
  }

  // Nettoie les souscriptions à la destruction du composant
  ngOnDestroy() {
    this.unsubscribeFromSongUpdates();
  }
}
