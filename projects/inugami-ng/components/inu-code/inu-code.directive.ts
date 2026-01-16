import { Directive, ElementRef, inject, input, effect } from '@angular/core';
import hljs from 'highlight.js';

@Directive({
  selector: 'code[inuHighlight], pre[inuHighlight]',
  standalone: true
})
export class InuHighlightDirective {
  private el = inject(ElementRef);

  // On utilise des signaux pour la réactivité
  code = input<string>('', { alias: 'inuHighlight' });
  lang = input<string | undefined | null>(undefined);

  constructor() {
    effect(() => {
      console.log('aaaaaaa')
      const codeValue = this.code() || '';
      const language = this.lang() || '';
      const nativeElement = this.el.nativeElement;

      // Reset du contenu et application de la coloration
      nativeElement.textContent = codeValue;
      if (language) {
        nativeElement.className = `language-${language}`;
      }

      hljs.highlightElement(nativeElement);
    });
  }
}
