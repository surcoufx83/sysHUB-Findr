import { Component, Input } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SyshubConfigItem, SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-tree',
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent {

  @Input({ required: true }) tree: SyshubConfigItem[] | SyshubPSetItem[] = [];
  openNodes: number[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,) { }

  getIcon(node: SyshubConfigItem | SyshubPSetItem): string {
    return this.cacheService.getIcon(node.type, node.value);
  }

  toggleNode(i: number): void {
    if (this.openNodes.includes(i))
      this.openNodes.splice(this.openNodes.indexOf(i), 1);
    else
      this.openNodes.push(i);
  }

}
