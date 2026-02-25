import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitView } from './unit-view';

describe('UnitView', () => {
  let component: UnitView;
  let fixture: ComponentFixture<UnitView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
