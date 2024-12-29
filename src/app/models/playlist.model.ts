export interface Playlist {
    id: string;
    name: string;
    banner: string | null; // Ajoute "banner" au type si elle n'est pas définie
    tracks: any[];
  }
  