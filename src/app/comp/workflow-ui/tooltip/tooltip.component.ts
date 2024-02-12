import { Point } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SvgElement } from '../canvas/element';
import { SyshubPSetItem } from 'syshub-rest-module';
import { SearchResult } from 'src/app/types';

@Component({
  selector: 'app-workflow-ui-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  @Input() node?: SvgElement;
  @Input() searchResult?: SearchResult;
  @Input() tooltipLocation: Point = { x: 0, y: 0 };
  @Input() tooltipLeft: boolean = false;
  @Input() tooltipPinned: boolean = false;
  @Output() onUnpinTooltip: EventEmitter<void> = new EventEmitter<void>();

  constructor(private l10nService: L10nService,
    private cacheService: CacheService) { }

  getParametersetItem(uuid: string): SyshubPSetItem | null {
    // return this.cacheService.getParametersetItem(uuid);
    return null;
  }

  l10n(phrase: string, params: string[] = [], locale?: string) {
    //return this.l10nService.l10n(phrase, params, locale);
    return ''
  }

  onPinClicked(): void {
    this.onUnpinTooltip.emit();
  }


}
