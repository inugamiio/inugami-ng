import {
  CircleOption,
  Dimension,
  Position,
  RectOption,
  Size,
  SvgAnimationCallback,
  SvgAnimationOption,
  SvgAnimationParameters,
  SvgAnimations,
  SvgBuilder,
  SvgMath,
  SvgOptionalOption,
  SvgStyle,
  SvgStyleGenerators,
  SvgTransform,
  TextOption,
  TransformationInfo,
  Vector
} from "inugami-ng/models";


export const DEFAULT_FONT_SIZE = 12;
export const TWO_PI = 2 * Math.PI;
export const TWO_PI_RATIO = (2 * Math.PI) / 360;
export const DEGRE_CONVERTOR = 180 / Math.PI;

const isNull = (value: any): boolean => {
  return value == undefined || value == null;
}

const isNotNull = (value: any): boolean => {
  return value != undefined && value != null;
}

const convertToNumber = (value: any): number | null => {
  return value == undefined || value == null ? null : Number(value);
}

//#############################################################################
// SVG_CONST
//#############################################################################
export const SVG_CONST: any = {
  DATETIME_YEAR: 60000 * 1440 * 365,
  MINUTE: 60000,
  NB_MINUTES_PER_DAY: 1440,
  NANO_TO_MILLIS : 1000000
};


//#############################################################################
// SVG_MATH
//#############################################################################
export const SVG_MATH: SvgMath = {
  convertToRadian: (angle: number): number => {
    return angle * TWO_PI_RATIO;
  },

  convertToDegre: (rad: number): number => {
    return rad * DEGRE_CONVERTOR;
  },
  /**
   * Allow to rotate a point by radian angle
   * @param x     : number : X position
   * @param y     : number : Y position
   * @param angle : number : angle in degre
   */
  rotate: (x: number, y: number, angle: number): Position => {
    var radian = SVG_MATH.convertToRadian(angle);
    var cos = Math.cos(radian);
    var sin = Math.sin(radian);

    return {
      x: (x * cos - y * sin),
      y: (x * sin + y * cos)
    };
  },

  /**
   * Allow to rotate a point by radian angle
   * @param x     : number : X position
   * @param y     : number : Y position
   * @param angle : number : angle in degre
   */
  rotateByRef: (xRef: number, yRef: number, x: number, y: number, angle: number): Position => {
    var zX = x - xRef;
    var zY = y - yRef;
    var rotate = SVG_MATH.rotate(zX, zY, angle);
    return {
      x: rotate.x + xRef,
      y: rotate.y + yRef
    }
  },

  size: (node: SVGElement | HTMLElement): Size => {
    const info = node.getBoundingClientRect();
    return {
      bottom: info.bottom,
      width: info.width,
      height: info.height,
      left: info.left,
      right: info.right,
      top: info.top,
      x: info.x,
      y: info.y,
      fontratio: isNotNull(node.getAttribute('fontratio')) ? 1 : convertToNumber(node.getAttribute('fontratio'))
    };
  },

  computeDimension: (parent: SVGElement | HTMLElement, widthRatio: number | null, heightRatio: number | null, fontRatio: number | null): Dimension => {


    let resultHeightRatio = heightRatio;
    let resultWidthRatio = widthRatio;
    let resultFontRatio = fontRatio;

    if (isNotNull(parent)) {
      let parentSize = SVG_MATH.size(parent);
      resultHeightRatio = 1;
      resultWidthRatio = 1;
      resultFontRatio = 1;
      let parentHeight = 1;
      let parentWidth = 1;
      let parentFont = 1;

      let localHeight = parentSize.height
      let localWidth = parentSize.width;
      let localFont = parentSize.fontratio;

      if (localHeight) {
        parentHeight = parentHeight * localHeight;
      }
      if (localWidth) {
        parentWidth = parentWidth * localWidth;
      }
      if (localFont) {
        parentFont = parentFont * localFont;
      }


      if (heightRatio) {
        resultHeightRatio = parentHeight * heightRatio;
      } else {
        resultHeightRatio = parentHeight;
      }

      if (widthRatio) {
        resultWidthRatio = parentWidth * widthRatio;
      } else {
        resultWidthRatio = parentWidth;
      }

      if (fontRatio) {
        resultFontRatio = parentFont * fontRatio;
      } else {
        resultFontRatio = parentFont;
      }
    }

    return {
      "height": resultHeightRatio ? resultHeightRatio : 1,
      "width": resultWidthRatio ? resultWidthRatio : 1,
      "font": resultFontRatio ? resultFontRatio : 1
    }
  },

  nowNano : ()=>{
    return performance.now() + performance.timeOrigin;
  }
}


