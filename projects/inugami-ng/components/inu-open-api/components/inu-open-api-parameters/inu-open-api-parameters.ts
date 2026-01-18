import {Component, input} from '@angular/core';
import {OpenApiPathEndpointParameter} from '../../open-api.model';
import {InuCode} from 'inugami-ng/components/inu-code';

const SPACE : string = ' ';

@Component({
  selector: 'inu-open-api-parameters',
  standalone: true,
  providers: [],
  imports: [InuCode],
  templateUrl: './inu-open-api-parameters.html',
  styleUrl: './inu-open-api-parameters.scss',
})
export class InuOpenApiParameters{

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  data = input<OpenApiPathEndpointParameter[] | undefined | null>(undefined);
  parameterExamples :any = {}

  //==================================================================================================================
  // ACTION
  //==================================================================================================================
  toggleExample(index:number){
    const value = this.parameterExamples[index];
    if(value == undefined){
      this.parameterExamples[index] = true;
    }else{
      this.parameterExamples[index] = !value;
    }
  }


  //==================================================================================================================
  // GETTERS
  //==================================================================================================================
  getRowClass(index:number, first:boolean, odd:boolean, styleclass?:string):string{
    const result :string[]= [`index-${index}`];
    if(first){
      result.push('first');
    }
    if(odd){
      result.push('odd');
    }

    if(styleclass){
      result.push(styleclass);
    }
    return result.join(SPACE);
  }
  getParameterClass(index:number, styleclass:string):string{
    const result: string[]= [styleclass];
    const toggle = this.parameterExamples[index];
    if(toggle){
      result.push('display')
    }

    return result.join(' ');

  }
}
