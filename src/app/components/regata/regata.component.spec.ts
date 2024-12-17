import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegataComponent } from './regata.component';

describe('RegataComponent', () => {
  let component: RegataComponent;
  let fixture: ComponentFixture<RegataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
