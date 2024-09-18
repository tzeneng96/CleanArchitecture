import { NgModule, Type } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material.module";
import { FooterNavComponent } from "../footer-nav/footer-nav.component";
import { AlertDialogComponent } from "./services/dialogs/alert-dialog/alert-dialog.component";
import { ConfirmDialogComponent } from "./services/dialogs/confirm-dialog/confirm-dialog.component";
import { PromptDialogComponent } from "./services/dialogs/prompt-dialog/prompt-dialog.component";


const D2U_DIALOGS: Type<any>[] = [
  AlertDialogComponent,
  ConfirmDialogComponent,
  PromptDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,


  ],
  declarations: [
    FooterNavComponent,
    ...D2U_DIALOGS,
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FooterNavComponent,
  ],
  providers: [
    DatePipe,
  ],
})
export class SharedModule { }
