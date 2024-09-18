import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizeService } from '../../api-authorization/authorize.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {
  constructor(
    private authorizeService: AuthorizeService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  backClicked() {
    this.router.navigate(["/"]);
  }

  reloginClicked() {
    this.authorizeService.signOut();
    this.router.navigate(["/authentication/login"]);
  }
}
