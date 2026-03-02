import {Component, computed, inject, signal} from '@angular/core';
import {SVG_ASSETS} from 'inugami-ng/services';
import {SvgAsset, SvgAssetSet} from 'inugami-svg-assets';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {InuSvgAsset} from 'inugami-ng/components/inu-svg-asset';
import {InuButton} from 'inugami-ng/components/inu-button';

@Component({
  templateUrl: './inu-svg-assets.view.html',
  styleUrls: ['./inu-svg-assets.view.scss'],
  imports: [
    InuSvgAsset,
    InuButton
  ]
})
export class InuSvgAssetView {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  private sanitizer = inject(DomSanitizer);
  assetSets = computed<SvgAssetSet[]>(() => SVG_ASSETS.getAssetSets());
  assetSetsNames = computed(()=> {
    const result = this.assetSets().map(a=> a.name);
    result.sort();
    return result;
  });
  asset = signal<SvgAsset | undefined>(undefined);
  type  = signal<string|undefined>(undefined);
  state  = signal<string|undefined>(undefined);
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  protected getDefaultAssetState(asset: SvgAsset): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(asset.types.find(t => t.name === 'default')
      ?.states.find(s => s.name === 'default')
      ?.content ?? '');
  }

  protected selectAsset(asset: SvgAsset) {
    this.type.set('default');
    this.state.set('default');
    this.asset.set(asset);
  }

  protected selectState(type: string, state: string) {
    console.log('selectState',type,state)
      this.type.set(type);
      this.state.set(state);

  }

  protected getAssets(assetSet: string):SvgAsset[] {
    const currentAssetSet = this.assetSets().find(a=> a.name==assetSet);
    if(!currentAssetSet){
      return [];
    }
    const assets = currentAssetSet.assets;
    assets.sort((v,r)=> v.name.localeCompare(r.name));
    return assets;
  }
}
