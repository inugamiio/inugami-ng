import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InugamiNg } from './inugami-ng';

describe('InugamiNg', () => {
  let component: InugamiNg;
  let fixture: ComponentFixture<InugamiNg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InugamiNg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InugamiNg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
