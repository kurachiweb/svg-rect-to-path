interface Axis {
  x: number;
  y: number;
}

// 丸め誤差を考慮して丸める
function round(num: number, precision = 0) {
  const shiftedNum = Math.round(num * 10 ** precision);
  if (precision === 0) return shiftedNum;
  const unshiftedNum = shiftedNum * 10 ** -precision;

  const numStr = unshiftedNum + '';
  const numPart = numStr.split('.');
  if (!numPart[1]) return unshiftedNum;

  const roundErrFixed = +(numPart[0] + '.' + numPart[1].slice(0, precision));
  return roundErrFixed;
};

// 属性値からtransform前の角座標を求める
function getCornersXY(elem: SVGRectElement) {
  const val = (attr: keyof SVGRectElement) => elem[attr]?.baseVal.value ?? 0;
  return [
    { x: val('x'), y: val('y') }, // top-left
    { x: val('x') + val('width'), y: val('y') }, // top-right
    { x: val('x') + val('width'), y: val('y') + val('height') }, // bottom-right
    { x: val('x'), y: val('y') + val('height') }, // bottom-left
  ];
};

// 0個以上のtransform命令を保持
function DOMTransformer(TfList: SVGTransformList, x: number, y: number): Axis {
  const TfListLen = TfList.length;
  let matrixes: DOMMatrix[] = [];
  for (let i = 0; i < TfListLen; i++) matrixes.push(TfList[i].matrix)

  // transform後の角座標を求める
  const point = new DOMPoint(x, y);
  const domMatrix = new DOMMatrix();
  matrixes.forEach(eachMatrix => domMatrix.multiplySelf(eachMatrix));
  const returnPoint = point.matrixTransform(domMatrix);
  return { x: returnPoint.x, y: returnPoint.y };
};

// rect要素のouterHTMLを点の座標データにする
const getParsedElems = (elemHtmlVal: string) => {
  const parsedDoc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + elemHtmlVal + '</svg>', 'image/svg+xml');
  const isDOMVaild = parsedDoc.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'rect');
  return [...isDOMVaild] as SVGRectElement[];
};

const attrsToHTML = (attrs: NamedNodeMap, targetAttrs: string[], ignoreAttrs: string[]) => {
  let entries = [];
  for (let eachAttr of attrs) entries.push([eachAttr.name, eachAttr.value]);
  if (ignoreAttrs?.length) {
    entries = entries.filter(each => !ignoreAttrs.includes(each[0]));
  } else if (targetAttrs?.length) {
    entries = entries.filter(each => targetAttrs.includes(each[0]));
  }
  const attrsHTML = entries.map(each => ` ${each[0]}="${each[1]}"`).join('');
  return attrsHTML;
};

// 点の座標データをd属性値にする
const convertPathValue = (pointArrs: Axis[], precision: number, pointMode: string) => {
  let cmdFlag = 'M', d = '';
  let beforePoint: Axis = { x: 0, y: 0 };
  pointArrs.forEach(eachPArr => {
    if (d === '') {
      cmdFlag = 'M';
    } else if (eachPArr.x === beforePoint.x) {
      cmdFlag = 'V';
    } else if (eachPArr.y === beforePoint.y) {
      cmdFlag = 'H';
    } else {
      cmdFlag = 'L';
    }
    const xFrom = pointMode === 'relative' ? beforePoint.x : 0
    const yFrom = pointMode === 'relative' ? beforePoint.y : 0
    const roundPArr: Axis = {
      x: round(eachPArr.x - xFrom, precision),
      y: round(eachPArr.y - yFrom, precision)
    };
    if (cmdFlag === 'V') {
      d += cmdFlag + roundPArr.y;
    } else if (cmdFlag === 'H') {
      d += cmdFlag + roundPArr.x;
    } else {
      d += cmdFlag + `${roundPArr.x},${roundPArr.y}`;
    }
    beforePoint.x = eachPArr.x;
    beforePoint.y = eachPArr.y;
  });
  if (pointMode === 'relative') d = d.toLowerCase().replace('m', 'M');
  d += 'Z';
  return d;
};

// 点の座標データをpoints属性値にする
const convertPolygonValue = (pointArrs: Axis[], precision = 2) => {
  let pointsStr = '';
  pointArrs.forEach(eachPArr => {
    if (pointsStr !== '') pointsStr += ' ';
    const roundPArr: Axis = {
      x: round(eachPArr.x, precision),
      y: round(eachPArr.y, precision)
    };
    pointsStr += `${roundPArr.x},${roundPArr.y}`;
  });
  return pointsStr;
};

// 必要なデータを取得し、関数を逐次実行する
export const convertSVGElements = (inputSVG: string, elemName: string, coordMode: string, precision: number) => {
  const lang = 'XML';
  const requireAttrs = ['width', 'height'];
  if (!(inputSVG && elemName && lang && coordMode && !isNaN(precision))) {
    return '';
  }

  const genOutputValue = (elem: SVGRectElement) => {
    let outputValue = '';
    const parsedElemAttrs = elem.attributes;
    const isVaildAttr = requireAttrs.every(attr => attr in elem);
    if (!isVaildAttr) {
      return 'Invalid input';
    }

    const cornersXY = getCornersXY(elem);
    const transformedP = cornersXY.map(eachCorner => DOMTransformer(elem.transform.baseVal, eachCorner.x, eachCorner.y));
    const attrsHTML = attrsToHTML(parsedElemAttrs, [], [...requireAttrs, 'x', 'y', 'transform']);

    let pointValue = '';
    if (elemName === 'path') {
      pointValue = convertPathValue(transformedP, precision, coordMode);
      outputValue = `<path d="${pointValue}"${attrsHTML}${lang === 'XML' ? ' /' : ''}>`;
    } else {
      pointValue = convertPolygonValue(transformedP, precision);
      outputValue = `<polygon points="${pointValue}"${attrsHTML}${lang === 'XML' ? ' /' : ''}>`;
    }

    return outputValue;
  }

  const parsedElems = getParsedElems(inputSVG);
  const outputValue = parsedElems.map(genOutputValue).join('\n');

  return outputValue;
};