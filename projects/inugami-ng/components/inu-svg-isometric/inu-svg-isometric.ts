import {AfterViewInit, Component, effect} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';

@Component({
  selector: 'inu-svg-isometric',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [
  ],
  templateUrl: './inu-svg-isometric.html',
  styleUrl: './inu-svg-isometric.scss',
})
export class InuSvgIsometric implements AfterViewInit {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================


  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
    });
  }
  ngAfterViewInit(): void {

  }

}
