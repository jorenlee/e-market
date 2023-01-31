import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.page.html',
  styleUrls: ['./create-banner.page.scss'],
})
export class CreateBannerPage implements OnInit {

  bannerImage: any;

  constructor(
    public afStorage: AngularFireStorage,
    public apiService: ApiService,
    public global: GlobalService
  ) { }

  ngOnInit() {
  }
  
  preview(event) {
    console.log(event);
    const files = event.target.files;
    if(files.length == 0) return;
    const mimeType = files[0].type;
    if(mimeType.match(/image\/*/) == null) return;
    const file = files[0];
    // 'banners' is the filepath for the banners
    const filePath = 'banners/' + Date.now() + '_' + file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    task.snapshotChanges()
    .pipe(
      // finalize executes when the observable completes
      finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url => {
          console.log('url: ', url);
          if(url) {
            this.bannerImage = url;
          }
        })
      })
    )
    .subscribe(url => {
      console.log('data: ', url);
    });
  }

  async saveBanner() {

    try {
      // checking if image exist
      if(this.bannerImage == '' || !this.bannerImage) return;
      this.global.showLoader();
      const data = {
        banner: this.bannerImage,
        status: 'active'
      };
      await this.apiService.addBanner(data);
      this.global.hideLoader();
      this.global.successToast('Banner Created!');
    } catch(e) {
      this.global.errorToast();
    }
  }

}