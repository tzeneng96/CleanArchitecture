import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserClient, UserModel } from '../../web-api-client';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {

  isUploading = false;

  @Input() container: string = "file";
  @Input() hint: string = "";
  @Input() fileType: string = "";
  @Input() acceptableFiles: string = ".*";
  @Input() fileInput: string = "";
  @Input() readonly = false;
  @Output() fileInputChange = new EventEmitter();
  isImage = false; S
  hideMock: boolean = true;
  public searchObs$: Subject<string> = new Subject();
  loading = false;
  userDepartment: string;
  runningNumber: number;
  refNo: string;
  files: File[] = [];
  userEmail: string;
  emailList: string[] = [];
  ccEmail: string[] = [];
  toEmail: string[] = [];
  model: UserModel = new UserModel();


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserClient,
    private authorizeService: AuthorizeService,
  ) {
  }


  ngOnInit(): void {
  }

  load() {

  }
  createUser() {
    this.model.isLocked = false;
    this.model.password = "Test@123";
    this.model.role = "Administrator";
    this.model.userId = "";
    this.userService.user_CreateUser(this.model).subscribe((res) => {
      if (res) {
        this.router.navigateByUrl("/user")
      }
    })
  }
}
