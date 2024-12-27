import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {//implements OnInit {
  // token: string | null = null;

  // constructor(private route: ActivatedRoute) {}

  // ngOnInit(): void {
  //   this.token = this.route.snapshot.queryParamMap.get('token');
  //   if (this.token) {
  //     localStorage.setItem('access_token', this.token);
  //   }
  // }
}
