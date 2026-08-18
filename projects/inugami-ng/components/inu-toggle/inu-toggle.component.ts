import {Component, computed, effect, input, model, ModelSignal, output} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {FormValueControl} from '@angular/forms/signals'
import {InuLabel} from '../inu-label/inu-label'
import {InuIcon} from 'inugami-icons'


@Component({
             selector   : 'inu-toggle',
             standalone : true,
             imports    : [
               NgTemplateOutlet,
               InuLabel,
               InuIcon
             ],
             templateUrl: './inu-toggle.component.html',
             styleUrl   : './inu-toggle.component.scss',
           })
export class InuToggle implements FormValueControl<boolean> {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  // input
  readonly disabled           = input(false);
  readonly displayFilter      = input(true);
  readonly label              = input('');
  readonly labelKey           = input('');
  readonly _required          = input(false, {alias: 'required'});
  readonly left               = input(false);
  readonly type               = input<string | 'primary' | 'secondary' | 'danger' | 'neutral'>('primary');
  // output
  changed                     = output<boolean>();
  // FormValueControl
  value: ModelSignal<boolean> = model(false);
  isInvalid                   = computed(() => this._required() && !this.value());
  // internal
  _styleClass                 = computed<string>(() => [
    'inu-toggle',
    this.value() ? 'selected' : '',
    this.disabled() ? 'disabled' : '',
    this._required() ? 'required' : '',
    this.isInvalid() ? 'invalid' : '',
    this.left() ? 'left' : '',
    this.type()
  ].join(' '));

  constructor() {
    effect(() => {
    });
  }


  //====================================================================================================================
  // EVENTS
  //====================================================================================================================

  protected toggleValue() {
    if (!this.disabled()) {
      this.value.set(!this.value());
      this.changed.emit(this.value());
    }
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (this.disabled()) {
      return;
    }
    if (event.key === ' ' || event.key === 'Spacebar') {
      this.toggleValue();
      event.preventDefault();
    }
  }
}
