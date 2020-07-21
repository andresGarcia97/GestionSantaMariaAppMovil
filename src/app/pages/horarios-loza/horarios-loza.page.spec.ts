import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HorariosLozaPage } from './horarios-loza.page';

describe('HorariosLozaPage', () => {
  let component: HorariosLozaPage;
  let fixture: ComponentFixture<HorariosLozaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorariosLozaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HorariosLozaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
