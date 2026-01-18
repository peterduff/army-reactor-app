import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Datafiles } from './datafiles';

describe('Datafiles', () => {
  let component: Datafiles;
  let fixture: ComponentFixture<Datafiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datafiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Datafiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
