import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './components/game/game.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule,
    FormsModule,
    GameRoutingModule],
})
export class GameModule {}
