import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterView } from './roster-view';

describe('List', () => {
  let component: RosterView;
  let fixture: ComponentFixture<RosterView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RosterView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
