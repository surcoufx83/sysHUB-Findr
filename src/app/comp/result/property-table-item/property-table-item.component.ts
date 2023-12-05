import { Component, EventEmitter, Input, Output } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';

@Component({
  selector: 'app-property-table-item',
  templateUrl: './property-table-item.component.html',
  styleUrls: ['./property-table-item.component.scss']
})
export class PropertyTableItemComponent {

  @Input() i10nname!: string;
  @Input() name!: string;
  @Input() searchPhrase!: string;
  @Input() type: string = 'String';
  @Input() value!: string;
  @Input() copyable: boolean = true;
  @Output() appcopy: EventEmitter<string> = new EventEmitter<string>();

  constructor(private i10nService: L10nService) { }

  copyToClipboard(content: string): void {
    this.appcopy.emit(content);
  }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

}
