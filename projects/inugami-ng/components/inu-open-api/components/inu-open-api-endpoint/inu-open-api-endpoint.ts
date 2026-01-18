import {Component, effect, input, signal, WritableSignal} from '@angular/core';
import {
  OpenApiComponentSchema,
  OpenApiPathEndpoint,
  OpenApiPathEndpointParameter,
  OpenApiPathEndpointResponse
} from '../../open-api.model';
import {InuOpenApiParameters} from '../inu-open-api-parameters/inu-open-api-parameters';
import {InuCode, InternalSourceCode} from 'inugami-ng/components/inu-code';
import {InuOpenApiResponse} from '../inu-open-api-response/inu-open-api-response';
import {InuIcon} from 'inugami-icons';

const SPACE = ' ';

@Component({
  selector: 'inu-open-api-endpoint',
  standalone: true,
  providers: [],
  imports: [InuOpenApiParameters, InuOpenApiResponse, InuCode, InuIcon],
  templateUrl: './inu-open-api-endpoint.html',
  styleUrl: './inu-open-api-endpoint.scss',
})
export class InuOpenApiEndpoint {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  data = input<OpenApiPathEndpoint | undefined | null>(undefined);
  schemas = input<OpenApiComponentSchema[] | undefined | null>(null);
  styleClass: WritableSignal<string> = signal('');
  display: WritableSignal<string> = signal('inu-open-api-endpoint-content-display hidden');

  parameters: WritableSignal<OpenApiPathEndpointParameter[] | null> = signal(null);
  headers: WritableSignal<OpenApiPathEndpointParameter[] | null> = signal(null);
  options: WritableSignal<OpenApiPathEndpointParameter[] | null> = signal(null);


  request: WritableSignal<InternalSourceCode | null> = signal(null);
  responseMain: WritableSignal<OpenApiPathEndpointResponse | null> = signal(null);
  response: WritableSignal<InternalSourceCode | null> = signal(null);

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.init()
    });
  }

  private init() {
    this.initStyle();
    this.initParameters();
    this.initRequest();
    this.initResponse();
  }

  private initStyle() {
    const styles = ['inu-open-api-endpoint'];
    if (this.data()) {
      styles.push(this.data()?.verb!);
    }

    this.styleClass.set(styles.join(SPACE));
  }

  private initParameters() {
    const dataParameters = this.data()?.parameters;
    if (!dataParameters) {
      return
    }
    const parameters: OpenApiPathEndpointParameter[] = [];
    const options: OpenApiPathEndpointParameter[] = [];
    const headers: OpenApiPathEndpointParameter[] = [];


    for (let param of dataParameters) {
      if ('path' == param.in) {
        parameters.push(param);
      } else if ('header' == param.in) {
        headers.push(param);
      } else {
        options.push(param);
      }
    }
    if (parameters.length > 0) {
      this.parameters.set(parameters);
    }
    if (headers.length > 0) {
      this.headers.set(headers);
    }
    if (options.length > 0) {
      this.options.set(options);
    }
  }

  initRequest() {
    const data = this.data();
    if (!data) {
      return;
    }
    const contentType = data.requestBody?.contentType ? data.requestBody.contentType : 'text'
    let content: string | undefined = undefined;
    let type: string = this.resolveType(contentType);
    let name: string | undefined = undefined;
    if (data.requestBody?.schema) {
      const schema = data.requestBody.schema;
      if (schema?.ref) {
        content = JSON.stringify(data.requestBody.schema?.ref, null, 4);
      }

      if (schema.name) {
        name = schema.array ? `${schema.name}[]` : schema.name;
      }

    }

    if (content) {
      this.request.set({
        content: content,
        title: name,
        type: type
      })
    }
  }

  initResponse() {
    const data = this.data();
    if (!data) {
      return;
    }
    const responses = data.responses ? data.responses : [];
    if (responses.length == 0) {
      return;
    }
    const successResponse = responses.filter((r) => this.convertToNumber(r.status) < 300);

    if (successResponse && successResponse.length > 0) {
      const mainResponse = successResponse[0];

      this.responseMain.set(mainResponse);
      const contentType = mainResponse.contentType ? mainResponse.contentType : 'text'
      let content: string | undefined = undefined;
      let type: string = this.resolveType(contentType);
      let name: string | undefined = undefined;
      if (mainResponse.schema) {
        const schema = mainResponse.schema;
        if (schema?.ref) {
          content = JSON.stringify(mainResponse.schema?.ref, null, 4);
        }

        if (schema.name) {
          name = schema.array ? `${schema.name}[]` : schema.name;
        }

      }

      if (content) {
        this.response.set({
          content: content,
          title: name,
          type: type
        })
      }
    }

  }

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  toggleDisplay() {
    if ('inu-open-api-endpoint-content-display hidden' == this.display()) {
      this.display.set('inu-open-api-endpoint-content-display show');
    } else {
      this.display.set('inu-open-api-endpoint-content-display hidden');
    }
  }

  private resolveType(contentType: string): string {
    if (contentType == 'text' || contentType == 'text/plain') {
      return 'text';
    }
    const parts = contentType.split('application/');
    return parts.length == 2 ? parts[1].toLowerCase() : 'text';

  }

  private convertToNumber(value?: string): number {
    if (!value) {
      return 0;
    }
    try {
      return Number(value);
    } catch (e) {
      return 0;
    }
  }

  getRowClass(index: number, first: boolean, odd: boolean, styleclass?: string): string {
    const result: string[] = [`flex-table-body-row index-${index}`];
    if (first) {
      result.push('first');
    }
    if (odd) {
      result.push('odd');
    }

    if (styleclass) {
      result.push(styleclass);
    }
    return result.join(SPACE);
  }

  computeStatusStyleClass(status?:string): string {
    const result = ['inu-endpoint-response-status'];

    const httpStatus = this.convertToNumber(status);
    if(httpStatus<400){
      result.push('success');
    }
    else if(httpStatus<500){
      result.push('warning');
    }
    else{
      result.push('error');
    }

    return result.join(SPACE)
  }
}
