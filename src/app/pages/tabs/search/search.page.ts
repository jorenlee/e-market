import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { Shop } from 'src/app/models/shop.model';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title: 'No Search Found'
  };
  isLoading: boolean;
  query: any;
 

  shops: Shop[] = [];
  startAt = new Subject();
  endAt = new Subject();

  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();
  querySub: Subscription;

  constructor(
    private api: ApiService,
    public global: GlobalService
    ) { }

  ngOnInit() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
    this.querySub = combineLatest(this.startObs, this.endObs).subscribe(async(val) => {
      console.log(val);
      await this.queryResults(val[0], val[1]);
    });
  }

  queryResults(start, end) {
    this.isLoading = true;
    this.api.collection('Shops', ref => ref.orderBy('shop_name').startAt(start).endAt(end))
      .valueChanges()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.shops = data;
        this.isLoading = false;
      }, e => {
        this.isLoading = false;
        console.log(e);
        this.global.errorToast();
      });
  }

  // async onSearchChange(event) {
  //   console.log(event.detail.value);
  //   this.query = event.detail.value.toLowerCase();
  //   this.shop = [];
  //   if(this.query.length > 0) {
  //     this.isLoading = true;
  //     setTimeout(async() => {
  //       this.shop = await this.allRestaurants.filter((element: any) => {
  //         return element.short_name.includes(this.query);
  //       });
  //       console.log(this.shop);
  //       this.isLoading = false;
  //     }, 3000);
  //   }
  // }

  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value;
    this.querySearch();
  }

  querySearch() {
    this.shops = [];
    if(this.query.length > 0) {
      this.startAt.next(this.query);
      // it is a PUA code, used to match query that start with querytext
      this.endAt.next(this.query + '\uf8ff');
    }
  }

  ngOnDestroy() {
    // unsubscribing the subscription
    if(this.querySub) this.querySub.unsubscribe();
  }

}
