const inputElem = document.getElementById('input');
const elemSelector = document.getElementById('select_elem');
const langSelector = document.getElementById('select_lang');
const pModeSelector = document.getElementById('point_mode');
const decimalElem = document.getElementById('decimal_places');
const outputElem = document.getElementById('output');

// 丸め誤差を考慮して丸める
const round = (num, precision = 0) => {
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
const getCornersXY = attrs => {
    const val = attr => attrs[attr] ? +attrs[attr].value : 0;
    const cornerArr = [];
    cornerArr.push([val('x'), val('y')]);
    cornerArr.push([val('x') + val('width'), val('y')]);
    cornerArr.push([val('x') + val('width'), val('y') + val('height')]);
    cornerArr.push([val('x'), val('y') + val('height')]);
    return cornerArr;
};

// 0個以上のtransform命令を保持
const DOMTransformer = function (TfList) {
    const TfListLen = TfList.length;
    let matrixes = [];
    for (let i = 0; i < TfListLen; i++) matrixes.push(TfList[i].matrix)

    // transform後の角座標を求める
    this.applyXY = (x, y) => {
        const point = new DOMPoint(x, y);
        const domMatrix = new DOMMatrix();
        matrixes.forEach(eachMatrix => domMatrix.multiplySelf(eachMatrix));
        const returnPoint = point.matrixTransform(domMatrix);
        return [returnPoint.x, returnPoint.y];
    };
};

// rect要素のouterHTMLを点の座標データにする
const getParsedElems = (elemHtmlVal, elemName) => {
    const parsedDoc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + elemHtmlVal + '</svg>', 'image/svg+xml');
    const isDOMVaild = parsedDoc.getElementsByTagNameNS('http://www.w3.org/2000/svg', elemName);
    return isDOMVaild.length ? [...isDOMVaild] : false;
};

const attrsToHTML = (attrs, rule = {}) => {
    let entries = [];
    const targetRule = rule.target || [];
    const ignoreRule = rule.ignore || [];
    for (let eachAttr of attrs) entries.push([eachAttr.name, eachAttr.value]);
    if (ignoreRule.length) {
        entries = entries.filter(each => !ignoreRule.includes(each[0]));
    } else if (targetRule.length) {
        entries = entries.filter(each => targetRule.includes(each[0]));
    }
    const attrsHTML = entries.map(each => ` ${each[0]}="${each[1]}"`).join('');
    return attrsHTML;
};

// 点の座標データをd属性値にする
const convertPathValue = (pointArrs, precision = 2, pointMode = 'relative') => {
    let cmdFlag = 'M', d = '';
    let beforePoint = [0, 0];
    pointArrs.forEach(eachPArr => {
        if (d === '') {
            cmdFlag = 'M';
        } else if (eachPArr[0] === beforePoint[0]) {
            cmdFlag = 'V';
        } else if (eachPArr[1] === beforePoint[1]) {
            cmdFlag = 'H';
        } else {
            cmdFlag = 'L';
        }
        const roundPArr = eachPArr.map((point, i) => {
            if (pointMode === 'relative') {
                return round(point - beforePoint[i], precision);
            } else {
                return round(point, precision);
            }
        });
        beforePoint = eachPArr.slice();
        if (cmdFlag === 'V') {
            d += cmdFlag + roundPArr[1];
        } else if (cmdFlag === 'H') {
            d += cmdFlag + roundPArr[0];
        } else {
            d += cmdFlag + roundPArr.join();
        }
    });
    if (pointMode === 'relative') d = d.toLowerCase().replace('m', 'M');
    d += 'Z';
    return d;
};

// 点の座標データをpoints属性値にする
const convertPolygonValue = (pointArrs, precision = 2) => {
    let pointsStr = '';
    pointArrs.forEach(eachPArr => {
        if (pointsStr !== '') pointsStr += ' ';
        const roundPArr = eachPArr.map(point => round(point, precision));
        pointsStr += roundPArr.join();
    });
    return pointsStr;
};

// 必要なデータを取得し、関数を逐次実行する
const convertProcess = () => {
    const inputStr = inputElem.value;
    const elemName = elemSelector.value;
    const lang = langSelector.value;
    const pointMode = pModeSelector.value;
    const precision = +decimalElem.value;
    const requireAttrs = ['width', 'height'];
    if (!(inputStr && elemName && lang && pointMode && !isNaN(precision))) {
        outputElem.textContent = 'Invalid input';
        return false;
    }

    const genOutputValue = elem => {
        let outputValue = '';
        const parsedElemAttrs = elem ? elem.attributes : {};
        const isVaildAttr = requireAttrs.every(attr => parsedElemAttrs[attr]);
        if (!isVaildAttr) {
            outputElem.textContent = 'Invalid input';
            return false;
        }

        const cornersXY = getCornersXY(parsedElemAttrs);
        const DOMTf = new DOMTransformer(elem.transform.baseVal);
        const transformedP = cornersXY.map(eachCorner => DOMTf.applyXY(...eachCorner));
        const attrsHTML = attrsToHTML(parsedElemAttrs, { ignore: [...requireAttrs, 'x', 'y', 'transform'] });

        let pointValue = '';
        if (elemName === 'path') {
            pModeSelector.disabled = false;
            pointValue = convertPathValue(transformedP, precision, pointMode);
            outputValue = `<path d="${pointValue}"${attrsHTML}${lang === 'XML' ? ' /' : ''}>`;
        } else {
            pModeSelector.disabled = true;
            pModeSelector.value = 'relative';
            pointValue = convertPolygonValue(transformedP, precision);
            outputValue = `<polygon points="${pointValue}"${attrsHTML}${lang === 'XML' ? ' /' : ''}>`;
        }

        return outputValue;
    }

    const parsedElems = getParsedElems(inputStr, 'rect');
    const outputValue = parsedElems.map(genOutputValue).join('\n');
    outputElem.textContent = outputValue;
};

inputElem.addEventListener('input', convertProcess);
elemSelector.addEventListener('input', convertProcess);
langSelector.addEventListener('input', convertProcess);
decimalElem.addEventListener('input', convertProcess);
pModeSelector.addEventListener('input', convertProcess);