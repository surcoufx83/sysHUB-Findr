import { SearchService } from "src/app/svc/search.service";
import { SearchResult } from "src/app/types";
import { GraphModelAnnotationObject, GraphModelCElementObject, GraphModelDecisionObject, GraphModelEndObject, GraphModelProcessObject, GraphModelStartObject, GraphModelWorkflowObject } from "syshub-rest-module";

export class SvgElement implements SvgNode {

    height: number = 0;
    width: number = 0;
    x: number = 0;
    y: number = 0;
    annotationBgColor: string = '';
    annotationTextColor: string = '';
    annotationText: string = '';
    description: string = '';
    hasHighlight: boolean = false;
    hasMatch: boolean = false;
    image: string = '';
    imageheight: number = 0;
    imagewidth: number = 0;
    isAnnotation: boolean = false;
    isDeprecated: boolean = false;
    modeldata!: GraphModelAnnotationObject | GraphModelCElementObject | GraphModelDecisionObject | GraphModelEndObject | GraphModelProcessObject | GraphModelStartObject | GraphModelWorkflowObject;
    title: string = '';
    uuid: string = '';
    z?: number = 0;

    constructor(graphNode: GraphModelAnnotationObject | GraphModelCElementObject | GraphModelDecisionObject | GraphModelEndObject | GraphModelProcessObject | GraphModelStartObject | GraphModelWorkflowObject) {
        let loc = graphNode.loc.split(' ');
        if (loc.length != 2)
            console.error('WorkflowElement: Location can not be set, not exact two numbers: ' + graphNode.loc, graphNode);
        else {
            this.x = +loc[0];
            this.y = +loc[1];
        }
        this.title = graphNode.label ?? '';
        if (Object.getOwnPropertyNames(graphNode).includes('name')) {
            this.title = (<GraphModelDecisionObject | GraphModelProcessObject>graphNode).name;
        }
        this.uuid = graphNode.key;
        this.modeldata = graphNode;
        if (Object.getOwnPropertyNames(graphNode).includes('zOrder'))
            this.z = (<GraphModelCElementObject | GraphModelDecisionObject | GraphModelProcessObject | GraphModelWorkflowObject>graphNode).zOrder + 1;
        else if (graphNode.category != 'annotation')
            this.z = 1;
    }

    public static createElement(graphNode: GraphModelAnnotationObject | GraphModelCElementObject | GraphModelDecisionObject | GraphModelEndObject | GraphModelProcessObject | GraphModelStartObject | GraphModelWorkflowObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult, highlightWorkflowRef?: string): SvgElement {
        switch (graphNode.category) {
            case 'annotation':
                return new AnnotationElement(graphNode, searchService, searchResult);
            case 'celement':
                return new CElement(graphNode, onErrorConnected, searchService, searchResult);
            case 'decision':
                return new DecisionElement(graphNode, onErrorConnected, searchService, searchResult);
            case 'end':
                return new EndElement(graphNode, searchService, searchResult);
            case 'process':
                return new ProcessElement(graphNode, onErrorConnected, searchService, searchResult);
            case 'start':
                return new StartElement(graphNode, searchService, searchResult);
            case 'workflow':
                return new WorkflowElement(graphNode, onErrorConnected, searchService, searchResult, highlightWorkflowRef);
        }
    }

}

export class AnnotationElement extends SvgElement {

    constructor(graphNode: GraphModelAnnotationObject, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.annotationText = graphNode.text ?? '';
        if (graphNode.size != undefined) {
            let size = graphNode.size.split(' ');
            if (size.length != 2)
                console.error('WorkflowElement: Size can not be set, not exact two numbers: ' + graphNode.size, graphNode);
            else {
                this.width = +size[0];
                this.height = +size[1];
            }
            this.x -= this.width / 2;
            this.y -= this.height / 2;
        }
        this.isAnnotation = true;
        if (graphNode.color != undefined && graphNode.colorText == undefined) {
            // sysHUB 2022 compatibility
            const match = graphNode.color.match(/RGB \{(.+)\}/)
            this.annotationBgColor = match ? `rgb(${match[1]})` : graphNode.color;
            this.annotationTextColor = 'rgb(0,0,0)';
        }
        else {
            this.annotationBgColor = graphNode.color;
            this.annotationTextColor = graphNode.colorText;
        }
        this.hasMatch = searchResult ? searchService.match([
            graphNode.text,
        ], searchResult.search) : false;
    }

}

export class CElement extends SvgElement {

    constructor(graphNode: GraphModelCElementObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.title = graphNode.refName;
        this.height = this.height === 0 ? (70 + (this.description.indexOf('+') == 0 ? 14 : 0)) : this.height;
        this.width = this.width === 0 ? 70 + Math.max(this.title.length, (this.description.indexOf('+') == 0 ? this.description.length : 0)) * 5.5 : this.width;
        this.image = `celement${onErrorConnected ? '-error' : (graphNode.agent ?? '') != '' ? '-agent' : ''}`;
        this.imageheight = 70;
        this.imagewidth = 70;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.hasMatch = searchResult ? searchService.match([
            this.title,
            this.description,
            graphNode.agent ?? '',
            graphNode.instanceName,
            graphNode.variable,
            graphNode.refName,
            graphNode.refShortDesc,
            (searchResult.search.filter.includeUuids ? graphNode.refUuid : ''),
            (searchResult.search.filter.includeUuids ? graphNode.startUuid : ''),
        ], searchResult.search) : false;
    }

}

export class DecisionElement extends SvgElement {