//#############################################################################
// SVG_BUILDER
//#############################################################################
export const SVG_BUILDER: SvgBuilder = {

  // ========================================================================
  // createGroup
  // ========================================================================
  createGroup: (parent: SVGElement | HTMLElement | null, option?: SvgOptionalOption): SVGElement | null => {
    return SVG_BUILDER.createNode('g', parent, option);
  },


  // ========================================================================
  // createText
  // ========================================================================
  createText: (label: string, parent: SVGElement, option?: SvgOptionalOption): SVGElement | null => {
    const result = SVG_BUILDER.createNode('text', parent, option);

    if (result) {
      result.innerHTML = label;
      return result;
    } else {
      return null;
    }
  },


  // ========================================================================
  // createLine
  // ========================================================================
  createLine: (vector: Vector, parent: SVGElement, option?: SvgOptionalOption): SVGElement | null => {
    const result = SVG_BUILDER.createNode('path', parent, option);

    if (result) {
      result.setAttribute('d', `M ${vector.start.x},${vector.start.y} ${vector.end.x},${vector.end.y}`);
      return result;
    } else {
      return null;
    }
  },
  // ========================================================================
  // createLine
  // ========================================================================
  createCurve(parent: SVGElement, curve: string, option: SvgOptionalOption | undefined): SVGElement | null {
    const result = SVG_BUILDER.createNode('path', parent, option);
    if (result) {
      result.setAttribute('d', curve);
    }
    return result;
  },
  // ========================================================================
  // createLine
  // ========================================================================
  createRect: (parent: SVGElement, option?: RectOption): SVGElement | null => {

    const currentOption = option ? option : {};
    const result = SVG_BUILDER.createNode('rect', parent, currentOption);

    if (result == undefined || result == null) {
      return null;
    }

    if (currentOption.height) {
      result.setAttribute("height", '' + currentOption.height);
    }
    if (currentOption.width) {
      result.setAttribute("width", '' + currentOption.width);
    }
    if (currentOption.round) {
      result.setAttribute("rx", '' + currentOption.round);
    }

    return result;
  },



  // ========================================================================
  // Circle
  // ========================================================================
  createCircle: (parent: SVGElement, option?: CircleOption): SVGElement | null => {

    const currentOption = option ? option : {};
    const result = SVG_BUILDER.createNode('circle', parent, currentOption);

    if (result == undefined || result == null) {
      return null;
    }

    if (currentOption.height) {
      result.setAttribute("height", '' + currentOption.height);
    }
    if (currentOption.width) {
      result.setAttribute("width", '' + currentOption.width);
    }
    if (currentOption.round) {
      result.setAttribute("rx", '' + currentOption.round);
    }

    return result;
  },

  ellipse: (parent: SVGElement, option?: CircleOption): SVGElement | null => {
    const currentOption = option ? option : {};

    if (parent) {
      let dimention = SVG_MATH.computeDimension(parent,
        currentOption.width ? currentOption.width : 24, currentOption.height ? currentOption.height : 24, 0.10);
      let result = SVG_BUILDER.createNode('cirellipsecle', parent, currentOption);

      if (result) {
        result.setAttribute("rx", ''+dimention.width);
        result.setAttribute("ry", ''+dimention.height);
        result.setAttribute("cx", '' + 0);
        result.setAttribute("cy", '' + 0);
        return result;
      }

    }

    return null;
  },


  // ========================================================================
  // TEXT
  // ========================================================================
  text: (parent: SVGElement, label: string, option?: TextOption): SVGElement | null => {
    let result = null;
    let layerSize = SVG.MATH.size(parent);
    let fontRatio = layerSize.fontratio ? layerSize.fontratio : 12;
    const currentOption = option ? option : {};

    if (isNotNull(parent)) {
      let currentFontSize = isNull(currentOption.fontSize) || fontRatio <= 0 ? 12 : currentOption.fontSize;
      if (fontRatio) {
        currentFontSize = (currentFontSize ? currentFontSize : 12) * fontRatio;
      }

      result = SVG_BUILDER.createNode('svg:text', parent, currentOption);

      if (result) {
        result.setAttribute("x", '' + 0);
        result.setAttribute("y", '' + 0);
        result.setAttribute("style", `font-size:${currentFontSize}px`);

        const htmlNode = result as any;
        htmlNode.text(label);
      }
    }

    return result;
  },
  // ========================================================================
  // createGroup
  // ========================================================================
  createNode: (nodeType: string, parent: SVGElement | HTMLElement | null, option?: SvgOptionalOption): SVGElement | null => {
    if (!parent) {
      return null;
    }
    const currentOption = option == undefined || option == null ? {} : option;
    const result = document.createElementNS("http://www.w3.org/2000/svg", nodeType);
    if (currentOption.styleClass) {
      result.setAttribute("class", currentOption.styleClass);
    }

    parent.appendChild(result);


    return result;
  }
}




