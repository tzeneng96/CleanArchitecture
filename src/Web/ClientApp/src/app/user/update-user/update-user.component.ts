import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { UpsertUserCommand, UserClient, UserModel } from '../../web-api-client';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthorizeService } from '../../../api-authorization/authorize.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  public searchObs$: Subject<string> = new Subject();
  loading = false;
  model: UserModel = new UserModel();
  subscription: Subscription;
  userId: string;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private userService: UserClient,
    private authorizeService: AuthorizeService,
  ) {
    this.subscription = this.route.params.pipe().subscribe(params => {
      this.userId = params['id'] == null ? "" : params['id'];
      this.load();
    });
  }


  ngOnInit(): void {
    this.load();
  }

  load() {
    this.userService.user_QueryUserById(this.userId).subscribe((res) => {
      if (res) {
        this.model = res;
        console.log(res, "res")
      }
    })
  }
  updateUser() {
    let command = new UpsertUserCommand();
    command.model = this.model;
    this.userService.user_UpdateUser(command).subscribe((res) => {
      if (res) {
        this.router.navigateByUrl("/user")
      }
    })
  }
}
