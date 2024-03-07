import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SyshubWorkflow, SyshubWorkflowModel } from 'syshub-rest-module';
import { SvgElement } from './element';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResult } from 'src/app/types';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PagepropsService } from 'src/app/svc/pageprops.service';

@Component({
  selector: 'app-workflow-ui-canvas',
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input({ required: true }) workflow!: SyshubWorkflow;
  @Input({ required: true }) graphModel!: SyshubWorkflowModel;
  @Input({ required: true }) searchResult?: SearchResult;
  @Input({ required: true }) highlightWorkflowRef!: string;
  @ViewChild('workflowContainer') workflowContainer!: ElementRef;

  containerHeight: number = 100;
  containerWidth: number = 100;
  onErrorHandlerNodes: string[] = []; // key of elements after on error connector
  breakpoints: SvgConnectorBreakpoint[] = [];
  connectorTitles: SvgConnectorText[] = [];
  nodes: SvgElement[] = [];
  nodeUUids: { [key: string]: number } = {};
  nodesToggled: string[] = [];
  hoverpath?: number;
  private resizeTries: number = 0;
  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private searchService: SearchService,
    @Inject(DOCUMENT) private document: Document,
    private propsService: PagepropsService,) { }

  private calculateCubicPath(path: SvgPathPoint[], pointFrom: Point, portFrom: string, pointTo: Point, elementTo: HTMLImageElement): void {
    let intersections: Point[] = [];
    switch (portFrom) {
      case 'b':
        intersections = this.calculateCubicPathFromBottom(pointFrom, pointTo, elementTo);
        break;
      case 'l':
        intersections = this.calculateCubicPathFromLeft(pointFrom, pointTo, elementTo);
        break;
      case 'r':
        intersections = this.calculateCubicPathFromRight(pointFrom, pointTo, elementTo);
        break;
    }
    intersections.forEach((point) => {
      switch (point.type!) {
        case 'intersection':
          this.calculateCubicPathIntersection(path, point);
          break;
        case 'end':
          path.push({ cmd: 'L', x: point.x, y: point.y });
      }
    });
  }

  private calculateCubicPathFromBottom(pointFrom: Point, pointTo: Point, elementTo: HTMLImageElement): Point[] {
    let distx = pointTo.x - pointFrom.x, disty = pointTo.y - pointFrom.y;
    let intersections: Point[] = [];
    if (disty >= 12) {
      if (distx > 0) {
        intersections.push({ type: 'intersection', portfrom: 'b', portto: 'r', x: pointFrom.x, y: pointFrom.y + disty / 2, angle: Math.min(6, distx / 2, disty / 2) });
        intersections.push({ type: 'intersection', portfrom: 'r', portto: 'b', x: pointTo.x, y: pointFrom.y + disty / 2, angle: Math.min(6, distx / 2, disty / 2) });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
      else if (distx <= 0) {
        intersections.push({ type: 'intersection', portfrom: 'b', portto: 'l', x: pointFrom.x, y: pointFrom.y + disty / 2, angle: Math.min(6, Math.abs(distx) / 2, disty / 2) });
        intersections.push({ type: 'intersection', portfrom: 'l', portto: 'b', x: pointTo.x, y: pointFrom.y + disty / 2, angle: Math.min(6, Math.abs(distx) / 2, disty / 2) });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
    } else {
      let tempy = pointFrom.y + 12;
      if (distx > 0) {
        intersections.push({ type: 'intersection', portfrom: 'b', portto: 'r', x: pointFrom.x, y: tempy, angle: 6 });
        intersections = intersections.concat(this.calculateCubicPathFromRight({ x: pointFrom.x, y: tempy }, pointTo, elementTo));
      } else {
        intersections.push({ type: 'intersection', portfrom: 'b', portto: 'l', x: pointFrom.x, y: tempy, angle: 6 });
        intersections = intersections.concat(this.calculateCubicPathFromLeft({ x: pointFrom.x, y: tempy }, pointTo, elementTo));
      }
    }
    return intersections;
  }

  private calculateCubicPathFromLeft(pointFrom: Point, pointTo: Point, elementTo: HTMLImageElement): Point[] {
    let distx = pointFrom.x - pointTo.x, disty = pointTo.y - pointFrom.y;
    let targetleft = this.getConnectorPosition(elementTo, 'l').x, targetright = this.getConnectorPosition(elementTo, 'r').x;
    let intersections: Point[] = [];
    if (disty >= 12) {
      if (distx > 0) {
        intersections.push({ type: 'intersection', portfrom: 'l', portto: 'b', x: pointTo.x, y: pointFrom.y, angle: Math.min(6, distx / 2, disty / 2) });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
      else if (distx <= 0) {
        intersections.push({ type: 'intersection', portfrom: 'l', portto: 'b', x: pointFrom.x - 12, y: pointFrom.y, angle: 6 });
        intersections.push({ type: 'intersection', portfrom: 'b', portto: 'r', x: pointFrom.x - 12, y: pointFrom.y + disty * .7, angle: Math.min(6, disty * .7) });
        intersections.push({ type: 'intersection', portfrom: 'r', portto: 'b', x: pointTo.x, y: pointFrom.y + disty * .7, angle: Math.min(6, disty * .7) });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
    } else {
      let tempx = pointFrom.x - distx / 2 > targetright + 11 ? pointFrom.x - distx / 2 : targetleft - 12;
      intersections.push({ type: 'intersection', portfrom: 'l', portto: 't', x: tempx, y: pointFrom.y, angle: 6 });
      if (tempx > pointTo.x) {
        intersections.push({ type: 'intersection', portfrom: 't', portto: 'l', x: tempx, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'intersection', portfrom: 'l', portto: 'b', x: pointTo.x, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
      else {
        intersections.push({ type: 'intersection', portfrom: 't', portto: 'r', x: tempx, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'intersection', portfrom: 'r', portto: 'b', x: pointTo.x, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
    }
    return intersections;
  }

  private calculateCubicPathFromRight(pointFrom: Point, pointTo: Point, elementTo: HTMLImageElement): Point[] {
    let distx = pointTo.x - pointFrom.x, disty = pointTo.y - pointFrom.y;
    let targetleft = this.getConnectorPosition(elementTo, 'l').x, targetright = this.getConnectorPosition(elementTo, 'r').x;
    let intersections: Point[] = [];
    if (disty >= 12) {
      if (distx > 0) {
        intersections.push({ type: 'intersection', portfrom: 'r', portto: 'b', x: pointTo.x, y: pointFrom.y, angle: Math.min(6, distx / 2, disty / 2) });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
      else if (distx <= 0) {
        intersections.push({ type: 'intersection', portfrom: 'r', portto: 'b', x: pointFrom.x + 12, y: pointFrom.y, angle: 6 });
        intersections.push({ type: 'intersection', portfrom: 'b', portto: 'l', x: pointFrom.x + 12, y: pointFrom.y + disty * .7, angle: Math.min(6, disty * .7) });
        intersections.push({ type: 'intersection', portfrom: 'l', portto: 'b', x: pointTo.x, y: pointFrom.y + disty * .7, angle: Math.min(6, disty * .7) });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
    } else {
      let tempx = pointFrom.x + distx / 2 < targetleft - 11 ? pointFrom.x + distx / 2 : targetright + 12;
      intersections.push({ type: 'intersection', portfrom: 'r', portto: 't', x: tempx, y: pointFrom.y, angle: 6 });
      if (tempx < pointTo.x) {
        intersections.push({ type: 'intersection', portfrom: 't', portto: 'r', x: tempx, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'intersection', portfrom: 'r', portto: 'b', x: pointTo.x, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
      else {
        intersections.push({ type: 'intersection', portfrom: 't', portto: 'l', x: tempx, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'intersection', portfrom: 'l', portto: 'b', x: pointTo.x, y: pointTo.y - 12, angle: 6 });
        intersections.push({ type: 'end', portfrom: 'b', x: pointTo.x, y: pointTo.y });
      }
    }
    return intersections;
  }

  private calculateCubicPathIntersection(path: SvgPathPoint[], definition: Point): void {
    switch (definition.portfrom!) {
      case 'b':
        path.push({ cmd: 'L', x: definition.x, y: definition.y - definition.angle! });
        path.push({ cmd: 'C', cs: { x: definition.x, y: definition.y }, x: definition.x + (definition.portto == 'r' ? definition.angle! : definition.angle! * -1), y: definition.y });
        break;
      case 'l':
        path.push({ cmd: 'L', x: definition.x + definition.angle!, y: definition.y });
        path.push({ cmd: 'C', cs: { x: definition.x, y: definition.y }, x: definition.x, y: definition.y + (definition.portto == 'b' ? definition.angle! : definition.angle! * -1) });
        break;
      case 'r':
        path.push({ cmd: 'L', x: definition.x - definition.angle!, y: definition.y });
        path.push({ cmd: 'C', cs: { x: definition.x, y: definition.y }, x: definition.x, y: definition.y + (definition.portto == 'b' ? definition.angle! : definition.angle! * -1) });
        break;
      case 't':
        path.push({ cmd: 'L', x: definition.x, y: definition.y + definition.angle! });
        path.push({ cmd: 'C', cs: { x: definition.x, y: definition.y }, x: definition.x + (definition.portto == 'r' ? definition.angle! : definition.angle! * -1), y: definition.y });
        break;
    }
  }

  private calculatePath(elementFrom: HTMLImageElement, portFrom: string, elementTo: HTMLImageElement, portTo: string): string {
    let coordsA = this.getConnectorPosition(elementFrom, portFrom);
    let coordsB = this.getConnectorPosition(elementTo, portTo);
    let distx = coordsB.x - coordsA.x, disty = coordsB.y - coordsA.y;
    if (distx == 0 && disty == 0) {
      console.warn('WorkflowGui.calculatePath(): from and to elements on the same coordinates', coordsA, coordsB);
      return `M ${coordsA.x},${coordsA.y}`;
    }
    if (distx > -2 && distx < 2 && disty > 0 && portFrom == 'b') {
      // almost straight below source element (diff x +/- 2 )
      coordsB.x = coordsA.x;
      return this.calculateStraightPath(coordsA, coordsB)
    }
    let path: SvgPathPoint[] = [{ cmd: 'M', x: coordsA.x, y: coordsA.y }];
    this.calculateCubicPath(path, coordsA, portFrom, coordsB, elementTo);
    return this.renderPath(path);
  }

  private calculateStraightPath(coordsA: Point, coordsB: Point): string {
    return `M ${coordsA.x},${coordsA.y} L ${coordsB.x},${coordsB.y}`;
  }

  private drawPaths(): void {
    if (this.workflowContainer == undefined) {
      if (this.resizeTries < 10) {
        setTimeout(() => { this.drawPaths() }, 100);
        this.resizeTries++;
      }
      return;
    }
    const svg: HTMLElement = this.workflowContainer.nativeElement;
    const groups = svg.querySelectorAll('div.element');
    if (groups.length != this.nodes.length) {
      if (this.resizeTries < 10) {
        setTimeout(() => { this.drawPaths() }, 100);
        this.resizeTries++;
      }
      return;
    }
    const group = svg.querySelector('svg.nodes-container');
    if (group != null) {
      console.warn(group.querySelectorAll('path'))
      this.graphModel.linkDataArray.forEach((path, i) => {
        let pathelement: SVGPathElement | null = group.querySelector(`path#path-${i}`);

        if (pathelement == null) {
          console.warn('WorkflowGui.drawPaths(): path element not found in DOM', path);
          return;
        }

        const elementFrom = svg.querySelector(`div.element[data-uuid="${path.from}"] img.node-image`);
        const elementTo = svg.querySelector(`div.element[data-uuid="${path.to}"] img.node-image`);

        if (!elementFrom) {
          console.warn('WorkflowGui.drawPaths(): elementFrom not found in svg DOM', path);
          return;
        }
        else if (!elementTo) {
          console.warn('WorkflowGui.drawPaths(): elementTo not found in svg DOM', path);
          return;
        }

        let pathexpr = this.calculatePath(<HTMLImageElement>elementFrom, path.fromPort, <HTMLImageElement>elementTo, path.toPort);

        pathelement.setAttribute('d', pathexpr);
        if (path.category == 'error' || (path.description)) {
          let coords = this.getConnectorPosition(<HTMLImageElement>elementFrom, path.fromPort);
          this.connectorTitles.push({
            isErrorConnection: path.category == 'error',
            x: path.category == 'error' ? coords.x + 22 : path.fromPort == 'l' ? coords.x - 16 : coords.x + 16,
            y: path.fromPort == 'b' ? coords.y : coords.y - 3,
            text: path.category == 'error' ? this.l10nphrase.workflowUi.errorConnector : path.description!
          });
        }
        if (path.breakpoint === true) {
          let coords = this.getConnectorPosition(<HTMLImageElement>elementTo, path.toPort);
          this.breakpoints.push({ x: coords.x - 9, y: coords.y - 28 })
        }
      });
    }
  }

  private getConnectorPosition(element: HTMLImageElement, port: string): Point {

    const parentStyle = window.getComputedStyle(element.parentElement!.parentElement!.parentElement!);
    const parentCenter = parseInt(parentStyle.left, 10) + parseInt(parentStyle.width, 10) / 2;
    const parentTop = parseInt(parentStyle.top, 10) + 7; // include border spacing

    const elementStyle = window.getComputedStyle(element);
    const imgWidth = parseInt(elementStyle.width, 10);
    const imgHeight = parseInt(elementStyle.height, 10);

    const l = parentCenter - imgWidth / 2,
      t = parentTop,
      r = parentCenter + imgWidth / 2,
      b = t + imgHeight,
      vc = t + (imgHeight / 2),
      hc = l + (imgWidth / 2);

    switch (port) {
      case 't':
        return { x: hc, y: t };
      case 'b':
        return { x: hc, y: b };
      case 'l':
        return { x: l, y: vc };
      case 'r':
        return { x: r, y: vc };
    }
    console.warn('WorkflowGui.drawPathsGetConnectorPosition(): invalid port requested', port);
    return { x: 0, y: 0 };

  }

  hasOwnProperty(obj: any, propname: string): boolean {
    return Object.getOwnPropertyNames(obj).includes(propname);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  matchPhrase(value: string | number | null): boolean {
    return this.searchResult ? this.searchService.match(value, this.searchResult.search) : false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.render();
    }, 1);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.propsService.NodesClosed.subscribe((node) => {
      if (node.type != 'SvgNode')
        return;
      let i = this.nodesToggled.indexOf((<SvgElement>node.node).modeldata.key);
      if (i > -1)
        this.nodesToggled.splice(i, 1);
    }))
  }

  private renderPath(path: SvgPathPoint[]): string {
    let elements: string[] = [];
    path.forEach((element) => {
      switch (element.cmd) {
        case 'l':
        case 'L':
        case 'm':
        case 'M':
          elements.push(`${element.cmd} ${element.x},${element.y}`);
          break;
        case 'c':
        case 'C':
          elements.push(`${element.cmd} ${element.cs!.x},${element.cs!.y},${element.cs!.x},${element.cs!.y},${element.x},${element.y}`);
          break;
      }
    });
    return elements.join(' ');
  }

  render(): void {
    if (this.workflowContainer == undefined) {
      console.warn('WorkflowGui.render(): SVG Container #workflowSvgContainer not found in DOM. Waiting 50ms.');
      setTimeout(() => {
        this.render();
      }, 50);
      return;
    }

    this.graphModel.linkDataArray.forEach((connector) => {
      if (connector.category != undefined && connector.category == 'error')
        this.onErrorHandlerNodes.push(connector.to);
    });

    this.graphModel.nodeDataArray.forEach((node) => {
      const element = SvgElement.createElement(node, this.onErrorHandlerNodes.includes(node.key), this.searchService, this.searchResult, this.highlightWorkflowRef);
      this.nodeUUids[element.uuid] = this.nodes.length;
      this.nodes.push(element);
      let right = element.x + element.width + 24;
      let bottom = element.y + element.height + 24;
      if (right > this.containerWidth)
        this.containerWidth = right;
      if (bottom > this.containerHeight)
        this.containerHeight = bottom;
    });

    this.drawPaths();

  }

  hoverNode(node: SvgElement, x: number, y: number, w: number): void {
    y += 56;
    const placement = x > ((this.document.defaultView?.innerWidth ?? 1080) / 1.66) ? 'left' : 'right';
    if (node.modeldata.category != 'start' && node.modeldata.category != 'end' && node.modeldata.category != 'annotation') {
      this.propsService.inspect('SvgNode', node, 'show', { left: (placement == 'right' ? x + w + 64 : undefined), right: (placement == 'left' ? ((this.document.defaultView?.innerWidth ?? 1080) - (x) + w) : undefined), top: y });
    }
  }

  leaveNode(node: SvgElement): void {
    if (this.nodesToggled.includes(node.modeldata.key))
      return;
    if (node.modeldata.category != 'start' && node.modeldata.category != 'end' && node.modeldata.category != 'annotation') {
      this.propsService.inspect('SvgNode', node, 'remove');
    }
  }

  selectNode(node: SvgElement): void {
    if (node.modeldata.category != 'start' && node.modeldata.category != 'end' && node.modeldata.category != 'annotation') {
      if (!this.nodesToggled.includes(node.modeldata.key))
        this.nodesToggled.push(node.modeldata.key);
      else
        this.nodesToggled.splice(this.nodesToggled.indexOf(node.modeldata.key, 1));
    }
  }

}

export interface Point {
  x: number;
  y: number;
  type?: string;
  portfrom?: string;
  portto?: string;
  angle?: number
}

export interface SvgPathPoint {
  cmd: string;
  x: number;
  y: number;
  cs?: Point;
}

export interface SvgConnectorBreakpoint {
  x: number;
  y: number;
}

export interface SvgConnectorText {
  isErrorConnection: boolean;
  text: string;
  x: number;
  y: number;
}
