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

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('http://localhost:8080/ws');
      socket.onopen = () => console.log('SockJS ouvert');
      socket.onerror = (err) => {
        console.error('Erreur SockJS :', err);
        reject(err);
      };
  
      this.stompClient = new Stomp.Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
      });
  
      this.stompClient.onConnect = () => {
        console.log('WebSocket connecté');
        resolve();
      };
  
      this.stompClient.onStompError = (frame) => {
        console.error('Erreur WebSocket : ', frame.headers['message']);
        console.error('Détails : ', frame.body);
        reject(new Error(frame.headers['message']));
      };
  
      this.stompClient.activate();
    });
  }
  
  
  subscribe(topic: string, callback: (message: any) => void): Subscription {
    if (!this.stompClient) {
      console.warn('WebSocket non initialisé.');
      return new Subscription();
    }
  
    if (this.stompClient.connected) {
      return this.internalSubscribe(topic, callback);
    } else {
      console.warn('WebSocket non connecté. Abonnement différé.');
      const interval = setInterval(() => {
        if (this.stompClient && this.stompClient.connected) {
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
  
  // Méthode pour envoyer un message au backend via WebSocket
  sendMessage(destination: string, message: any): void {
    if (this.stompClient && this.stompClient.connected) {
      try {
        this.stompClient.publish({
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

  // Déconnexion
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate(); // Arrêter la connexion
      console.log('WebSocket déconnecté');
    }
  }
}
