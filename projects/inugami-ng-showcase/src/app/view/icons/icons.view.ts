import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import { InugamiIconsUtils, InuIcon} from 'inugami-icons';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuCite} from 'inugami-ng/components/inu-cite';
@Component({
  templateUrl: './icons.view.html',
  styleUrls: ['./icons.view.scss'],
  imports: [
    InuIcon,
    InuCode,
    InuCite,
    InuCite
  ]
})
export class IconsView implements OnInit {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  protected icons: WritableSignal<string[]> = signal<string[]>([]);


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  ngOnInit(): void {
    const allIcons: string[] = InugamiIconsUtils.getAllIcons();
    allIcons.sort();
    this.icons.set(allIcons);

  }

}
