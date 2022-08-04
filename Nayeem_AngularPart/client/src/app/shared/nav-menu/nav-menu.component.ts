import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  public jwtHelper: JwtHelperService = new JwtHelperService();

  public isExpanded = false;

  constructor(private router: Router,private tokenStorageService:TokenStorageService,private notificationService:NotificationService) { }

  ngOnInit(): void {
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  isUserAuthenticated() {
    const token: string | null = this.tokenStorageService.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  public logOut = () => {
    this.tokenStorageService.signOut();
    this.notificationService.showSuccess("Logout Successfully done","success");
    this.router.navigate(["login"]);
  }

}
