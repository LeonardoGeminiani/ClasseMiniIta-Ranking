import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRegataComponent } from './edit-regata.component';

describe('EditRegataComponent', () => {
  let component: EditRegataComponent;
  let fixture: ComponentFixture<EditRegataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRegataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRegataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
