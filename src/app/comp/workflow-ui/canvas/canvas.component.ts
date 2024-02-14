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
  @ViewChild('workflowSvgContainer') svgContainer!: ElementRef;

  onErrorHandlerNodes: string[] = []; // key of elements after on error connector
  breakpoints: SvgConnectorBreakpoint[] = [];
  connectorTitles: SvgConnectorText[] = [];
  nodes: SvgElement[] = [];
  nodeUUids: { [key: string]: number } = {};
  nodesToggled: string[] = [];
  hoverpath?: number;
  ruler: number[] = [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800];

  svgGrid = { width: 10, height: 10, strokeColor: 'rgba(0, 0, 0, .1)' };
  svgCursor: Point = { x: 0, y: 0 };
  tooltipLocation: Point = { x: 0, y: 0 };
  tooltipLeft: boolean = false;
  pageSize = { width: 0, height: 0 };
  window: Window;

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private searchService: SearchService,
    @Inject(DOCUMENT) private document: Document,
    private propsService: PagepropsService,) {
    this.window = document.defaultView!;
    this.pageSize = { width: this.window.innerWidth, height: this.window.innerHeight - 64 };
  }

  private calculateCubicPath(path: SvgPathPoint[], pointFrom: Point, portFrom: string, pointTo: Point, elementTo: Element): void {
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

  private calculateCubicPathFromBottom(pointFrom: Point, pointTo: Point, elementTo: Element): Point[] {
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

  private calculateCubicPathFromLeft(pointFrom: Point, pointTo: Point, elementTo: Element): Point[] {
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

  private calculateCubicPathFromRight(pointFrom: Point, pointTo: Point, elementTo: Element): Point[] {
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

  private calculatePath(elementFrom: Element, portFrom: string, elementTo: Element, portTo: string): string {
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
    const svg: HTMLElement = this.svgContainer.nativeElement;
    const group = svg.querySelector('g.workflow-paths');
    if (group != null) {
      group.querySelectorAll('path').forEach((pathelement) => {
        const i = +pathelement.getAttribute('i')!;
        const path = this.graphModel.linkDataArray[i];
        const elementFrom = svg.querySelector(`g.element-group[id="${path.from}"] > image`);
        const elementTo = svg.querySelector(`g.element-group[id="${path.to}"] > image`);
        if (!elementFrom)
          console.warn('WorkflowGui.drawPaths(): elementFrom not found in svg DOM', path);
        else if (!elementTo)
          console.warn('WorkflowGui.drawPaths(): elementTo not found in svg DOM', path);
        else {
          let pathexpr = this.calculatePath(elementFrom, path.fromPort, elementTo, path.toPort);
          pathelement.setAttribute('d', pathexpr);
          if (path.category == 'error' || (path.description)) {
            let coords = this.getConnectorPosition(elementFrom, path.fromPort);
            this.connectorTitles.push({
              isErrorConnection: path.category == 'error',
              x: path.category == 'error' ? coords.x + 22 : path.fromPort == 'l' ? coords.x - 16 : coords.x + 16,
              y: path.fromPort == 'b' ? coords.y : coords.y - 3,
              text: path.category == 'error' ? this.l10nphrase.workflowUi.errorConnector : path.description!
            });
          }
          if (path.breakpoint === true) {
            let coords = this.getConnectorPosition(elementTo, path.toPort);
            this.breakpoints.push({ x: coords.x - 9, y: coords.y - 28 })
          }
        }
      });
    }
  }

  private getConnectorPosition(element: Element, port: string): Point {
    const bbox = (<SVGGraphicsElement>element).getBBox();
    let t = bbox.y - 3,
      l = bbox.x,
      r = bbox.x + bbox.width,
      b = bbox.y + bbox.height,
      vc = Math.round(bbox.y + (bbox.height / 2)),
      hc = Math.round(bbox.x + (bbox.width / 2));
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

  onMouseLeaveSvg(): void {
    this.svgCursor = { x: 0, y: 0 };
  }

  onMouseMoveOverSvg(event: MouseEvent): void {
    const x = event.clientX + (this.document.documentElement.scrollLeft);
    const y = event.clientY + (this.document.documentElement.scrollTop) - (this.document.documentElement.clientTop);
    this.svgCursor = { x: x, y: y - 132 };
  }

  resizeTimeout: any;
  @HostListener('window:resize', [])
  onWindowResized(): void {
    if (this.resizeTimeout)
      clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.pageSize = { width: this.window.innerWidth, height: this.window.innerHeight - 64 };
    }, 150);
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
    if (this.svgContainer == undefined) {
      console.warn('WorkflowGui.render(): SVG Container #workflowSvgContainer not found in DOM. Waiting 50ms.');
      setTimeout(() => {
        this.render();
      }, 50);
      return;
    }
    this.graphModel.linkDataArray.forEach((connector) => {
      if (connector.category != undefined && connector.category == 'error')
        this.onErrorHandlerNodes.push(connector.to);
    })
    this.graphModel.nodeDataArray.forEach((node) => {
      const element = SvgElement.createElement(node, this.onErrorHandlerNodes.includes(node.key), this.searchService, this.searchResult);
      this.nodeUUids[element.uuid] = this.nodes.length;
      this.nodes.push(element);
    });
    this.resizeBoundingBoxes();
  }

  private resizeTries: number = 0;
  private resizeBoundingBoxes(): void {
    if (this.svgContainer == undefined) {
      if (this.resizeTries < 10) {
        setTimeout(() => { this.resizeBoundingBoxes() }, 100);
        this.resizeTries++;
      }
      return;
    }
    const svg: HTMLElement = this.svgContainer.nativeElement;
    const groups = svg.querySelectorAll('g.element-group');
    if (groups.length != this.nodes.length) {
      if (this.resizeTries < 10) {
        setTimeout(() => { this.resizeBoundingBoxes() }, 100);
        this.resizeTries++;
      }
      return;
    }
    groups.forEach((group) => {
      const svggroup = <SVGGraphicsElement>group;
      group.querySelectorAll('rect.resize-to-parent').forEach((element) => {
        element.setAttribute('x', `${svggroup.getBBox().x - 4}`);
        element.setAttribute('y', `${svggroup.getBBox().y - 4}`);
        element.setAttribute('width', `${svggroup.getBBox().width + 8}`);
        element.setAttribute('height', `${svggroup.getBBox().height + 8}`);
      });
    });
    this.drawPaths();
  }

  hoverNode(node: SvgElement): void {
    if (node.modeldata.category != 'start' && node.modeldata.category != 'end' && node.modeldata.category != 'annotation') {
      this.propsService.inspect('SvgNode', node);
    }
  }

  leaveNode(node: SvgElement): void {
    if (this.nodesToggled.includes(node.modeldata.key))
      return;
    if (node.modeldata.category != 'start' && node.modeldata.category != 'end' && node.modeldata.category != 'annotation') {
      this.propsService.inspect('SvgNode', node, true);
    }
  }

  selectNode(node: SvgElement): void {
    if (node.modeldata.category != 'start' && node.modeldata.category != 'end' && node.modeldata.category != 'annotation') {
      if (!this.nodesToggled.includes(node.modeldata.key))
        this.nodesToggled.push(node.modeldata.key);
      this.propsService.inspect('SvgNode', node);
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
