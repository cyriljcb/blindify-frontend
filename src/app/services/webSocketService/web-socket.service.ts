import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private connected: boolean = false; // Propriété isConnected

  constructor() {}

  // Getter pour la propriété isConnected
  isConnected(): boolean {
    return this.connected;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('http://localhost:8080/ws');

      this.stompClient = new Stomp.Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
      });

      this.stompClient.onConnect = () => {
        console.log('WebSocket connecté');
        this.connected = true; // Mise à jour de l'état de connexion
        resolve();
      };

      this.stompClient.onStompError = (frame) => {
        console.error('Erreur WebSocket : ', frame.headers['message']);
        console.error('Détails : ', frame.body);
        this.connected = false; // État désactivé en cas d'erreur
        reject(new Error(frame.headers['message']));
      };

      this.stompClient.onDisconnect = () => {
        console.log('WebSocket déconnecté');
        this.connected = false; // Mise à jour de l'état
      };

      this.stompClient.activate();
    });
  }

  subscribe(topic: string, callback: (message: any) => void): Subscription {
    if (!this.stompClient) {
      console.warn('WebSocket non initialisé.');
      return new Subscription();
    }

    if (this.isConnected()) {
      return this.internalSubscribe(topic, callback);
    } else {
      console.warn('WebSocket non connecté. Abonnement différé.');
      const interval = setInterval(() => {
        if (this.isConnected()) {
          clearInterval(interval);
          this.internalSubscribe(topic, callback);
        }
      }, 100); // Vérifie toutes les 100ms
      return new Subscription();
    }
  }

  private internalSubscribe(topic: string, callback: (message: any) => void): Subscription {
    const subscription = this.stompClient!.subscribe(topic, (response) => {
      try {
        console.log('Message brut reçu :', response.body);
        const body = JSON.parse(response.body);
        callback(body);
      } catch (e) {
        console.error('Erreur lors du parsing du message WebSocket :', response.body, e);
      }
    });

    return new Subscription(() => {
      subscription.unsubscribe();
    });
  }

  sendMessage(destination: string, message: any): void {
    if (this.isConnected()) {
      try {
        this.stompClient!.publish({
          destination: destination,
          body: JSON.stringify(message),
        });
        console.log(`Message envoyé à ${destination} :`, message);
      } catch (error) {
        console.error('Erreur lors de l’envoi du message :', error);
      }
    } else {
      console.warn('Impossible d’envoyer un message : WebSocket non connecté.');
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('WebSocket déconnecté');
      this.connected = false; // Mise à jour de l'état de connexion
    }
  }
}
