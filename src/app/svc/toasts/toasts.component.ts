import { Component } from '@angular/core';
import { ToastsService } from '../toasts.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent {

  toasts: Toast[] = [];

  constructor(
    private toastService: ToastsService,
  ) {
    this.toastService.toasts.subscribe((toast) => {
      // Prevent multiple toasts of the same content and configuration at the same time.
      const temptoast = JSON.stringify(toast);
      let match = false;
      this.toasts.forEach((t) => match = match || JSON.stringify(t) === temptoast);
      if (!match)
        this.toasts.push(toast);
    });
  }

  removeAt(i: number) {
    this.toasts.splice(i, 1);
  }

}

export type Toast = {
  autohide?: boolean,
  cssClasses?: string[] | { [key: string]: string } | string,
  delay?: number,
  isHtml?: boolean,
  message: string,
};