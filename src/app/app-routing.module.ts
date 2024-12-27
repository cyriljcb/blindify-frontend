import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'playlists', loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsModule) },
  { path: 'home', component: HomeComponent }, // Page principale après connexion
  //{ path: 'error', component: ErrorComponent }, // Page pour afficher les erreurs
  { path: '**', redirectTo: '/home' }, // Redirige toutes les routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
