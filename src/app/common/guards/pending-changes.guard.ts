import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({providedIn: 'root'})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(private dialog: MatDialog) {
  }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate()
      ? true
      : this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'You have unsaved changes. Are you sure you want to leave?'
        }
      }).afterClosed();
  }
}
