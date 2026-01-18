import {Component, effect, input, signal, WritableSignal} from '@angular/core';
import {Extension} from '../../open-api.model';

@Component({
  selector: 'inu-open-api-extension',
  standalone: true,
  providers: [],
  imports: [],
  templateUrl: './inu-open-api-extension.html',
  styleUrl: './inu-open-api-extension.scss',
})
export class InuOpenApiExtension {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  data = input<any | undefined | null>(undefined);

  keys: WritableSignal<string[]> = signal([]);
  _type: WritableSignal<string|null> = signal(null);

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
    if(Array.isArray(this.data)){
      this._type.set('array');
      const keys = [];
      for(let i=0; i<this.data.length; i++){
        keys.push(`${i}`);
      }
      this.keys.set(keys);
    }
    else if(typeof this.data == 'object'){
      this._type.set('object');
      const keys = Object.keys(this.data);
      keys.sort();
      this.keys.set(keys);
    }else{
      this._type.set('primitive');
    }
  }
  //==================================================================================================================
  // GETTERS
  //==================================================================================================================
  getChild(key:string):Extension|undefined{
    const data = this.data();
    if(this._type()=='array'){
      const index:number= Number(key);
      if(Array.isArray(data) && data.length> index){
        return data[index];
      }else{
        return undefined;
      }

    }else{
      return data[key];
    }
  }
}
