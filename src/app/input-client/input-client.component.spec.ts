import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputClientComponent } from './input-client.component';

describe('InputClientComponent', () => {
  let component: InputClientComponent;
  let fixture: ComponentFixture<InputClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
