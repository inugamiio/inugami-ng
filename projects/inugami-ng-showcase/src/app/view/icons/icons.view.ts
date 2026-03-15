import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {InugamiIconsUtils, InuIcon} from 'inugami-icons';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuToastServices} from 'inugami-ng/components/inu-toast';
import {InuInputText} from 'inugami-ng/components/inu-input-text';

@Component({
  templateUrl: './icons.view.html',
  styleUrls: ['./icons.view.scss'],
  imports: [
    InuIcon,
    InuCode,
    InuCite,
    InuInputText
  ]
})
export class IconsView implements OnInit {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  protected icons: WritableSignal<string[]> = signal<string[]>([]);
  toastServices = inject(InuToastServices);
  filter = signal<string>('');
  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  ngOnInit(): void {
    const allIcons: string[] = InugamiIconsUtils.getAllIcons();
    allIcons.sort();
    this.icons.set(allIcons);

  }

  protected copy(icon: string, event: MouseEvent) {

    const content: string = event.ctrlKey
      ? icon
      : `<inu-icon icon="${icon}" [size]="1"></inu-icon>`;

    navigator.clipboard.writeText(content)
      .then(() => {
        this.toastServices.addMessage({
          title: 'Value copied to clipboard',
          message: content,
          level: "success",
          icon: 'approval'
        });

      });
  }

  protected onFilterChanged(event: string|number) {
    this.filter.set(`${event}`);
  }

  protected allowToDisplay(icon: string) {
    const filter = this.filter();
    if(filter==''){
      return true;
    }
    return icon.includes(filter);
  }
}
