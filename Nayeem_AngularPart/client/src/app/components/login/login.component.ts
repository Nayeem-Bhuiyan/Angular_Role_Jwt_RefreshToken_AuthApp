import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AbstractControl, FormBuilder, FormGroup,FormArray, FormControl, Validators } from '@angular/forms';
import Validation from '../../helper/Validation';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  frmData: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  submitted = false;

  constructor(
    private tokenService: TokenStorageService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.frmData = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(40)
          ]
        ]

      }

    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.frmData.controls;
  }

  login() {
    this.submitted = true;
    if (this.frmData.invalid) {
      return;
    }

    const {username,password}=this.frmData.value;

    this.authService.login(username,password).subscribe((response: any) => {
       
      //this.tokenService.setRoles(response.user.roles);
      console.log("user info"+response.user.userName);
      console.log("user info"+response.user.email);
     
      

      this.tokenService.saveToken(response.accessToken);
      this.tokenService.saveRefreshToken(response.refreshToken);
      this.tokenService.setRoles(response.roles);
      this.tokenService.saveUser(response.user);
      this.notificationService.showSuccess("User login successful", "Success");
      //this.router.navigate(["/admin"]);
      const roles = response.roles;
      const isAdmin = roles.find((role) => role === "Admin");
      console.log("isAdmin  :"+isAdmin);
      const isUser = roles.find((role) => role === "User");
      console.log("isUser  :"+isUser);
      if (isAdmin) {
        this.router.navigate(["/admin"]);
      } else if (isUser) {
        this.router.navigate(["/user"]);
      } else {
        this.router.navigate(["/home"]);
      }
    });

  }

  formReset(): void {
    this.submitted = false;
    this.frmData.reset();
  }


}
