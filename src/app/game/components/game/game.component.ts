import { Component, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BlindTestService } from '../../../services/blindTestService/blind-test.service';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
  
})
export class GameComponent implements OnDestroy {
  playlistId: string = ''; // ID de la playlist
  blindTestStatus: string = ''; // Statut du blindtest
  currentSong: string | null = null; // Chanson en cours
  blindTestSubscription: Subscription | null = null;

  constructor(private blindTestService: BlindTestService) {}

  // Démarre le blindtest
  startBlindTest() {
    if (!this.playlistId) {
      this.blindTestStatus = 'Veuillez sélectionner une playlist.';
      return;
    }

    this.blindTestService.startBlindTest(this.playlistId).subscribe(
      (response: string) => {
        this.blindTestStatus = response;
        this.pollCurrentSong();
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
        this.unsubscribePolling();
      },
      (error) => {
        console.error('Erreur lors de l\'arrêt :', error);
        this.blindTestStatus = 'Erreur lors de l\'arrêt.';
      }
    );
  }

  // Vérifie la chanson actuelle en cours (polling)
  pollCurrentSong() {
    this.unsubscribePolling();

    this.blindTestSubscription = interval(2000).subscribe(() => {
      this.blindTestService.getCurrentSong().subscribe(
        (data: any) => {
          this.currentSong = data?.songName
            ? `${data.songName} - ${data.artistName}`
            : null;
        },
        (error) => {
          console.error('Erreur lors du polling de la chanson actuelle :', error);
        }
      );
    });
  }

  // Arrête le polling
  unsubscribePolling() {
    if (this.blindTestSubscription) {
      this.blindTestSubscription.unsubscribe();
      this.blindTestSubscription = null;
    }
  }

  // Nettoie les souscriptions à la destruction du composant
  ngOnDestroy() {
    this.unsubscribePolling();
  }
}
