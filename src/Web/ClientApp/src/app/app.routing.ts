import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { UnauthorizedComponent } from "./unauthorized/unauthorized.component";
import { UserDefaultRoute } from "./user-default-route";

const permission = {
  role: ["Administrator", "ReportUploader", "Support", "Lab", "Lab Admin"],
};

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      // {
      //     path: '',
      //     redirectTo: 'dashboard',
      //     pathMatch: 'full'
      // },
      {
        path: "",
        canActivate: [UserDefaultRoute],
        component: HomeComponent,
        // redirectTo: 'account', pathMatch: 'full'
      },
      //{
      //  path: "dashboard",
      //  loadChildren: () =>
      //    import("./modules/dashboard/dashboard.module").then(
      //      (m) => m.DashboardModule
      //    ),
      //},
      //{
      //  path: "settings",
      //  loadChildren: () =>
      //    import("./modules/settings/settings.module").then(
      //      (m) => m.SettingsModule
      //    ),
      //},
      {
        path: "user",
        loadChildren: () =>
          import("./user/user.module").then(
            (m) => m.UserModule
          ),
      },
    ],
  },
  { path: "unauthorized", component: UnauthorizedComponent },
  { path: "**", component: NotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "top",
    }),

  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
