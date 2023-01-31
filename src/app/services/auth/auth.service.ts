import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storageService: StorageService,
    private fireAuth: AngularFireAuth,
    private apiService: ApiService
    ) { }


    async login(email: string, password: string): Promise<any> {
      try {
        const response = await this.fireAuth.signInWithEmailAndPassword(email, password);
        console.log(response);
        if(response.user) {
          this.setUserData(response.user.uid);
          const user: any = await this.getUserData(response.user.uid);
          this.storageService.setStorage("profile",JSON.stringify(user));
          return user.type;                
        }
      } catch(e) {
        throw(e);
      }
    }

  async getId(){
    return (await this.storageService.getStorage('uid')).value;
  }

  setUserData(uid){
    this.storageService.setStorage('uid', uid);
  }
  
  // optional parameter "type?"
  // creates a user from signup page
  async register(formValue, type?) {
    try {
      const registeredUser = await this.fireAuth.createUserWithEmailAndPassword(formValue.email, formValue.password);
      console.log('registered user: ', registeredUser);
      const data = new User(
        formValue.email,
        formValue.phone,
        formValue.name,
        formValue.password,
        registeredUser.user.uid,
        // if this type exist then it will simply past the type otherwise it will be user
        type ? type : 'user',
        'active'
      );
      // Getting the data users collection from api.service
      // Empty object 
      await this.apiService.collection('users').doc(registeredUser.user.uid).set(Object.assign({}, data));
      if(!type || type != 'admin') {
        await this.setUserData(registeredUser.user.uid);
      }
      const userData = {
        id: registeredUser.user.uid,
        type: type ? type : 'user'
      };
      return userData;
    } catch(e) {
      throw(e);
    }
  }
  
  async resetPassword(email: string){
    try{
      this.fireAuth.sendPasswordResetEmail(email);
    } catch(e) {
      throw(e);
    }
  }
  
  async logout(){
    try{
      await this.fireAuth.signOut();
      this.storageService.removeStorage("profile");
      return this.storageService.removeStorage('uid');
      
    } catch(e){
      throw(e);
    }
  }

  async updateEmail(oldEmail, newEmail, password) {
    try {
      const result = await this.fireAuth.signInWithEmailAndPassword(oldEmail, password);
      await result.user.updateEmail(newEmail);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }
  


  checkAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireAuth.onAuthStateChanged(user => {
        console.log('auth user: ', user);
        // If I am getting the data, it will pass the data in resolve
          // everytime when the then is called in the promise, whatever is being pass in resolve it will be passed
        resolve(user)
      });
    });
  }

  async checkUserAuth() {
    try {
      const user = await this.checkAuth();
      if(user) {
        this.setUserData(user.uid);
        const profile: any = await this.getUserData(user.uid);
        if(profile) return profile.type;
        return false;
      } else {
        return false;
      }
    } catch(e) {
      throw(e);
    }
  }

  async getUserData(id) {
    return (await (this.apiService.collection('users').doc(id).get().toPromise())).data();
  }
}

