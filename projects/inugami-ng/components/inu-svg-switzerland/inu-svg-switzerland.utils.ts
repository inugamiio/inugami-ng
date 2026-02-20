import {InuSvgSwitzerlandStyleGenerator} from './inu-svg-switzerland.model';
import {InuSelectItem, SvgStyle} from 'inugami-ng/models';

export const SVG_SWITZERLAND_COLORED: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return {
    styleclass: `colored-${selectItem.id} ${selectItem.selected ? 'selected' : ''}`
  }
}

export const SVG_SWITZERLAND_MONOCHROME: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return {
    styleclass: `monochrome ${selectItem.selected ? 'selected' : ''}`
  }
}


export const SVG_SWITZERLAND_LEVEL_MONOCHROME_GENERATOR = (selectItem: InuSelectItem<any>,
                                                           colorIndex: number,
                                                           min: number,
                                                           max: number): SvgStyle | undefined => {
  let value = selectItem.value ? Number(selectItem.value) : 0;
  if (value < min) {
    value = min;
  }
  if (value > max) {
    value = max;
  }
  const range = max - min;
  const percentage = range <= 0 ? 0 : ((value - min) / range) * 100;
  const saturation = Math.round(percentage);
  const lightness = 70 - (percentage * 0.3);

  const style = `fill:hsl(${colorIndex} ${saturation}% ${lightness}% / 1);`;
  return {
    styleclass: `monochrome-level`,
    style: style
  }
}

export const SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return SVG_SWITZERLAND_LEVEL_MONOCHROME_GENERATOR(selectItem, 200, 0, 10);
}
export const SVG_SWITZERLAND_LEVEL_MONOCHROME_RED: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return SVG_SWITZERLAND_LEVEL_MONOCHROME_GENERATOR(selectItem, 0, 0, 10);
}
export const SVG_SWITZERLAND_LEVEL_MONOCHROME_GREEN: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return SVG_SWITZERLAND_LEVEL_MONOCHROME_GENERATOR(selectItem, 100, 0, 10);
}
export const SVG_SWITZERLAND_LEVEL_COLOR_10: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, 10);
}
export const SVG_SWITZERLAND_LEVEL_COLOR_100: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, 100);
}

export const SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR = (selectItem: InuSelectItem<any>,
                                                      min: number,
                                                      max: number): SvgStyle | undefined => {

  let value = Number(selectItem.value) || 0;
  if (value < min) {
    value = min;
  }
  if (value > max) {
    value = max;
  }
  const range = max - min;
  const percentage = range <= 0 ? 0 : Math.min(Math.max(((value - min) / range) * 100, 0), 100);
  const colorIndex = Math.round((percentage*0.75) * 356);
  const saturation = Math.round(percentage);


  return {
    styleclass: `monochrome-level`,
    style: `fill:hsl(${colorIndex} ${saturation}% 50% / 1);`
  };
}