//#############################################################################
// SVG_TRANSFORMATION
//#############################################################################
export const SVG_TRANSFORM: SvgTransform = {

  clean: (node: SVGElement) => {
    node.removeAttribute("transform");
  },

  // ========================================================================
  // translate
  // ========================================================================
  translateX: (node: SVGElement | null, posX: number): void => {
    if (!node) {
      return;
    }

    const position = SVG_TRANSFORM.extractTransformInformation(node);
    position.x = posX;
    SVG_TRANSFORM._genericTransform(node, position);
  },

  translateY: (node: SVGElement | null, posY: number): void => {
    if (!node) {
      return;
    }

    const position = SVG_TRANSFORM.extractTransformInformation(node);
    position.y = posY;
    SVG_TRANSFORM._genericTransform(node, position);
  },



  // ========================================================================
  // SCALE
  // ========================================================================
  scale: (node: SVGElement, scaleX: number, scaleY: number) => {
    if (node) {
      var positions = SVG_TRANSFORM.extractTransformInformation(node);
      positions.scaleX = isNull(scaleX) ? 0 : scaleX;
      positions.scaleY = isNull(scaleY) ? 0 : scaleY;

      SVG_TRANSFORM._genericTransform(node, positions);
    }
  },
  scaleX: (node: SVGElement, scaleX: number) => {
    if (isNotNull(node)) {
      var positions = SVG_TRANSFORM.extractTransformInformation(node);
      positions.scaleX = isNull(scaleX) ? 0 : scaleX;

      SVG_TRANSFORM._genericTransform(node, positions);
    }
  },

  scaleY: (node: SVGElement, scaleY: number) => {
    if (isNotNull(node)) {
      var positions = SVG_TRANSFORM.extractTransformInformation(node);
      positions.scaleY = isNull(scaleY) ? 0 : scaleY;

      SVG_TRANSFORM._genericTransform(node, positions);
    }
  },


  // ========================================================================
  // MATRIX
  // ========================================================================
  matrix: (node: SVGElement, scaleX: number, scaleY: number, posX: number, posY: number) => {
    if (node) {
      var data = [isNull(scaleX) ? 0 : scaleX,
        0,
        0,
        isNull(scaleY) ? 0 : scaleY,
        isNull(posX) ? 0 : posX,
        isNull(posY) ? 0 : posY];
      node.setAttribute("transform", "matrix(" + data.join(',') + ")");
    }
  },

  // ========================================================================
  // extractTransformInformation
  // ========================================================================
  extractTransformInformation: (node: SVGElement|HTMLElement): TransformationInfo => {
    const attrTransfo = node.getAttribute("transform");

    let x = null;
    let y = null;
    let scaleX = null;
    let scaleY = null;

    if (attrTransfo) {

      var regex = new RegExp('(?:([^(]+)[(])([^)]+)(?:[)])');
      var group = regex.exec(attrTransfo);

      if (!group) {
        return {
          x: x,
          y: y,
          scaleX: scaleX,
          scaleY: scaleY
        }
      }

      switch (group[1]) {
        case "translate":
          var data = group[2].split(',');
          x = Number(data[0]);
          y = Number(data[1]);
          break;

        case "scale":
          var data = group[2].split(',');
          scaleX = Number(data[0]);
          scaleY = Number(data[1]);
          break;

        case "matrix":
          var data = group[2].split(',');
          scaleX = Number(data[0]);
          scaleY = Number(data[3]);
          x = Number(data[4]);
          y = Number(data[5]);
          break;
      }
    }
    return {
      x: x,
      y: y,
      scaleX: scaleX,
      scaleY: scaleY
    }
  },



  // ========================================================================
  // _genericTransform
  // ========================================================================
  _genericTransform: (node: SVGElement, transfo: TransformationInfo) => {
    if (SVG_TRANSFORM._noScale(transfo)) {
      node.setAttribute("transform", "translate(" + [isNull(transfo.x) ? 0 : transfo.x,
        isNull(transfo.y) ? 0 : transfo.y]
        .join(',') + ")");
    }
    else if (SVG_TRANSFORM._noTranslate(transfo)) {
      node.setAttribute("transform", "scale(" + [isNull(transfo.scaleX) ? 0 : transfo.scaleX,
        isNull(transfo.scaleY) ? 0 : transfo.scaleY]
        .join(',') + ")");
    }
    else {
      SVG_TRANSFORM.matrix(node,
        transfo.scaleX ? transfo.scaleX : 0,
        transfo.scaleY ? transfo.scaleY : 0,
        transfo.x ? transfo.x : 0,
        transfo.y ? transfo.y : 0);
    }
  },
  _noScale: (data: TransformationInfo): boolean => {
    return isNull(data.scaleX) && isNull(data.scaleY);
  },
  _noTranslate: (data: TransformationInfo): boolean => {
    return isNull(data.x) && isNull(data.y);
  },


  // ========================================================================
  // ALIGN
  // ========================================================================
  center: (compo: SVGElement, svgContainer: HTMLElement, onX: boolean, onY: boolean): number => {
    const containerSize = SVG.MATH.size(svgContainer);
    let pos = SVG.MATH.size(compo);

    const diffSizeX = containerSize.width / pos.width;
    const diffSizeY = containerSize.height / pos.height;
    const sizeRatio = diffSizeY < diffSizeX ? diffSizeY : diffSizeX;

    SVG.TRANSFORM.scale(compo, sizeRatio, sizeRatio);
    pos = SVG.MATH.size(compo);
    pos.x = pos.x - containerSize.x;
    pos.y = pos.y - containerSize.y;

    if (onX) {
      const diffSizeX = containerSize.width - pos.width;
      const newPosX = (-pos.x) + (diffSizeX / 2);
      SVG.TRANSFORM.translateX(compo, newPosX);
    }

    if (onY) {
      const diffSizeY = containerSize.height - pos.height;
      const newPosY = (-pos.y) + (diffSizeY / 2);
      SVG.TRANSFORM.translateY(compo, newPosY);
    }

    return 1 / sizeRatio;
  },

  // ========================================================================
  // TOOLS
  // ========================================================================
  toogleClass: (node: SVGElement|HTMLElement, styleclass: string): void => {
    if (!node) {
      return;
    }
    const currentClass = node.getAttribute("class");
    if (currentClass) {
      if (currentClass.includes(styleclass)) {
        node.setAttribute('class', currentClass.replaceAll(styleclass, ''));
      } else {
        node.setAttribute('class', `${currentClass} ${styleclass}`);
      }
    } else {
      node.setAttribute('class', styleclass);
    }
  },
  removeClass: (node:  SVGElement|HTMLElement, styleclass: string): void => {
    if (!node) {
      return;
    }
    const currentClass = node.getAttribute("class");
    if (currentClass) {
      if (currentClass.includes(styleclass)) {
        node.setAttribute('class', currentClass.replaceAll(styleclass, ''));
      }
    }
  },
  addClass: (node:  SVGElement|HTMLElement, styleclass: string): void => {
    if (!node) {
      return;
    }
    const currentClass = node.getAttribute("class");
    if (currentClass) {
      if (!currentClass.includes(styleclass)) {
        node.setAttribute('class', `${currentClass} ${styleclass}`);
      }
    } else {
      node.setAttribute('class', styleclass);
    }
  },
  hasClass: (node:  SVGElement|HTMLElement, styleclass: string): boolean => {
    if (!node) {
      return false;
    }
    const currentClass = node.getAttribute("class");
    return currentClass ? currentClass.includes(styleclass) : false;
  }
};

