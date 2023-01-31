import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserShopboardPage } from './user-shopboard.page';

describe('UserShopboardPage', () => {
  let component: UserShopboardPage;
  let fixture: ComponentFixture<UserShopboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserShopboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserShopboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
