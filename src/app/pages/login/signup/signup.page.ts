import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  isLoading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private global: GlobalService) { }

  ngOnInit() {
  }


  onSubmit(form: NgForm) {
    if(!form.valid) return;
    this.register(form);
  }

  register(form: NgForm) {
    this.isLoading = true;
    console.log(form.value);
    // Calling the auth.service to create the user
    this.authService.register(form.value).then((data: any) => {
      console.log(data);
      this.navigate(data.type);
      this.isLoading = false;
      form.reset();
    })
    .catch(e => {
      console.log(e);
      this.isLoading = false;
      let msg: string = 'Could not sign you up, please try again.';
      if(e.code == 'auth/email-already-in-use') {
        msg = e.message;
      }
      this.global.showAlert(msg);
    });
  }

  // if type = user > tabs page, else > admin page
  navigate(type?) {    
    let url = '/tabs';
    if(type == 'admin') url = "/admin";
    this.router.navigateByUrl(url);
  }

}