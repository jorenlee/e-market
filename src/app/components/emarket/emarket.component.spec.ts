import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmarketComponent } from './emarket.component';

describe('EmarketComponent', () => {
  let component: EmarketComponent;
  let fixture: ComponentFixture<EmarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmarketComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
