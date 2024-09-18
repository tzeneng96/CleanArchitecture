import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from '../../api-authorization/authorize.guard';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';


export const routes: Routes = [
  {
    path: "",
    data: { bc: "Home", path: "" },
    children: [
      {
        path: "",
        component: UserComponent,
        data: { bc: "user", path: "/user"},
        children: [
          {
            path: "",
            component: UserListComponent,
            data: { bc: "user list", path: "/userlist"},
          },
          {
            path: "create",
            component: CreateUserComponent,
            data: { bc: "user create", path: "/create"},
          },
          {
            path: "update/:id",
            component: UpdateUserComponent,
            data: { bc: "user create", path: "/update" },
          },
        ],
      },
    ]
  }
];

export const UserRoutingModule = RouterModule.forChild(routes);


