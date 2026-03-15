import {AfterViewInit, Component, computed, effect, input, signal} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {NgClass} from '@angular/common';

@Component({
  selector: 'inu-button',
  standalone: true,
  imports: [InuIcon],
  templateUrl: './inu-button.component.html',
  styleUrl: './inu-button.component.scss',
})
export class InuButton implements AfterViewInit{

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  label = input<string | undefined | null>('');
  icon = input<string | null>(null);
  iconSize = input<number>(1.2);
  type = input<string>('');
  link = input<boolean>(false);
  disabled = input<boolean>(false);
  processing = input<boolean>(false);
  processingIcon = input<string | null>(null);

  _processIcon = computed<string|null>(()=>{
    const result = this.processingIcon();
    return result?result: this.icon();
  } )
  _styleClass = computed<string>(() => {
    return [
      'inu-button',
      this.type() ? this.type() : '',
      this.link() ? 'link' : '',
      this.disabled()? 'disabled' : ''
    ].join(' ');
  })

  iconStyleClass = signal<string>('inu-button-icon');

  constructor() {
    effect(() => {
     this.iconStyleClass.set(this.computeIconStyleClass());
    });
  }
  ngAfterViewInit(): void {
    this.iconStyleClass.set(this.computeIconStyleClass());
  }

  computeIconStyleClass(){
    return [
      'inu-button-icon',
      this.processing() ? 'rotate' : ''
    ].join(' ');
  }



}
