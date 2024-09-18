import { Component, ViewChild } from '@angular/core';
import { Subject, debounceTime, first, startWith, switchMap } from 'rxjs';
import { UserClient, UserModel } from '../../web-api-client';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { D2UDialogService } from '../../shared/services/dialogs/dialog.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  id: number;
  title: string;
  userEmail: string;
  department: string;
  page = 0;
  pageSize = 24;
  totalRecords = 0;
  loading = false;
  searchCriteria = "";
  public searchObs$: Subject<string> = new Subject();
  user: UserModel[] = [];
  dataSource = new MatTableDataSource<UserModel>();
  displayedColumns: string[] = [
    "no",
    "userName",
    "email",
    "phone",
    "hobby",
    "skillsets",
    "action"
  ];
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: D2UDialogService,
    private userService: UserClient,
  ) {
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.userService.user_QueryUsers(this.page+1, this.pageSize, this.searchCriteria)
      .pipe(first()).subscribe(res => {
        this.dataSource.data = res.items;
        this.totalRecords = res.totalCount;
        this.loading = false;
      }, err => {
        this.loading = false;

      });
  }

  onPageChanged($event: PageEvent) {
    this.page = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.load();
  }

  applyFilter(event: Event) {
    this.searchCriteria = (event.target as HTMLInputElement).value;
    this.load();
  }

  open(row: UserModel) {
    console.log(row.userId, "user id")
    let data = row.userId;
    this.router.navigate([`/user/update/` + data]); // todo: change to update
  }

  searchPatients() {
    this.searchObs$.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        this.loading = true;
        return this.userService.user_QueryUsers(this.page, this.pageSize, this.searchCriteria);
      })
    ).subscribe(res => {
      this.dataSource.data = res.items;
      this.user = res.items;
      this.totalRecords = res.totalCount;
      this.loading = false;
    }, err => {
      this.loading = false;

    });
  }

  delete(user: UserModel) {
    this.dialogService
      .openConfirm({
        title: "Delete User?",
        message: "Are you sure to delete " + user.userName + " ?",
        acceptButton: "Delete",
        cancelButton: "Cancel",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          user.isLocked = true;
          let sbProgress = this.snackBar.open("Deleting...");
          this.userService.user_DeleteUser(user).subscribe(() => {
              sbProgress.dismiss();
              this.dialogService
                .openAlert({
                  title: "User Deleted",
                  message: user.userName + "is deleted",
                })
                .afterClosed()
                .subscribe(() => this.load());
            },
            (err) => {
              sbProgress.dismiss();
              this.dialogService.openAlert({
                title: this.title,
                message: JSON.parse(err.response).error,
              });
            }
          );
        }
      });
  }
}
