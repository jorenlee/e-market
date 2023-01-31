import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-changebutton',
  templateUrl: './changebutton.component.html',
  styleUrls: ['./changebutton.component.scss'],
})
export class ChangebuttonComponent implements OnInit {

  places: any[] = [];
  placeSub: Subscription;
  @Input() from;
  savedPlaces: Address[] = [];
  addressSub: Subscription;

  constructor(
    private global: GlobalService,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    if(this.from) {
      this.getSavedPlaces();
    }
  }

  async getSavedPlaces(){
    this.global.showLoader();
    this.addressSub = this.addressService.addresses.subscribe(addresses => {
      this.savedPlaces = addresses;
    });
    await this.addressService.getAddresses();
    this.global.hideLoader();
  }

  selectSavedPlace(place) {
    this.dismiss(place);
  }

  dismiss(val?) {
    this.global.modalDismiss(val);
  }

  ngOnDestroy() {
    if(this.placeSub) this.placeSub.unsubscribe();
    if(this.addressSub) this.addressSub.unsubscribe();
  }

}
