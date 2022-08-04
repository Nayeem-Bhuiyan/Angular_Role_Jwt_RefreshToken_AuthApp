import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AbstractControl, FormBuilder, FormGroup,FormArray, FormControl, Validators } from '@angular/forms';
import Validation from '../../helper/Validation';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  frmData: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });


  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService:NotificationService
  ) { }

  ngOnInit(): void {

    this.frmData = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }

  submitted = false;
  get f(): { [key: string]: AbstractControl } {
    return this.frmData.controls;
  }

  register() {
    


    const {username,email,password}=this.frmData.value;

    this.authService.register(username,email,password).subscribe( {
      next: (response) => {
        this.notificationService.showSuccess("User register successful", "Success");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        this.notificationService.showError("Invalid username or password.", "Error");
      },
      complete: () => console.info('Registration complete')
    });
  }

  formReset(): void {
    this.submitted = false;
    this.frmData.reset();
  }

}
