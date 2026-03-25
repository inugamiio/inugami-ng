import {Component, computed, inject, input, signal} from '@angular/core';
import {CacheServiceTracking} from 'inugami-ng/services'
import {InuStringUtils, UuidUtils} from 'inugami-ng/utils'

@Component({
  selector: 'inu-footer',
  standalone: true,
  imports: [],
  templateUrl: './inu-footer.html',
  styleUrl: './inu-footer.scss',
})
export class InuFooter {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  displayVersion = input<boolean>(true);
  private cacheServiceTracking = inject(CacheServiceTracking, {optional: true});

  tracking             = signal<CacheServiceTracking>(this.cacheServiceTracking ?? new CacheServiceTracking(
    {
      sessionUid : signal<string>(UuidUtils.buildUid()),
      env        : signal<string>('PRD'),
      application: signal<string>('inugami'),
      version    : signal<string>('0.0.0')
    }
  ));

  styleClass = computed<string>(()=> [
    'inu-footer',
    InuStringUtils.normalize(this.tracking().env()).toUpperCase(),
    InuStringUtils.normalize(this.tracking().application()).toUpperCase(),
  ].join(' '));
}
