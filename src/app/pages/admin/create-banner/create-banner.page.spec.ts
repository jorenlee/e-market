import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateBannerPage } from './create-banner.page';

describe('CreateBannerPage', () => {
  let component: CreateBannerPage;
  let fixture: ComponentFixture<CreateBannerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBannerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
