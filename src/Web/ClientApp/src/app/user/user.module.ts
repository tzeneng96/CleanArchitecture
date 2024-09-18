import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-route';
import { UpdateUserComponent } from './update-user/update-user.component';



@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    CreateUserComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class UserModule { }
