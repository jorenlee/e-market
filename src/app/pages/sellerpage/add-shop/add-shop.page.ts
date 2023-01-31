import { Component, ElementRef, OnInit, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import {StorageService} from 'src/app/services/storage/storage.service'
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Shop } from 'src/app/models/shop.model';
// import { format } from 'path';


@Component({
  selector: 'app-add-shop',
  templateUrl: './add-shop.page.html',
  styleUrls: ['./add-shop.page.scss'],
})
export class AddShopPage implements OnInit {

  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef;
  shopImage: any;
  isLoading: boolean = false;
  image: any;
  shop_name: any;
  // status: true;
  category: string;
  categories: any[] = [];
  shopCtg: boolean = false;
  shopcategory: any[] = [];
  constructor(
    private authService: AuthService, 
    public afStorage: AngularFireStorage,
    public apiService: ApiService,
    private global: GlobalService,
    private navCtrl: NavController,
    private router: Router,
    private storage:StorageService,
    private change:ChangeDetectorRef

  ) { }
email = "";
 ngOnInit() {
  this.storage.getStorage("profile").then((res:any)=>{
    let res1 = JSON.parse(res.value);
    this.email = res1.email;
    console.log(this.email);
  })
  }



  async onSubmit(form: NgForm) {
    if(!form.valid || !this.shopImage) return;
    try {
      this.isLoading = true;
      const url = await this.uploadImage(this.shopImage);
      console.log(url);      
      if(!url) {
        this.isLoading = false;
        this.global.errorToast('Image not uploaded, please try again');
        return;
      }
      const data = {
        cover: url,
        name: this.shop_name,

        ...form.value
      };
      data.email = this.email;
      console.log('Shop Data: ', data);      
      await this.apiService.addShop(data);
      // await this.apiService.addCategories(this.categories, data.id);
      this.isLoading = false;
      this.global.successToast('Shop Registered Successfully');
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }

  // onFileChosen(event) {
  //   const file = event.target.files[0];
  //   if(!file) return;
  //   console.log('shop File: ', file);
  //   this.shopImage = file;
  //   const reader = new FileReader();
  //   console.log(reader);
  //   reader.onload = () => {
  //     const dataUrl = reader.result.toString();
  //     this.image = dataUrl;
  //     console.log('Shop Image: ', this.image);
  //   };
  //   reader.readAsDataURL(file);
  // }

  onFileChosen(event) {
    const file = event.target.files[0];
    
    if(!file) return;
    console.log('file: ', file);
    this.shopImage = file;
    const reader = this.getFileReader();
   
    let ref = this;
    reader.onload = this._handleReaderLoaded.bind(this);
    
    reader.readAsBinaryString(file);
  }
  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || fileReader;
}
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
   
           this.image= "data:image/png;base64,"+btoa(binaryString);
           this.change.detectChanges();
           
          
   }

  uploadImage(shopImage) {
    return new Promise((resolve, reject) => {
      const mimeType = shopImage.type;
      if(mimeType.match(/image\/*/) == null) return;
      const file = shopImage;
      const filePath = 'Shops/' + Date.now() + '_' + file.name;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          const downloadUrl = fileRef.getDownloadURL();
          downloadUrl.subscribe(url => {
            console.log('url: ', url);
            if(url) {
              resolve(url);
            }
          })
        })
      ).subscribe(url => {
        console.log(url);
      });
    });
  }

  changeImage() {
    this.filePickerRef.nativeElement.click();
  }


  // Categories
  // addCategory() {
  //   console.log(this.category);
  //   if(this.category.trim() == '') return;
  //   console.log(this.shopCtg);
  //   const checkString = this.categories.find(x => x == this.category);
  //   if(checkString) {
  //     this.global.errorToast('Category already added');
  //     return;
  //   }
  //   this.categories.push(this.category);
  //   if(this.shopCtg) this.shopcategory.push(this.category);
  // }

  // clearCategory() {
  //   this.categories = [];
  //   this.shopcategory = [];
  // }

  // getArrayAsString(array) {
  //   return array.join(', ');
  // }

  

}