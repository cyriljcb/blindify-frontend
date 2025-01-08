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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      console.log("token : "+token);
      if (token) {
        localStorage.setItem('spotify_access_token', token);
        console.log(localStorage.getItem('spotify_access_token'));

        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,
        });
      }
    });
  }
}
