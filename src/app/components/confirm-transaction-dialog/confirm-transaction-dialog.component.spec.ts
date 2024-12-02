import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTransactionDialogComponent } from './confirm-transaction-dialog.component';

describe('ConfirmTransactionDialogComponent', () => {
  let component: ConfirmTransactionDialogComponent;
  let fixture: ComponentFixture<ConfirmTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmTransactionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
