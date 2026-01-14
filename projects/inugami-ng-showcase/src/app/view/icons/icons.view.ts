import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {IconDefinition, InugamiIconsUtils, InuIcon} from 'inugami-icons';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {SiteLink} from '../../models/website-model';

@Component({
  templateUrl: './icons.view.html',
  styleUrls: ['./icons.view.scss'],
  imports: [
    InuIcon,
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
