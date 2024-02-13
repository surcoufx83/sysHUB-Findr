import { CacheService } from "src/app/svc/cache.service";
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
    annotationText: SvgTSpan[] = [];
    description: string = '';
    hasMatch: boolean = false;
    image: string = '';
    imageheight: number = 0;
    imagewidth: number = 0;
    isAnnotation: boolean = false;
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
        if (Object.getOwnPropertyNames(graphNode).includes('zOrder')) {
            this.z = (<GraphModelCElementObject | GraphModelDecisionObject | GraphModelProcessObject | GraphModelWorkflowObject>graphNode).zOrder;
        }
    }

    public static createElement(graphNode: GraphModelAnnotationObject | GraphModelCElementObject | GraphModelDecisionObject | GraphModelEndObject | GraphModelProcessObject | GraphModelStartObject | GraphModelWorkflowObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult): SvgElement {
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
                return new WorkflowElement(graphNode, onErrorConnected, searchService, searchResult);
        }
    }

}

export class AnnotationElement extends SvgElement {

    constructor(graphNode: GraphModelAnnotationObject, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        let blankline = 0, blankblock = 0, cr = false;
        graphNode.text?.split(/\r?\n/).forEach((line, i) => {
            cr = true;
            if (line.trim() == '')
                blankline++;
            else {
                line.split(/\t| {4}/).forEach((part, j) => {
                    if (part.trim() == '') {
                        if (j == 0)
                            blankline++;
                        else
                            blankblock++;
                    }
                    else {
                        this.annotationText.push({
                            text: part,
                            x: cr ? 3 : undefined,
                            dx: j == 0 ? undefined : 16 + (blankblock * 16),
                            dy: i == 0 ? 0 : (j == 0 ? 15 : 0) + (blankline * 15)
                        });
                        blankblock = 0;
                        blankline = 0;
                        cr = false;
                    }
                });
            }
        });
        let size = graphNode.size.split(' ');
        if (size.length != 2)
            console.error('WorkflowElement: Size can not be set, not exact two numbers: ' + graphNode.size, graphNode);
        else {
            this.width = +size[0];
            this.height = +size[1];
        }
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.isAnnotation = true;
        this.annotationBgColor = graphNode.color;
        this.annotationTextColor = graphNode.colorText;
        this.hasMatch = searchResult ? searchService.match([
            graphNode.text,
        ], searchResult.search) : false;
    }

}

export class CElement extends SvgElement {

    constructor(graphNode: GraphModelCElementObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.height = this.height === 0 ? (70 + (this.description.indexOf('+') == 0 ? 14 : 0)) : this.height;
        this.width = this.width === 0 ? 70 : this.width;
        this.image = `celement${onErrorConnected ? '-error' : (graphNode.agent ?? '') != '' ? '-agent' : ''}`;
        this.imageheight = 70;
        this.imagewidth = 70;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.title = graphNode.refName;
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
        this.width = this.width === 0 ? 56 : this.width;
        this.image = `decision-${graphNode.isGlobal ? 'global' : 'local'}${onErrorConnected ? '-error' : ''}`;
        this.imageheight = 56;
        this.imagewidth = 56;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
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
        this.height = this.height === 0 ? 48 : this.height;
        this.width = this.width === 0 ? 56 : this.width;
        this.title = graphNode.label === '' ? 'End' : graphNode.label;
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
        this.width = this.width === 0 ? 56 : this.width;
        this.image = `process-${graphNode.isGlobal ? 'global' : 'local'}${graphNode.isLoop ? '-loop' : ''}${onErrorConnected ? '-error' : ''}`;
        this.imageheight = 38;
        this.imagewidth = 56;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
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
        this.height = this.height === 0 ? 48 : this.height;
        this.width = this.width === 0 ? 56 : this.width;
        this.title = graphNode.label === '' ? 'Start' : graphNode.label;
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

    constructor(graphNode: GraphModelWorkflowObject, onErrorConnected: boolean, searchService: SearchService, searchResult?: SearchResult) {
        super(graphNode);
        this.height = this.height === 0 ? (70 + (this.description.indexOf('+') == 0 ? 20 : 0)) : this.height;
        this.width = this.width === 0 ? 56 : this.width;
        this.image = `callworkflow${graphNode.isLoop ? '-loop' : graphNode.agent && !onErrorConnected ? '-agent' : ''}${onErrorConnected ? '-error' : ''}`;
        this.imageheight = 56;
        this.imagewidth = 56;
        this.title = `${graphNode.refName}${graphNode.startPoint && graphNode.startPoint != 'Start' ? ':' + graphNode.startPoint : ''}${graphNode.agent ? '@' + graphNode.agent : ''}`;
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
    }

}

export interface SvgNode {
    height: number;
    width: number;
    x: number;
    y: number;
    annotationText: SvgTSpan[];
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