import {Component, computed, input} from '@angular/core';
import {InuIcon} from 'inugami-icons';

@Component({
  selector: 'inu-button',
  standalone: true,
  imports: [InuIcon],
  templateUrl: './inu-button.component.html',
  styleUrl: './inu-button.component.scss',
})
export class InuButton {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  label = input<string | undefined | null>('');
  icon = input<string | null>(null);
  type = input<string>('');
  link = input<boolean>(false);
  disabled = input<boolean>(false);

  _styleClass = computed<string>(() => {
    return [
      'inu-button',
      this.type() ? this.type() : '',
      this.link() ? 'link' : '',
      this.disabled()? 'disabled' : ''
    ].join(' ');
  })

}
