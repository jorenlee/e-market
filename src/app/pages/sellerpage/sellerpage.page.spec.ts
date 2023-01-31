import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SellerpagePage } from './sellerpage.page';

describe('SellerpagePage', () => {
  let component: SellerpagePage;
  let fixture: ComponentFixture<SellerpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
