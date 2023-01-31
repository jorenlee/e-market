import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ChangebuttonComponent } from 'src/app/components/changebutton/changebutton.component';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {

  form: FormGroup;
  isSubmitted = false;
  location: any = {};
  // center: any;
  update: boolean;
  id: any;
  isLoading: boolean = false;
  from: string;
  check: boolean = false;

  constructor(
    private addressService: AddressService,
    private global: GlobalService,
    private navCtrl: NavController,
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.checkForUpdate();
  }

  checkForUpdate() {
    this.isLoading = true;
    this.location.title = 'Address';
    // this.isLocationFetched = false;
    this.route.queryParams.subscribe(async(data) => {
      console.log('data: ', data);
      if(data?.data){
        const address = JSON.parse(data.data);
        this.update = true;
        this.location.address = address.address;
        this.location.location_name = address.title;
        this.id = address.id;
        await this.initForm(address);
      } else{
        this.update = false;
        this.initForm();
      }
    });
  }

  initForm(address?) {
    let data: any = {
      title: null,
      house: null,
      landmark: null
    };
    if(address) {
      data = {
        title: address.title,
        house: address.house,
        landmark: address.landmark
      };
    }
    this.formData(data);
    
  }
  

  formData(data?) {
    this.form = new FormGroup({
      title: new FormControl(data.title, {validators: [Validators.required]}),
      house: new FormControl(data.house, {validators: [Validators.required]}),
      landmark: new FormControl(data.landmark, {validators: [Validators.required]}),
    });
    this.isLoading = false;
  }

  fetchLocation(event) {
    this.location = event;
    console.log('location: ', this.location);
  }
  

  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }

  async onSubmit() {
    try {
      this.toggleSubmit();
      console.log(this.form);
      if(!this.form.valid) {
        this.toggleSubmit();
        return;
      }
      const data = {
        title: this.form.value.title,
        landmark: this.form.value.landmark,
        house: this.form.value.house,
        // address: this.location.address
      };
      console.log('address: ', data);
      if(!this.id) await this.addressService.addAddress(data);
      else await this.addressService.updateAddress(this.id, data);
      this.check = true;
      this.navCtrl.back();
      this.toggleSubmit();
    } catch(e) {
      console.log(e);
      this.isSubmitted = false;
      this.global.errorToast();
    }

  }


  async changeButton() {
    try {
      const options = {
        component: ChangebuttonComponent,
        cssClass: 'address-modal',
        swipeToClose: true,
      };
      const location = await this.global.createModal(options);
      console.log('location: ', location);
      if(location) {
        this.location = location;
      }
    } catch(e) {
      console.log(e);
    }
  }

   ionViewDidLeave() {
   console.log('ionViewDidLeave EditAddressPage');
   if(this.from == 'home' && !this.check) {
    this.addressService.changeAddress({});
   }
  }
}