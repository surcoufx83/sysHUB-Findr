import { Injectable } from '@angular/core';
import { VariableExpression, VariableExpressionLocation, VariableProperty } from '../types';

@Injectable({
  providedIn: 'root'
})
export class VariableParserService {

  private expressions: { [key: string]: VariableExpression[] } = {};

  private variableResolveModifier: { [key: string]: 'add-brackets' | 'add-looparray+brackets' } = {
    '*|mapname': 'add-brackets',
    '*|outdict': 'add-brackets',
    '*|valuebyname': 'add-brackets',
    '*|loopname': 'add-looparray+brackets',
    'PushVarToDictionary|name': 'add-brackets',
  };

  private variablePattern = new RegExp(/^(?<varexpr>[^\.\{\}]*(?:(?<varchild>\{[^\{\}]*(?:\{[^\{\}]*[^\{\}]*\})?\}))?[^\.\{\}]*(?:\[(\d+)\])?)(?:\.|$)/);
  private arrayIndexPattern = new RegExp(/^(?<varname>.*)\[(?<i>\d+)\]$/);

  constructor() {
  }

  /**
   * This method manipulates the input string based on the process and the parameters whose content is to be evaluated.
   * For example, the parameter `valuebyname` simply means that a value from a dictionary variable is used. To look up 
   * variables in Findr, we need to take this into account, and we do this by simply putting curly braces around them so 
   * that they look like a normal variable.
   * @param process The process name where the input string is used.
   * @param paramName The parameter name of the process.
   * @param input The parameter content to modify.
   * @returns A modified character string if a rule is applicable.
   */
  private applyModifier(process: string, paramName: string, input: string): string {
    let modifier: 'add-brackets' | 'add-looparray+brackets' | undefined;
    if (this.variableResolveModifier[`${process}|${paramName}`])
      modifier = this.variableResolveModifier[`${process}|${paramName}`];
    else if (this.variableResolveModifier[`*|${paramName}`])
      modifier = this.variableResolveModifier[`*|${paramName}`];
    if (modifier === 'add-brackets')
      return `{${input}}`;
    if (modifier === 'add-looparray+brackets')
      return `{${input}looparray}`;
    return input;
  }

  /**
   * Returns the parser result for any variable. This should be used for referenced variables in the result of the "parse()" method.
   * @param varname The variable name including curly brackets.
   * @returns The parser result (if exists) or undefined.
   */
  public getResolvedVar(varname: string): VariableExpression[] | undefined {
    return this.expressions[varname];
  }

  /**
   * This method parses an input string and searches for sysHUB variables like `{currentjob}` or `{jobdir}`. It supports
   * Array-syntax (like `{looparray[0]}`) or object-notation (like `{currentjob.Id}`). An input string may also contain multiple
   * variables.
   * @param process The process name where the input string is used.
   * @param paramName The parameter name of the process.
   * @param input The parameter content to modify.
   * @param ignoreCache If cache must be ignored set this to true.
   * @returns An array containing all variables.
   */
  public parse(process: string, paramName: string, input: string, ignoreCache: boolean = false): VariableExpression[] {
    if (!ignoreCache && this.expressions[input])
      return this.expressions[input];
    let modInput = this.applyModifier(process, paramName, input);
    let output: VariableExpression[] = this.searchMatchingBrakets(modInput);
    this.expressions[input] = output;
    return output;
  }

  /**
   * This method analyzes the content of the curly brackets to find the object name, the array index and the part after a dot character.
   * @param output Reference to a `VariableExpression[]` variable.
   * @param vargroup The definition where the brackets have been found in the input string and what the text content is.
   * @returns Noting. The output param is manipulated.
   */
  private parseBracketsContent(output: VariableExpression[], vargroup: VariableExpressionLocation): void {
    const innerContent = vargroup.content.substring(1, vargroup.content.length - 1).trim();
    if (innerContent == '')
      return;
    let editableContent = innerContent;
    let match = editableContent.match(this.variablePattern);
    let level = 0;
    let variableExpr: VariableExpression = {
      text: innerContent,
      varName: '',
    };
    let refparent: VariableProperty | VariableExpression = variableExpr;
    while (match != null) {
      refparent.varName = match.groups!['varexpr'];

      if (match.groups!['varchild']) {
        refparent.refName = match.groups!['varchild'];
        this.parse('', '', match.groups!['varchild']);
      }

      const arraymatch = refparent.varName.match(this.arrayIndexPattern);

      if (arraymatch && arraymatch.groups && arraymatch.groups['varname'] && arraymatch.groups['i']) {
        refparent.varName = arraymatch.groups['varname'];
        refparent.arrayIndex = +arraymatch.groups['i'];
      }

      refparent.objProperty = {};

      refparent = refparent.objProperty;

      editableContent = editableContent.substring(match.groups!['varexpr'].length + 1)
      match = editableContent.match(this.variablePattern);
      level++;
      if (level == 20 || editableContent == '')
        break;
    }
    output.push(variableExpr);
  }

  /**
   * This method is looking for curly-bracket pairs. After the lookup, the content of curly-bracket
   * pairs is evaluated using the `parseBracketsContent()` method.
   * @param input The string to search in.
   * @returns An array of type `VariableExpression[]` that contains the variable definition.
   */
  private searchMatchingBrakets(input: string): VariableExpression[] {
    let output: VariableExpression[] = [];
    let bracketgroups: { [key: number]: VariableExpressionLocation } = {};
    let level: number = 0;
    let lastopen: number[] = [];
    let countOpenBrackets: number = 0;
    let countCloseBrackets: number = 0;
    for (let i = 0; i < input.length; i++) {
      let char = input[i];
      switch (char) {
        case '{':
          countOpenBrackets++;
          bracketgroups[i] = { startAt: i, endAt: -1, level: level, parent: level == 0 || lastopen.length == 0 ? undefined : lastopen[lastopen.length - 1], content: '', childs: [] };
          if (level > 0)
            bracketgroups[lastopen[lastopen.length - 1]].childs.push(bracketgroups[i]);
          lastopen.push(i);
          level++;
          break;
        case '}':
          countCloseBrackets++;
          if (lastopen.length > 0) {
            let item = lastopen.splice(lastopen.length - 1, 1);
            if (bracketgroups[item[0]]) {
              bracketgroups[item[0]].endAt = i + 1;
              bracketgroups[item[0]].content = input.substring(bracketgroups[item[0]].startAt, bracketgroups[item[0]].endAt);
            }
            level--;
          }
          break;
        default: break;
      }
    }
    if (countOpenBrackets != countCloseBrackets) {
      return [];
    }
    Object.values(bracketgroups).forEach((vargroup) => {
      if (vargroup.endAt > -1 && vargroup.level === 0)
        this.parseBracketsContent(output, vargroup);
    });
    return output;
  }

}
