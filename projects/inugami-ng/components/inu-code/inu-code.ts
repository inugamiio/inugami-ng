import {
  Component,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import {CacheServices} from "inugami-ng/services";
import {map, shareReplay, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SourceCode} from './code.model';
import {InuHighlightDirective} from './inu-code.directive';


@Component({
  selector: 'inu-code',
  standalone: true,
  imports: [InuHighlightDirective],
  templateUrl: './inu-code.html',
  styleUrl: './inu-code.scss',
})
export class InuCode {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  source = input<string | undefined | null>(undefined);
  url = input<string | undefined | null>(undefined);
  tag = input<string | undefined | null>(undefined);
  type = input<string | undefined | null>(undefined);
  title = input<string | undefined | null>(undefined);


  private readonly http = inject(HttpClient);
  private readonly cache = inject(CacheServices);

  sourceCode = signal<string>('');
  _title = signal<string>('');
  _type = signal<string>('');

  //==================================================================================================================
  // INITIALIZE
  //==================================================================================================================
  constructor() {
    effect(() => this.init());
  }

  init(): void {
    const url = this.url();
    if(this.title()){
      this._title.set(this.title()!);
    }

    if (url) {
      this.loadFormUrl(url);
    } else {
      const source = this.source();
      if (source) {
        this.sourceCode.set(source);
      }
    }
  }

  loadFormUrl(url: string) {

    const data = this.loadFormCache(url);
    if (data) {
      this.initSourceCode(data);
      return;
    }
    const cacheKey = `inu-code_${url}`;
    const pending = this.cache.getPending(cacheKey);
    if (pending) {
      pending.subscribe(res => this.initSourceCode(res));
      return;
    }

    const request = this.http.get(url, {responseType: 'text'})
      .pipe(map(res => this.parseData(res, url)),
        tap(data => this.cache.set(cacheKey, data)),
        shareReplay(1)
      );
    this.cache.setPending(cacheKey, request);
    request.subscribe();

  }


  initSourceCode(data: SourceCode[]) {

    const values = data.filter(i => this.tag() === i.name);
    if (values.length > 0) {
      const sourceCodeValue = values[0];
      this.sourceCode.set(sourceCodeValue.content!);

      const currentTitle = this.title();

      if(this.title()){
        this._title.set(this.title()!);
      }else if (sourceCodeValue.title) {
        this._title.set(sourceCodeValue.title);
      }

      if(this.type()){
        this._type.set(this.type()!);
      }else if (sourceCodeValue.type) {
        this._type.set(sourceCodeValue.type);
      }
    }
  }


  //==================================================================================================================
  // PARSE
  //==================================================================================================================
  parseData(response: string, url: string): SourceCode[] {
    const parser = new DOMParser();
    const node = parser.parseFromString(response, "text/xml");
    const sources = node.getElementsByTagName("src");

    const result: SourceCode[] = [];
    for (let i = 0; i < sources.length; i++) {
      let sourceNode = sources[i];
      let sourceName: string = sourceNode.getAttribute('name') ?? '';
      let sourceContent: string = this.cleanContent(sourceNode.textContent ?? '');
      let type: string | undefined = sourceNode.getAttribute('type') ?? undefined;
      let title: string | undefined = sourceNode.getAttribute('title') ?? undefined;

      result.push({
        name: sourceName,
        content: sourceContent,
        type: type,
        title: title
      })
    }

    this.initSourceCode(result);
    return result;
  }


  //==================================================================================================================
  // TOOLS
  //==================================================================================================================
  loadFormCache(url: string): SourceCode[] | undefined {
    const cacheKey = `inu-code_${url}`;
    const result: SourceCode[] | undefined = this.cache.get(cacheKey);
    return result;
  }

  setToCache(url: string, value: any): void {
    const cacheKey = `inu-code_${url}`;
    if (value) {
      this.cache.set(cacheKey, value);
    }
  }


  private cleanContent(value: string): string {
    let result: string[] = [];
    let buffer: string[] = [];

    let line = value.split("\n");

    let enableClean = false;
    for (let i = 0; i < line.length; i++) {
      if (enableClean || line[i].trim() != '') {
        buffer.push(line[i]);
        enableClean = true;
      }
    }
    enableClean = false;
    for (let i = buffer.length - 1; i >= 0; i--) {
      if (enableClean || buffer[i].trim() != '') {
        result.push(buffer[i]);
        enableClean = true;
      }
    }

    result.reverse();

    return result.join('\n');
  }
}