//#############################################################################
// SVG STYLE GENERATOR
//#############################################################################
export const SVG_STYLE_GENERATOR: SvgStyleGenerators = {
  BY_TYPE: (value:number, maxValue:number, minValue:number, type:string): SvgStyle =>{
    return {
      style: type
    }
  }
}

//#############################################################################
// SVG ANIMATION
//#############################################################################
export const SVG_ANIMATION : SvgAnimations = {
  TYPES : {
    linear:(time:number): number => time,
    parabolic : (time:number): number => -(4*Math.pow(time, 2)) + (4*time),
    easeOutCubic : (time:number) => Math.pow(time-1, 3) + 1,
    easeInCubic : (time:number) => Math.pow(time, 3),
    easeInQuad : (time:number) => time*time,
    easeOutQuad : (time:number) => time*(2-time),
  },
  animate : (callback:SvgAnimationCallback, option?:SvgAnimationOption):void=>{

    const currentOption:SvgAnimationOption = option?option:{};
    const duration = (currentOption.duration ? currentOption.duration:250);
    const now = new Date().getTime();

    const params : SvgAnimationParameters = {
      timer       : currentOption.timer?currentOption.timer: SVG_ANIMATION.TYPES.linear,
      delay       : currentOption.delay?currentOption.delay:0,
      duration    : (now+duration)-now,
      startTime   : now,
      ttl         : now+duration,
      callback    : callback,
      onDone      : currentOption.onDone
    }



    if(params.delay>0){
      setTimeout(()=>{
        const now = new Date().getTime();
        params.startTime   = now;
        params.ttl         = now+duration;
        new AnimationHandler(params).run();
      },currentOption.delay);
    }else{
      new AnimationHandler(params).run();
    }
  }
}

class AnimationHandler{

  private animeId :number|null= null;

  constructor(private parameters: SvgAnimationParameters) {
  }

  public run(){
    let duration = this.parameters.duration;
    let initialTimestamp= window.performance.now();
    let timestamp=0;

    const frame = () => {
      timestamp= window.performance.now()- initialTimestamp;
      const progress = timestamp/duration
      if (progress >=1) {
        this.parameters.callback(this.parameters.timer(1));
        if(this.parameters.onDone){
          this.parameters.onDone();
        }
        if(this.animeId){
          cancelAnimationFrame(this.animeId);
        }

        this.animeId = null;
        return;
      }
      this.parameters.callback(this.parameters.timer(progress));

      this.animeId = requestAnimationFrame(frame);
    }

    this.animeId = requestAnimationFrame(frame);
  }

}

//#############################################################################
// SVG_TRANSFORMATION
//#############################################################################
export const SVG = {
  CONSTANTS: SVG_CONST,
  MATH: SVG_MATH,
  BUILDER: SVG_BUILDER,
  TRANSFORM: SVG_TRANSFORM,
  STYLE : SVG_STYLE_GENERATOR,
  ANIMATION:SVG_ANIMATION
}
