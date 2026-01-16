import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChildren,
  WritableSignal
} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {InugamiTemplateDirective, InuTemplateRegistryService} from 'inugami-ng/directives';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'inu-cite',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [InuIcon,NgTemplateOutlet],
  templateUrl: './inu-cite.html',
  styleUrl: './inu-cite.scss',
})
export class InuCite implements OnInit {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  title = input<string | undefined | null>('');
  level = input<string | undefined | null>('');

  icon: WritableSignal<string | null> = signal<string | null>(null);
  styleClass: WritableSignal<string | null> = signal<string | null>(null);
  titleTemplate = computed(() => this.registry.getTemplate('title'));
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);

  ngOnInit(): void {
    this.level();
    const level = this.level()?.toLowerCase() || '';
    const icons: Record<string, string> = {
      success: 'approval',
      warning: 'warning',
      danger: 'danger',
    };

    this.icon.set(icons[level] || 'idea');

    this.styleClass.set(['inu-cite', level].join(' '));

  }
}
