import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewList } from './new-list';

describe('NewList', () => {
  let component: NewList;
  let fixture: ComponentFixture<NewList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
