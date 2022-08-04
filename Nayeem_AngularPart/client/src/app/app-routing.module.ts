import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { AdminComponent } from "./components/admin/admin.component";
import { ForbiddenComponent } from "./components/error/forbidden/forbidden.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { UserComponent } from "./components/user/user.component";


const routes: Routes = [
  { path: "", component: HomeComponent,canActivate: [AuthGuard] },
  { path: "home", component: HomeComponent ,canActivate: [AuthGuard]},
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "user", component: UserComponent },
  { path: "admin", component: AdminComponent },
  { path: "forbidden", component: ForbiddenComponent },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
