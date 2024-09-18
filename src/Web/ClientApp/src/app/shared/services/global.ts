import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Injectable({
  providedIn: 'root'
})
export class Globals {

  branchesChanged = new Subject();
  allowedRolesForAccession = ['Administrator', 'Lab', 'Lab Admin'];

  constructor(
    private authorizeService: AuthorizeService) {
    this.authorizeService.isAuthenticated().subscribe(loggedIn => {
      if (loggedIn) {
        //    this.loadBranches();
      }
    });
  }


}

