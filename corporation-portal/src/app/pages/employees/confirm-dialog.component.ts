import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  @Input() message = '';

  constructor(public modal: NgbActiveModal) {}
}
