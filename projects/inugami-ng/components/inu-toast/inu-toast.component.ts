import {Component, computed, inject, input, OnInit, signal, WritableSignal} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {NgTemplateOutlet} from '@angular/common';
import {InuToastServices} from './inu-toast.service';
import {ToastMessage} from './inu-toast.model';

@Component({
  selector: 'inu-toast',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [InuIcon, NgTemplateOutlet],
  templateUrl: './inu-toast.component.html',
  styleUrl: './inu-toast.component.scss',
})
export class InuToast {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  delay = input<number>(5000);
  service = inject(InuToastServices);

  messages = this.service.message;


}
