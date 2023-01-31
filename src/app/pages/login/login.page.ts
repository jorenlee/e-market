import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Plugins } from '@capacitor/core';
import {StorageService} from "../../services/storage/storage.service";
import {ApiService} from "../../services/api/api.service";
const { PushNotifications , LocalNotifications } = Plugins;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  type: boolean = true;
  isLogin = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private global: GlobalService,
    private storageService:StorageService,
    private api:ApiService
    ) { }

  ngOnInit() {
  }


  showPassword() {
    this.type = !this.type;
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if(!form.valid) return;
    this.login(form);
  }

  login(form) {
    this.isLogin = true;
    this.authService.login(form.value.email, form.value.password).then(data => {
      console.log(data);
      this.navigate(data);
      this.isLogin = false;
      form.reset();
    })
    .catch(e => {
      console.log(e);
      this.isLogin = false;
      let msg: string = 'Could not sign you in, please try again.';
      if(e.code == 'auth/user-not-found') msg = 'E-mail address could not be found';
      else if(e.code == 'auth/wrong-password') msg = 'Please enter a correct password';
      this.global.showAlert(msg);
    });
  }

  navigate(data?) {    
    let url = '/tabs';
    if(data == 'admin') url = '/admin';
    this.router.navigateByUrl(url);
    this.insertToken();
  
  }

  insertToken()
  {
    PushNotifications.addListener("registration",(token)=>{

      this.storageService.getStorage("profile").then((res)=>{
        if(res.value)
        {
       let obj =  JSON.parse(res.value);
       this.api.insertTokens(obj.email,token.value);
      
        }
      })
            })
            PushNotifications.register();

            PushNotifications.addListener("pushNotificationReceived",(noti)=>{
              LocalNotifications.schedule({notifications:[{title:noti.title,body:noti.body,id:Date.now()}]}).then(()=>{
                
              })
            })
  }

}
