import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDatafiles } from './add-datafiles';

describe('Datafiles', () => {
  let component: AddDatafiles;
  let fixture: ComponentFixture<AddDatafiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDatafiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDatafiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
