import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;

  constructor() {}

  // Connexion au serveur WebSocket
  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws'); // URL du backend WebSocket
    this.stompClient = new Stomp.Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // Tentative de reconnexion après 5s en cas de déconnexion
    });

    this.stompClient.onConnect = () => {
      console.log('WebSocket connecté');
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Erreur WebSocket : ', frame.headers['message']);
      console.error('Détails : ', frame.body);
    };

    this.stompClient.activate(); // Démarrer la connexion
  }

  // S'abonner à un sujet
  subscribe(topic: string, callback: (message: any) => void): Subscription {
    if (this.stompClient && this.stompClient.connected) {
      const subscription = this.stompClient.subscribe(topic, (response) => {
        const body = JSON.parse(response.body);
        callback(body);
      });
  
      return new Subscription(() => {
        subscription.unsubscribe();
      });
    } else {
      console.warn('Impossible de s’abonner : WebSocket non connecté.');
      return new Subscription(); // Subscription vide si non connecté
    }
  }
  

  // Déconnexion
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate(); // Arrêter la connexion
      console.log('WebSocket déconnecté');
    }
  }
}
