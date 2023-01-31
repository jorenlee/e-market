import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddShopPage } from './add-shop.page';

describe('AddShopPage', () => {
  let component: AddShopPage;
  let fixture: ComponentFixture<AddShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
