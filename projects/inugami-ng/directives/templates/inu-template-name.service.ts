import { Injectable, TemplateRef, signal } from '@angular/core';

@Injectable()
export class InuTemplateRegistryService {

  private templatesSig = signal<Map<string, TemplateRef<any>>>(new Map());

  register(name: string, ref: TemplateRef<any>): void {
    this.templatesSig.update(map => {
      const newMap = new Map(map);
      newMap.set(name, ref);
      return newMap;
    });
  }

  unregister(name: string): void {
    this.templatesSig.update(map => {
      const newMap = new Map(map);
      newMap.delete(name);
      return newMap;
    });
  }


  getTemplate(name: string) {
    return this.templatesSig().get(name);
  }
}
