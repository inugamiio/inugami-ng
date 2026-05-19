import {Component, computed, effect, ElementRef, input, signal, viewChild} from '@angular/core';
import {SVG} from 'inugami-ng/services'

@Component({
             selector   : 'inu-progress',
             standalone : true,
             imports    : [],
             templateUrl: './inu-progress.html',
             styleUrl   : './inu-progress.scss',
           })
export class InuProgress {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  styleClass = input<string | undefined>(undefined);
  value      = input<number>(0);
  min        = input<number>(0);
  max        = input<number>(1);
  unit       = input<string>('%');
  showValue  = input<boolean>(true);
  nbDigit    = input<number>(2);

  //
  main = viewChild<ElementRef<HTMLElement>>('cursor');

  //
  _node          = computed(() => this.main()?.nativeElement);
  _percentage    = signal<number>(0);
  _previousValue = signal<number | undefined>(undefined);
  _styleClass    = computed<string>(() => [
    'inu-progress',
    this.styleClass() ?? ''
  ].join(' '));

  _value                     = signal<string>('');
  _animatedPercentage        = signal<number>(0);
  currentAnimationId: number = 0;

  constructor() {
    this.updateValue();
    effect(() => this.updateValue());
  }

  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  private updateValue() {
    let current   = this.value() ?? 0;
    const minimum = this.min() ?? 0;
    const maximum = this.max() ?? 1;
    const node    = this._node();

    if (!node || minimum >= maximum) {
      return;
    }

    if (current > maximum) current = maximum;
    if (current < minimum) current = minimum;

    const clampedRatio = Math.max(0, Math.min(1, (current - minimum) / (maximum - minimum)));
    const targetPct    = clampedRatio * 100;
    const hasPrevious  = this._previousValue() !== undefined;
    const startPct     = hasPrevious ? this._animatedPercentage() : targetPct;
    const deltaPct     = targetPct - startPct;

    this._percentage.set(targetPct);
    this._previousValue.set(current);
    this._value.set(targetPct.toFixed(this.nbDigit()));

    if (!hasPrevious || deltaPct === 0) {
      this._animatedPercentage.set(targetPct);
      node.style.transform = `scaleX(${clampedRatio})`;
      return;
    }

    this.currentAnimationId++;
    const animationId = this.currentAnimationId;

    SVG.ANIMATION.animate(
      (progress: number) => {
        if (animationId !== this.currentAnimationId) {
          return;
        }

        const currentPct   = startPct + (deltaPct * progress);
        const currentRatio = currentPct / 100;

        this._animatedPercentage.set(currentPct);
        node.style.transform = `scaleX(${currentRatio})`;
      },
      {
        duration: 300,
        timer   : SVG.ANIMATION.TYPES.easeOutCubic,
        onDone  : () => {
          if (animationId !== this.currentAnimationId) {
            return;
          }

          this._animatedPercentage.set(targetPct);
          node.style.transform = `scaleX(${clampedRatio})`;
        }
      }
    );
  }
}
