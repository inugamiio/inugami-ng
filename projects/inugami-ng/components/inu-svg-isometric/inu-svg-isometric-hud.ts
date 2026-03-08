import {SVG_ASSETS, SVG_BUILDER, SvgAssetUtils} from 'inugami-ng/services';
import {SvgAssetDTO, SvgAssetDTOOptions, SvgAssetElement, SvgButton} from 'inugami-ng/models';

export interface InuSvgIsometricHudOption {
  parent: HTMLElement;
  height: number;
  width: number;
}

const POINTER = 'cursor-pointer';
const ASSETS_TOOLS = 'tools';

export class InuSvgIsometricHud {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  parent!: HTMLElement;
  height!: number;
  width!: number;
  scale: number = 0.7;
  toolbarMargin = 1.25;
  //
  hud: SVGElement | null = null;
  hudToolbar: SVGElement | null = null;
  hudToolbarAssets: SvgAssetElement[] = [];
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
    this.hud = SVG_BUILDER.createGroup(this.parent, {styleClass: `hud`});
    this.hudToolbar = this.renderHudToolbar(this.hud);
    this.hudInspector = this.renderHudInspector(this.hud);
    this.hudSettings = this.renderHudSettings(this.hud);
    this.hudNavigation = this.renderHudNavigation(this.hud);
  }

  private renderHudToolbar(parent: SVGElement | null) {
    const result = SVG_BUILDER.createGroup(this.hud, {styleClass: `toolbar`});

    const buttons: SvgButton[] = [
      {
        name: 'add-asset',
        icon: 'category',
        onover: (event, node) => this.onOverAsset(node),
        onmouseleave: (event, node) => this.onLeaveAsset(node)
      },
      {
        name: 'download',
        icon: 'download',
        onover: (event, node) => this.onOverAsset(node),
        onmouseleave: (event, node) => this.onLeaveAsset(node)
      },
      {
        name: 'zoom-div',
        icon: 'div'
      },
      {
        name: 'zoom-plus',
        icon: 'zoom',
        type: 'default',
        onover: (event, node) => this.onOverAsset(node),
        onmouseleave: (event, node) => this.onLeaveAsset(node)
      },
    ];

    for (let button of buttons) {
      const buttonAsset = this.createAsset(<SvgAssetDTOOptions>{
        parent: result,
        name: button.name,
        asset: {
          assetSet: ASSETS_TOOLS,
          assetName: button.icon
        },
        styleClass: POINTER
      });
      if (!buttonAsset) {
        continue;
      }

      if (button.onover) buttonAsset.onover = button.onover;
      if (button.onclick) buttonAsset.onclick = button.onclick;
      if (button.onmousedown) buttonAsset.onmousedown = button.onmousedown;
      if (button.onmousemove) buttonAsset.onmousemove = button.onmousemove;
      if (button.onmouseleave) buttonAsset.onmouseleave = button.onmouseleave;
      if (button.ondblclick) buttonAsset.ondblclick = button.ondblclick;
      if (button.ondrag) buttonAsset.ondrag = button.ondrag;
      if (button.ondrop) buttonAsset.ondrop = button.ondrop;
      if (button.ondragend) buttonAsset.ondragend = button.ondragend;
      if (button.ondragstart) buttonAsset.ondragstart = button.ondragstart;
      if (button.ondragleave) buttonAsset.ondragleave = button.ondragleave;
      if (button.ondragover) buttonAsset.ondragover = button.ondragover;
      if (button.ondragenter) buttonAsset.ondragenter = button.ondragenter;
      this.hudToolbarAssets.push(buttonAsset);
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
    this.updatePositionHudToolbar(height, width);
  }

  private updatePositionHudToolbar(height: number, width: number) {
    if (this.hudToolbarAssets.length == 0) {
      return;
    }

    const size = this.hudToolbarAssets[0].getComponentSize();
    for (let i = 1; i < this.hudToolbarAssets.length; i++) {
      this.hudToolbarAssets[i].move({x: (i * size.width) * this.toolbarMargin, y: 0});
    }
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
  private createAsset(option: SvgAssetDTOOptions): SvgAssetElement | undefined {
    console.log('createAsset')
    const assetIcon = SVG_ASSETS.getAsset(option.asset?.assetSet!, option.asset?.assetName!);
    if (!assetIcon || !parent) {
      return undefined;
    }
    return SvgAssetUtils.createAssetOpts({
      parent:option.parent!,
      asset: {
        name: option.name!,
        assetSet: option.asset?.assetSet!,
        assetName: option.asset?.assetName!,
        x: 0,
        y: 0,
        size: this.scale
      },
      scale : this.scale,
      isometric:false,
      enableHitBox:true
    });
  }

}
