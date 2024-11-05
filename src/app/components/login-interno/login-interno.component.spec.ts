import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInternoComponent } from './login-interno.component';

describe('LoginInternoComponent', () => {
  let component: LoginInternoComponent;
  let fixture: ComponentFixture<LoginInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginInternoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
