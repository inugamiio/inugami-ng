import {Component, inject, input} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {InuToastServices} from './inu-toast.service';
import {ToastMessage} from './inu-toast.model';
import {TTLWrapper} from 'inugami-ng/models';

@Component({
  selector: 'inu-toast',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [InuIcon],
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


  protected resolveMessageStyleclass(message?: ToastMessage): string {
    const result: string[] = ['inu-toast-message'];
    if (message?.level) {
      result.push(message.level);
    }
    return result.join(' ');
  }


  protected closeMessage(message: TTLWrapper<ToastMessage>) {
    this.service.removeMessage(message);
  }
}
