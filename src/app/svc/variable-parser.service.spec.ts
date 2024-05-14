import { TestBed } from '@angular/core/testing';

import { VariableParserService } from './variable-parser.service';

const simpleExpressions: { [key: string]: any[] } = {
  '{foo}': [{ text: 'foo', varName: 'foo', objProperty: {} }],
  '{bar}': [{ text: 'bar', varName: 'bar', objProperty: {} }],
  '{foo.bar}': [{ text: 'foo.bar', varName: 'foo', objProperty: { varName: 'bar', objProperty: {} } }],
  '{foo.bar.x1}': [{ text: 'foo.bar.x1', varName: 'foo', objProperty: { varName: 'bar', objProperty: { varName: 'x1', objProperty: {} } } }],
  '{currentjob}': [{ text: 'currentjob', varName: 'currentjob', objProperty: {} }],
  '{currentjob.Id}': [{ text: 'currentjob.Id', varName: 'currentjob', objProperty: { varName: 'Id', objProperty: {} } }],
  'The id of the current job is {currentjob.Id}': [{ text: 'currentjob.Id', varName: 'currentjob', objProperty: { varName: 'Id', objProperty: {} } }],
  'The id of the current job is {currentjob.Id} and the title is {currentjob.Title}': [{ text: 'currentjob.Id', varName: 'currentjob', objProperty: { varName: 'Id', objProperty: {} } }, { text: 'currentjob.Title', varName: 'currentjob', objProperty: { varName: 'Title', objProperty: {} } }],
}

const arrayExpressions: { [key: string]: any[] } = {
  '{foo[0]}': [{ text: 'foo[0]', varName: 'foo', arrayIndex: 0, objProperty: {} }],
  '{bar[1]}': [{ text: 'bar[1]', varName: 'bar', arrayIndex: 1, objProperty: {} }],
  '{foo[0].bar}': [{ text: 'foo[0].bar', varName: 'foo', arrayIndex: 0, objProperty: { varName: 'bar', objProperty: {} } }],
  '{foo.bar[0]}': [{ text: 'foo.bar[0]', varName: 'foo', objProperty: { varName: 'bar', arrayIndex: 0, objProperty: {} } }],
  '{foo[0].bar.x1}': [{ text: 'foo[0].bar.x1', varName: 'foo', arrayIndex: 0, objProperty: { varName: 'bar', objProperty: { varName: 'x1', objProperty: {} } } }],
  '{foo.bar[2].x1}': [{ text: 'foo.bar[2].x1', varName: 'foo', objProperty: { varName: 'bar', arrayIndex: 2, objProperty: { varName: 'x1', objProperty: {} } } }],
  '{foo.bar.x1[3]}': [{ text: 'foo.bar.x1[3]', varName: 'foo', objProperty: { varName: 'bar', objProperty: { varName: 'x1', arrayIndex: 3, objProperty: {} } } }],
  '{foo[1].bar[2].x1[3]}': [{ text: 'foo[1].bar[2].x1[3]', varName: 'foo', arrayIndex: 1, objProperty: { varName: 'bar', arrayIndex: 2, objProperty: { varName: 'x1', arrayIndex: 3, objProperty: {} } } }],
}

const complexExpression: { [key: string]: any[] } = {
  '{foo.{bar}}': [{ text: 'foo.{bar}', varName: 'foo', objProperty: { varName: '{bar}', refName: '{bar}', objProperty: {} } }],
  '{foo[0].{bar}}': [{ text: 'foo[0].{bar}', varName: 'foo', arrayIndex: 0, objProperty: { varName: '{bar}', refName: '{bar}', objProperty: {} } }],
  '{foo.{bar}_looparray}': [{ text: 'foo.{bar}_looparray', varName: 'foo', objProperty: { varName: '{bar}_looparray', refName: '{bar}', objProperty: {} } }],
  '{foo.{bar}_looparray.item1}': [{ text: 'foo.{bar}_looparray.item1', varName: 'foo', objProperty: { varName: '{bar}_looparray', refName: '{bar}', objProperty: { varName: 'item1', objProperty: {} } } }],
  '{foo.{bar}_looparray[0].item1}': [{ text: 'foo.{bar}_looparray[0].item1', varName: 'foo', objProperty: { varName: '{bar}_looparray', refName: '{bar}', arrayIndex: 0, objProperty: { varName: 'item1', objProperty: {} } } }],
  '{foo.{bar}_looparray[0].item1[1]}': [{ text: 'foo.{bar}_looparray[0].item1[1]', varName: 'foo', objProperty: { varName: '{bar}_looparray', refName: '{bar}', arrayIndex: 0, objProperty: { varName: 'item1', arrayIndex: 1, objProperty: {} } } }],
  '{foo.{bar.item1}_looparray}': [{ text: 'foo.{bar.item1}_looparray', varName: 'foo', objProperty: { varName: '{bar.item1}_looparray', refName: '{bar.item1}', objProperty: {} } }],
  '{foo.{bar.item1[0]}_looparray}': [{ text: 'foo.{bar.item1[0]}_looparray', varName: 'foo', objProperty: { varName: '{bar.item1[0]}_looparray', refName: '{bar.item1[0]}', objProperty: {} } }],
  '{foo.{bar.item1[0].item2}_looparray}': [{ text: 'foo.{bar.item1[0].item2}_looparray', varName: 'foo', objProperty: { varName: '{bar.item1[0].item2}_looparray', refName: '{bar.item1[0].item2}', objProperty: {} } }],
}

