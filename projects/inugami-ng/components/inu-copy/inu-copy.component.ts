import {Component, computed, inject, input} from '@angular/core';
import {InuButton} from 'inugami-ng/components/inu-button';
import {InuCopyServices} from './inu-copy.service';
import {InuToastServices} from '../inu-toast/inu-toast.service';

@Component({
  selector: 'inu-copy',
  standalone: true,
  imports: [InuButton],
  templateUrl: './inu-copy.component.html',
  styleUrl: './inu-copy.component.scss',
})
export class InuCopy {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  label = input<string | undefined | null>('');
  notificationLabel = input<string>('Value copied to clipboard');
  notificationMessage = input<string>('');
  icon = input<string>('copy');
  iconNotification = input<string>('approval');
  type = input<string>('success');
  link = input<boolean>(false);
  styleclass = input<string>('');
  content = input<string | undefined | null>(undefined);

  _styleClass = computed<string>(() => {
    return [
      'inu-copy',
      this.styleclass() ? this.styleclass() : ''
    ].join(' ');
  })


  copyService = inject(InuCopyServices);
  toastServices = inject(InuToastServices);


  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  protected copyContent() {
    const content = this.content();
    if(!content){
      return;
    }
    this.copyService.copy(content)
      .subscribe({
        next: ()=> this.notify()
      });
  }

  private notify() {
    this.toastServices.addMessage({
      title:this.notificationLabel(),
      message:this.notificationMessage(),
      icon:this.iconNotification(),
      level:"success"
    });
  }
}
