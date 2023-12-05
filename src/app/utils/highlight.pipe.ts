import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string | number | null, args: string): any {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    if (args === '')
      return value;
    value = ('' + value).replace('<', '&lt;').replace('>', '&gt;');
    args = args.replace('<', '(&lt;)').replace('>', '(&gt;)');
    const regex = new RegExp(args, 'gi');
    const match = ('' + value).match(regex);
    if (!match)
      return this.sanitizer.sanitize(SecurityContext.HTML, ('' + value));
    return this.sanitizer.sanitize(SecurityContext.HTML, ('' + value))!.replace(regex, `<span class='highlight'>${match[0]}</span>`);
  }

}
