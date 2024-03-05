import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: any, args: any): any {
    if (!args || !value || value === '')
      return value;

    if (Array.isArray(value) || typeof value === 'object')
      value = JSON.stringify(value);

    // Match in a case insensitive maneer
    const re = new RegExp(args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const match = `${value}`.match(re);

    // If there's no match, just return the original value.
    if (!match)
      return value;

    const replacedValue = `${value}`.replace(re, "<mark>" + this.sanitizer.sanitize(SecurityContext.HTML, match[0]) + "</mark>");
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }

}
