import { Component, Input, OnInit } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResult } from 'src/app/types';
import { SyshubIppDevice } from 'syshub-rest-module';

@Component({
  selector: 'app-result-ippdevice',
  templateUrl: './ippdevice.component.html',
  styleUrl: './ippdevice.component.scss'
})
export class IppdeviceComponent implements OnInit {

  devices: SyshubIppDevice[] = [];
  devicesMatched: string[] = [];
  nodesToggled: string[] = [];
  @Input({ required: true }) searchResult!: SearchResult;

  constructor(private l10nService: L10nService,
    private searchService: SearchService,
    private propsService: PagepropsService,) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    if (this.searchResult!.result?.system?.ippDevices === undefined || this.searchResult!.result?.system?.ippDevices === null || this.searchResult!.result?.system?.ippDevices === false)
      return;
    this.devices = [...this.searchResult.result.system.ippDevices.content].sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
    this.devices.forEach((d) => {
      if (this.searchService.matchIppDevice(d, this.searchResult.search))
        this.devicesMatched.push(d.name);
    });
  }

  hoverNode(node: SyshubIppDevice, event: MouseEvent): void {
    this.propsService.inspect('IppDevices', node, 'show', {
      top: event.pageY - 74,
      left: event.pageX + 86,
    });
  }

  leaveNode(node: SyshubIppDevice): void {
    if (!this.nodesToggled.includes(node.name))
      this.propsService.inspect('IppDevices', node, 'remove');
  }

  selectNode(node: SyshubIppDevice): void {
    if (!this.nodesToggled.includes(node.name))
      this.nodesToggled.push(node.name);
    else
      this.nodesToggled.splice(this.nodesToggled.indexOf(node.name, 1));
  }

}