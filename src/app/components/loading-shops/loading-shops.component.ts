import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-shops',
  templateUrl: './loading-shops.component.html',
  styleUrls: ['./loading-shops.component.scss'],
})
export class LoadingShopsComponent implements OnInit {

  dummy = Array(10);
  constructor() { }

  ngOnInit() {}

}