    constructor(graphNode: GraphModelDecisionObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.description = graphNode.description ?? '';
        this.height = this.height === 0 ? (70 + (this.description.indexOf('+') == 0 ? 14 : 0)) : this.height;
        this.width = this.width === 0 ? 56 + Math.max(this.title.length, (this.description.indexOf('+') == 0 ? this.description.length : 0)) * 5.5 : this.width;
        this.image = `decision-${graphNode.isGlobal ? 'global' : 'local'}${onErrorConnected ? '-error' : ''}`;
        this.imageheight = 56;
        this.imagewidth = 56;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.isDeprecated = graphNode._maturity === 'DEPRECATED';
        this.hasMatch = searchResult ? searchService.match([
            this.title,
            this.description,
            graphNode.command,
            graphNode.parameterSetPath,
            graphNode.parameters,
            (searchResult.search.filter.includeUuids ? graphNode.parameterSetUuid : ''),
            (searchResult.search.filter.includeUuids ? graphNode.uuid : ''),
        ], searchResult.search) : false;
    }

}

export class EndElement extends SvgElement {

    constructor(graphNode: GraphModelEndObject, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.title = graphNode.label === '' ? 'End' : graphNode.label;
        this.height = this.height === 0 ? 48 : this.height;
        this.width = this.width === 0 ? 56 + Math.max(this.title.length, (this.description.indexOf('+') == 0 ? this.description.length : 0)) * 5.5 : this.width;
        this.image = 'end';
        this.imageheight = 24;
        this.imagewidth = 56;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.hasMatch = searchResult ? searchService.match([
            this.title,
            this.description,
        ], searchResult.search) : false;
    }

}

export class ProcessElement extends SvgElement {

    constructor(graphNode: GraphModelProcessObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.description = graphNode.description ?? '';
        this.height = this.height === 0 ? (50 + (this.description.indexOf('+') == 0 ? 20 : 0)) : this.height;
        this.width = this.width === 0 ? 56 + Math.max(this.title.length, (this.description.indexOf('+') == 0 ? this.description.length : 0)) * 5.5 : this.width;
        this.image = `process-${graphNode.isGlobal ? 'global' : 'local'}${graphNode.isLoop ? '-loop' : ''}${onErrorConnected ? '-error' : ''}`;
        this.imageheight = 38;
        this.imagewidth = 56;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.isDeprecated = graphNode._maturity === 'DEPRECATED';
        this.hasMatch = searchResult ? searchService.match([
            this.title,
            this.description,
            graphNode.command,
            graphNode.parameterSetPath,
            graphNode.parameters,
            graphNode.loopName,
            (searchResult.search.filter.includeUuids ? graphNode.parameterSetUuid : ''),
            (searchResult.search.filter.includeUuids ? graphNode.uuid : ''),
        ], searchResult.search) : false;
    }

}

export class StartElement extends SvgElement {

    constructor(graphNode: GraphModelStartObject, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.title = graphNode.label === '' ? 'Start' : graphNode.label;
        this.height = this.height === 0 ? 48 : this.height;
        this.width = this.width === 0 ? 56 + Math.max(this.title.length, (this.description.indexOf('+') == 0 ? this.description.length : 0)) * 5.5 : this.width;
        this.image = 'start';
        this.imageheight = 24;
        this.imagewidth = 56;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.hasMatch = searchResult ? searchService.match([
            this.title,
            this.description,
            graphNode.roles ?? '',
        ], searchResult.search) : false;
    }

}

export class WorkflowElement extends SvgElement {

    constructor(graphNode: GraphModelWorkflowObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult, highlightWorkflowRef?: string) {
        super(graphNode);
        this.title = `${graphNode.refName}${graphNode.startPoint && graphNode.startPoint != 'Start' ? ':' + graphNode.startPoint : ''}${graphNode.agent ? '@' + graphNode.agent : ''}`;
        console.log(graphNode)
        this.height = this.height === 0 ? (70 + (this.description.indexOf('+') == 0 ? 20 : 0)) : this.height;
        this.width = this.width === 0 ? 56 + Math.max(this.title.length, (this.description.indexOf('+') == 0 ? this.description.length : 0)) * 5.5 : this.width;
        this.image = `callworkflow${graphNode.isLoop ? '-loop' : graphNode.agent && !onErrorConnected ? '-agent' : ''}${onErrorConnected ? '-error' : ''}`;
        this.imageheight = 56;
        this.imagewidth = 56;
        this.width += 8;
        this.height += 8;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.hasMatch = searchResult ? searchService.match([
            this.title,
            this.description,
            graphNode.agent ?? '',
            graphNode.refName,
            graphNode.refShortDesc,
            graphNode.loopName,
            (searchResult.search.filter.includeUuids ? graphNode.refUuid : ''),
        ], searchResult.search) : false;
        this.hasHighlight = highlightWorkflowRef != undefined && highlightWorkflowRef != '' && graphNode.refName == highlightWorkflowRef;
    }

}

export interface SvgNode {
    height: number;
    width: number;
    x: number;
    y: number;
    annotationText: string;
    description: string;
    hasMatch: boolean;
    image: string;
    imageheight: number;
    imagewidth: number;
    isAnnotation: boolean;
    modeldata: GraphModelAnnotationObject | GraphModelCElementObject | GraphModelDecisionObject | GraphModelEndObject | GraphModelProcessObject | GraphModelStartObject | GraphModelWorkflowObject;
    title: string;
    uuid: string;
}

export interface SvgTSpan {
    x?: number;
    dx?: number;
    dy: number | string;
    text: string;
}