import { Directive, Input, TemplateRef, inject, OnInit, OnDestroy } from '@angular/core';
import {InuTemplateRegistryService} from './inu-template-name.service';


@Directive({
  selector: 'ng-template[name]',
  standalone: true
})
export class InugamiTemplateDirective implements OnInit, OnDestroy {
  @Input('name') name!: string;

  private templateRef:TemplateRef<any> = inject(TemplateRef);
  private registry:InuTemplateRegistryService = inject(InuTemplateRegistryService);

  ngOnInit(): void {
    console.log('InugamiTemplateDirective')
    if (this.name) {
      this.registry.register(this.name, this.templateRef);
    }
  }

  ngOnDestroy(): void {
    if (this.name) {
      this.registry.unregister(this.name);
    }
  }
}
