import {Component, effect, input, signal, WritableSignal} from '@angular/core';
import {Example, OpenApiComponentSchema, OpenApiPathEndpointResponse} from '../../open-api.model';
import {InuIcon} from 'inugami-icons';
import {InuCode} from '../../../inu-code/inu-code';
import {InternalSourceCode} from '../../../inu-code/code.model';
import {InuOpenApiExtension} from '../inu-open-api-extension/inu-open-api-extension';

@Component({
  selector: 'inu-open-api-response',
  standalone: true,
  providers: [],
  imports: [
    InuIcon,
    InuCode,
    InuOpenApiExtension
  ],
  templateUrl: './inu-open-api-response.html',
  styleUrl: './inu-open-api-response.scss',
})
export class InuOpenApiResponse {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  data = input<OpenApiPathEndpointResponse | undefined | null>(undefined);
  schemas = input<OpenApiComponentSchema[] | undefined | null>(null);

  status: WritableSignal<number | null> = signal(null);
  examplesSources: WritableSignal<InternalSourceCode[]> = signal([]);
  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.init()
    });
  }

  private init() {
    if (!this.data()) {
      return;
    }
    const httpStatus = this.data()?.status!;
    try {
      this.status.set(Number(httpStatus));
    } catch (e){}

    this.initExampleSources();
  }
  private initExampleSources() {
    const result : InternalSourceCode[] = [];
    const examples =this.data()?.examples;
    if (examples) {
      for(let example  of examples){
        result.push({
          content: example.value!,
          type: 'json',
          title : example.name
        })
      }
    }

    this.examplesSources.set(result);
  }
  //==================================================================================================================
  // ACTION
  //==================================================================================================================
  toggleExample(index:number){
    const examples = this.data()?.examples;
    if(!examples || examples.length<=index){
      return ;
    }
    const example =examples[index];
    const display = example.display==undefined ? false :example.display;
    example.display = !display;
  }
  //==================================================================================================================
  // GETTERS
  //==================================================================================================================
  computeExampleClass(example: Example, isFirst: boolean, isOdd: boolean): string {
    const result = ['response-example'];

    if (isFirst) {
      result.push('first');
    }
    if (isOdd) {
      result.push('odd');
    }
    const status = this.status();
    if (status) {
      if (status < 400) {
        result.push('status-success');
      }
      if (status < 500) {
        result.push('status-warning');
      }
      else{
        result.push('status-error');
      }
    }

    return result.join(' ');
  }
  getExampleDisplayStatus(index:number){
    const examples = this.data()?.examples;
    if(!examples || examples.length<=index){
      return false;
    }
    const example =examples[index];
    return example.display==undefined ? false :example.display;
  }

  getExamplesSource(index:number):InternalSourceCode|undefined{
    if(!this.examplesSources() || this.examplesSources().length<=index){
      return undefined;
    }
    return this.examplesSources()[index];
  }


}
