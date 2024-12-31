import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private intervalId: any = null;

  startTimer(duration: number, onTick: (remaining: number) => void, onComplete: () => void): void {
    this.clearTimer(); 
    let remainingTime = duration;

    onTick(remainingTime); 

    this.intervalId = setInterval(() => {
      remainingTime--;
      if (remainingTime <= 0) {
        onTick(0);
        this.clearTimer();
        onComplete();
      } else {
        onTick(remainingTime);
      }
    }, 1000); 
  }

  clearTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

