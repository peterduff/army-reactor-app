import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoster } from './new-roster';

describe('NewList', () => {
  let component: NewRoster;
  let fixture: ComponentFixture<NewRoster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRoster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRoster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
