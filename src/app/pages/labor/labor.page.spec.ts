import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LaborPage } from './labor.page';

describe('LaborPage', () => {
  let component: LaborPage;
  let fixture: ComponentFixture<LaborPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaborPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LaborPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
