import {SVG_ASSETS, SVG_BUILDER, SvgAssetUtils} from 'inugami-ng/services';
import {SvgAssetDTO, SvgAssetElement} from 'inugami-ng/models';

export interface InuSvgIsometricHudOption {
  parent: HTMLElement;
  height: number;
  width: number;
}

export class InuSvgIsometricHud {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  parent!: HTMLElement;
  height!: number;
  width!: number;
  scale:number=0.7;
  //
  hud: SVGElement | null = null;
  hudToolbar: SVGElement | null = null;
  hudToolbarAssets: SvgAssetElement[]= [];
  hudInspector: SVGElement | null = null;
  hudSettings: SVGElement | null = null;
  hudNavigation: SVGElement | null = null;


  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor(option: InuSvgIsometricHudOption) {
    this.parent = option.parent;
    this.height = option.height;
    this.width = option.width;
    this.render();
  }

  //====================================================================================================================
  // RENDERING
  //====================================================================================================================
  private render() {
    console.log('hud render')
    this.hud = SVG_BUILDER.createGroup(this.parent , {styleClass: `hud`});
    this.hudToolbar = this.renderHudToolbar(this.hud);
    this.hudInspector = this.renderHudInspector(this.hud);
    this.hudSettings = this.renderHudSettings(this.hud);
    this.hudNavigation = this.renderHudNavigation(this.hud);
  }

  private renderHudToolbar(parent: SVGElement | null) {
    const result = SVG_BUILDER.createGroup(this.hud, {styleClass: `toolbar`});


    const addAsset = this.createAsset('add-asset', 'tools', 'category', result);
    if(addAsset){
      addAsset.onover = (event, node)=> this.onOverAsset(node);
      addAsset.onmouseleave = (event, node)=> this.onLeaveAsset(node);
      this.hudToolbarAssets.push(addAsset);
    }


    return result;
  }

  private renderHudInspector(parent: SVGElement | null) {
    const result = SVG_BUILDER.createGroup(this.hud, {styleClass: `layers-inspector`});

    return result;
  }

  private renderHudSettings(parent: SVGElement | null) {
    const result = SVG_BUILDER.createGroup(this.hud, {styleClass: `settings`});

    return result;
  }

  private renderHudNavigation(parent: SVGElement | null) {
    const result = SVG_BUILDER.createGroup(this.hud, {styleClass: `navigation`});

    return result;
  }

  //====================================================================================================================
  // ACTIONS
  //====================================================================================================================
  updatePosition(height: number, width: number) {

  }
  //====================================================================================================================
  // EVENTS
  //====================================================================================================================
  private onOverAsset(node: SvgAssetElement) {
    node.addStyleClass('over');
  }
  private onLeaveAsset(node: SvgAssetElement) {
    node.removeStyleClass('over');
  }
  //====================================================================================================================
  // TOOLS
  //====================================================================================================================
  private createAsset(name: string, assetSet: string, assetName: string, parent?: SVGElement | null): SvgAssetElement | undefined {
    const assetIcon = SVG_ASSETS.getAsset(assetSet, assetName);
    if (!assetIcon || !parent) {
      return undefined;
    }
    const asset: SvgAssetDTO = {
      name: name,
      assertSet: assetSet,
      assertName: assetName,
      x: 0,
      y: 0,
      size: this.scale
    }
    return SvgAssetUtils.createAsset(asset, parent, {x: 0, y: 0}, this.scale, false);
  }


}
