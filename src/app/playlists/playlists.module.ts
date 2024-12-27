import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistsRoutingModule } from './playlists-routing.module';
import { PlaylistComponent } from './components/playlist/playlist.component';

@NgModule({
  declarations: [PlaylistComponent],
  imports: [
    CommonModule,
    PlaylistsRoutingModule, // Import du module de routage
  ],
})
export class PlaylistsModule {}
