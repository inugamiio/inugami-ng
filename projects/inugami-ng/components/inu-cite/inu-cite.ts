import {Component, input, OnInit, signal, WritableSignal} from '@angular/core';
import {InuIcon} from 'inugami-icons';

@Component({
  selector: 'inu-cite',
  imports: [InuIcon],
  templateUrl: './inu-cite.html',
  styleUrl: './inu-cite.scss',
})
export class InuCite implements OnInit{

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  title = input<string | undefined | null>('');
  level = input<string | undefined | null>('');

  icon : WritableSignal<string|null> = signal<string|null>(null);


  ngOnInit(): void {
    this.level();
    const level = this.level();
    if (!level) {
      return undefined;
    }
    switch (level.toLowerCase()) {
      case 'success':
        this.icon.set('approval');
        break;
      default :
        this.icon.set('idea');
        break
    }
  }
}
