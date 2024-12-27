import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../../services/playlistService/playlist.service';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'], // Corrigé 'styleUrl' en 'styleUrls'
})
export class PlaylistComponent implements OnInit {
  playlists: { id: string; name: string; banner: string | null; tracks: any[] }[] = [];
  errorMessage: string | null = null;

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.fetchPlaylists();
  }

  fetchPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
      },
      error: (err) => {
        this.errorMessage = 'Une erreur est survenue lors du chargement des playlists.';
        console.error(err);
      },
    });
  }
}
