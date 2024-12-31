import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlaylistService } from '../../../services/playlistService/playlist.service';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {
  @Output() playlistSelected = new EventEmitter<string>();
  playlists: { id: string; name: string; banner: string | null; tracks: any[] }[] = [];
  errorMessage: string | null = null;

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.fetchPlaylists();
  }

  fetchPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        console.log('Playlists received:', data);
        this.playlists = data;
      },
      error: (err) => {
        this.errorMessage = 'Une erreur est survenue lors du chargement des playlists.';
        console.error(err);
      },
    });
  }
  selectPlaylist(playlistId: string): void {
    this.playlistSelected.emit(playlistId);
  }
}
