import { Component, ElementRef, OnInit, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Shop } from 'src/app/models/shop.model';
import { Category } from 'src/app/models/category.model';
import {StorageService} from 'src/app/services/storage/storage.service'

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef;
  isLoading: boolean = false;
  imageFile: any;
  status = true;
  image: any;
  shops: Shop[] = [];
  category: any;
  categories: Category[] = [];
  email = "";
  

  constructor(
    public global: GlobalService,
    public apiService: ApiService,
    private afStorage: AngularFireStorage,
    private api: ApiService,
    private storage:StorageService,
    private change:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.storage.getStorage("profile").then((res:any)=>{
      let res1 = JSON.parse(res.value);
      this.email = res1.email;
      this.getEMarket();
    })
    
  }
  
  getEMarket() {
    this.api
      .getEMarket()
      .then((data) => {
        console.log(data);
       // this.shops = data;
       this.shops = [];
        data.forEach(element => {
          console.log(element);
          if(element.email == this.email)
          {
            this.shops.push(element);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  

  async onSubmit(form: NgForm) {
    if(!form.valid || !this.image) return;
    try {
      this.isLoading = true;
      const url = await this.uploadImage(this.imageFile);
      console.log(url);      
      if(!url) {
        this.isLoading = false;
        this.global.errorToast('Image not uploaded, please try again');
        return;
      }
      const data = {
        cover: url,
        status: this.status,
        ...form.value
      };
      console.log('Product Data: ', data);      
      await this.apiService.addProduct(data);
      this.isLoading = false;
      this.global.successToast('Product Item Added Successfully');
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }
  
  changeImage() {
    this.filePickerRef.nativeElement.click();
  }

  onFileChosen(event) {
    const file = event.target.files[0];
    
    if(!file) return;
    console.log('file: ', file);
    this.imageFile = file;
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

  uploadImage(imageFile) {
    return new Promise((resolve, reject) => {
      const mimeType = imageFile.type;
      if(mimeType.match(/image\/*/) == null) return;
      const file = imageFile;
      const filePath = 'Products/' + Date.now() + '_' + file.name;
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

  async changeShop(event) {
    try {
      console.log(event);
      this.global.showLoader();
      // this.categories = await this.apiService.getRestaurantCategories(event.detail.value);
      // this.category = '';
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }

  }

  
}
