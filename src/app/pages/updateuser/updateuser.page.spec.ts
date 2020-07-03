import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateuserPage } from './updateuser.page';

describe('UpdateuserPage', () => {
  let component: UpdateuserPage;
  let fixture: ComponentFixture<UpdateuserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateuserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
