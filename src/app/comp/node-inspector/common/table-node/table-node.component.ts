import { Component, Input } from '@angular/core';

@Component({
  selector: '[nodeinspector-common-table-node]',
  templateUrl: './table-node.component.html',
  styleUrl: './table-node.component.scss'
})
export class NodeInspectorCommonTableNodeComponent {

  @Input({ required: true }) title!: string;
  @Input() valueToCopy?: string | number;

}
