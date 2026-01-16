import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import { InugamiIconsUtils, InuIcon} from 'inugami-icons';

@Component({
  templateUrl: './icons.view.html',
  styleUrls: ['./icons.view.scss'],
  imports: [
    InuIcon
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