const modifiedExpression: { process: string, paramName: string, expression: string, expected: any[] }[] = [
  { process: '', paramName: '', expression: '{foo}', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: '', paramName: '', expression: 'foo', expected: [] },
  { process: '', paramName: 'dictname', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: '', paramName: 'loopname', expression: 'foo', expected: [{ text: 'foolooparray', varName: 'foolooparray', objProperty: {} }] },
  { process: '', paramName: 'mapname', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: '', paramName: 'outdict', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: '', paramName: 'valuebyname', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: 'bar', paramName: '', expression: 'foo', expected: [] },
  { process: 'bar', paramName: 'foo', expression: 'foo', expected: [] },
  { process: 'CreateStructure', paramName: 'StructName', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: 'JSONDecode', paramName: 'json', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: 'JSONEncode', paramName: 'obj', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
  { process: 'PushVarToDictionary', paramName: '', expression: 'foo', expected: [] },
  { process: 'PushVarToDictionary', paramName: 'loopname', expression: 'foo', expected: [{ text: 'foolooparray', varName: 'foolooparray', objProperty: {} }] },
  { process: 'PushVarToDictionary', paramName: 'name', expression: 'foo', expected: [{ text: 'foo', varName: 'foo', objProperty: {} }] },
]

describe('VariableParserService', () => {
  let service: VariableParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse simple expressions correct', () => {
    expect(service).toBeTruthy();
    Object.entries(simpleExpressions).forEach((item) => {
      const result = service.parse('', '', item[0], true);
      expect(result).withContext(item[0]).toEqual(item[1]);
    });
  });

  it('should modify and parse simple expressions correct', () => {
    expect(service).toBeTruthy();
    modifiedExpression.forEach((item) => {
      const result = service.parse(item.process, item.paramName, item.expression, true);
      expect(result).withContext(`${item.process}, ${item.paramName}, ${item.expression}`).toEqual(item.expected);
    });
  });

  it('should parse array expressions correct', () => {
    expect(service).toBeTruthy();
    Object.entries(arrayExpressions).forEach((item) => {
      const result = service.parse('', '', item[0], true);
      expect(result).withContext(item[0]).toEqual(item[1]);
    });
  });

  it('should use cache', () => {
    expect(service).toBeTruthy();
    expect(service.parse('', '', '{foo}', false)).withContext('1st run').toEqual(simpleExpressions['{foo}']);
    expect(service.parse('', '', '{foo}', false)).withContext('2nd run').toEqual(simpleExpressions['{foo}']);
    expect(service.parse('', '', '{foo}')).withContext('3rd run').toEqual(simpleExpressions['{foo}']);
  });

  it('should handle empty or invalid input correct', () => {
    expect(service).toBeTruthy();
    expect(service.parse('', '', '')).withContext('""').toEqual([]);
    expect(service.parse('', '', ' ')).withContext('" "').toEqual([]);
    expect(service.parse('', '', '{}')).withContext('"{}"').toEqual([]);
    expect(service.parse('', '', '{ }')).withContext('"{ }"').toEqual([]);
    expect(service.parse('', '', '{    }')).withContext('"{    }"').toEqual([]);
    expect(service.parse('', '', '{{ }')).withContext('"{{ }"').toEqual([]);
    expect(service.parse('', '', '{{foo}')).withContext('"{{foo}"').toEqual([]);
    expect(service.parse('', '', '{{foo}}}')).withContext('"{{foo}}}"').toEqual([]);
    expect(service.parse('', '', '{foo.bar}}')).withContext('"{foo.bar}}"').toEqual([]);
    expect(service.parse('', '', '{foo.{bar}{fail}}')).withContext('"{foo.{bar}{fail}}"').toEqual([{ text: 'foo.{bar}{fail}', varName: 'foo', objProperty: {} }]);
  });

  it('should parse complex expressions correct', () => {
    expect(service).toBeTruthy();
    Object.entries(complexExpression).forEach((item) => {
      const result = service.parse('', '', item[0], true);
      expect(result).withContext(item[0]).toEqual(item[1]);
      if (item[0].includes('{bar}'))
        expect(service.getResolvedVar('{bar}')).withContext(`${item[0]} --> {bar}`).toEqual([{ text: 'bar', varName: 'bar', objProperty: {} }]);
      else if (item[0].includes('{bar.item1}'))
        expect(service.getResolvedVar('{bar.item1}')).withContext(`${item[0]} --> {bar.item1}`).toEqual([{ text: 'bar.item1', varName: 'bar', objProperty: { varName: 'item1', objProperty: {} } }]);
      else if (item[0].includes('{bar.item1[0]}'))
        expect(service.getResolvedVar('{bar.item1[0]}')).withContext(`${item[0]} --> {bar.item1[0]}`).toEqual([{ text: 'bar.item1[0]', varName: 'bar', objProperty: { varName: 'item1', arrayIndex: 0, objProperty: {} } }]);
      else if (item[0].includes('{bar.item1[0].item2}'))
        expect(service.getResolvedVar('{bar.item1[0].item2}')).withContext(`${item[0]} --> {bar.item1[0].item2}`).toEqual([{ text: 'bar.item1[0].item2', varName: 'bar', objProperty: { varName: 'item1', arrayIndex: 0, objProperty: { varName: 'item2', objProperty: {} } } }]);
    });
  });
});
