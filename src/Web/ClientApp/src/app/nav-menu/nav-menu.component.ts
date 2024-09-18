import { Component } from '@angular/core';
import { Observable, take } from 'rxjs';
import { UserModel } from '../web-api-client';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  public version: string;
  isExpanded = false;
  public isAuthenticated: Observable<boolean>;
  user: UserModel;
  links = [];
  selectedSearchCategory: string = "";
  isShowBarcode = false;
  isUser = false;
  constructor(
    private authorizeService: AuthorizeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    this.authorizeService
      .getUser()
      .pipe(take(1))
      .subscribe((user) => {
        if (user) {
          this.user = user;
          console.log(this.user, "user")
          var role = user.role;
          this.isShowBarcode = role != "User";
          this.isUser = role == "User";
          if (role == "User") {
            this.links = [];
          } else if (role == "ReportUploader") {
            this.links = [
              { title: "Genome Report", path: "uploadGenomeReport" },
            ];
          } else {
            this.links = [
              { title: "Accessions", path: "accessions", children: [] },
              { title: "Patients", path: "patients", children: [] },
              {
                title: "Operations",
                path: "",
                children: [
                  {
                    title: "Internal Transfer",
                    path: "itforms",
                  },
                  {
                    title: "COVID Worksheet",
                    path: "worksheets/covidwstraylist",
                  },
                  {
                    title: "COVID RTK Worksheet",
                    path: "worksheets/covidrtkwstraylist",
                  },
                  {
                    title: "Clinical Worksheet",
                    path: "worksheets/clinical-worksheet",
                  },
                  {
                    title: "Analyzers",
                    path: "analyzers",
                  },
                  {
                    title: "Critical Result Notification",
                    path: "critical-result-notification",
                  },
                ],
              },
              {
                title: "Finance",
                path: "finances",
              },
              { title: "Reports", path: "reports" },
            ];
          }
        }
      });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  //openSearchDialog() {
  //  this.dialogService.open(SearchByCodeDialogComponent, {
  //    minWidth: "150px",
  //    width: "50%",
  //  });
  //}

  openProfileDialog() {
    //this.dialogService.open(UserProfileDialogComponent, {
    //  width: "80%",
    //});
  }

  logout() {
    this.authorizeService.signOut();

    //this.dialogService
    //  .openConfirm({
    //    title: "Logout",
    //    message: "Are you sure you want to logout?",
    //    acceptButton: "Logout",
    //  })
    //  .afterClosed()
    //  .subscribe((result) => {
    //    if (result) {
    //      this.authorizeService.signOut();
    //    }
    //  });
  }

  openSnackbar() {
    // this.snackbar.open("testing", "OK", { duration: 3000 });
  }

  //openNewAccessionDialog() {
  //  this.router.navigate(["accessions/new-accession"]);
  //  // this.dialogService.open(NewAccessionDialogComponent, {
  //  //   minWidth: "80%",
  //  // });
  //}
}
