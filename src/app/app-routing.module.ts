import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  // Routes protégées par le guard
  { path: 'playlists', loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsModule), canActivate: [AuthGuard] },
  { path: 'game', loadChildren: () => import('./game/game.module').then(m => m.GameModule), canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  
  //{ path: 'error', component: ErrorComponent }, // Page pour afficher les erreurs
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
