import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  isLoggedIn: boolean = false;
  username: string = '';
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      console.log("token : "+token);
      if (token) {
        localStorage.setItem('spotify_access_token', token);
        console.log(localStorage.getItem('spotify_access_token'));
        localStorage.setItem('user', JSON.stringify({ name: 'Cyril' }));
        const user = localStorage.getItem('user');  //code bidon à supp
        if (user) {
          this.isLoggedIn = true;
          this.username = JSON.parse(user).name;
        }
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,
        });
      }
    });
  }
}
