//#region node_modules/swiper/shared/ssr-window.esm.mjs
/**
* SSR Window 5.0.1
* Better handling for window object in SSR environment
* https://github.com/nolimits4web/ssr-window
*
* Copyright 2025, Vladimir Kharlampidi
*
* Licensed under MIT
*
* Released on: June 27, 2025
*/
function isObject$1(obj) {
	return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend$1(target = {}, src = {}) {
	const noExtend = [
		"__proto__",
		"constructor",
		"prototype"
	];
	Object.keys(src).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
		if (typeof target[key] === "undefined") target[key] = src[key];
		else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) extend$1(target[key], src[key]);
	});
}
var ssrDocument = {
	body: {},
	addEventListener() {},
	removeEventListener() {},
	activeElement: {
		blur() {},
		nodeName: ""
	},
	querySelector() {
		return null;
	},
	querySelectorAll() {
		return [];
	},
	getElementById() {
		return null;
	},
	createEvent() {
		return { initEvent() {} };
	},
	createElement() {
		return {
			children: [],
			childNodes: [],
			style: {},
			setAttribute() {},
			getElementsByTagName() {
				return [];
			}
		};
	},
	createElementNS() {
		return {};
	},
	importNode() {
		return null;
	},
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	}
};
function getDocument() {
	const doc = typeof document !== "undefined" ? document : {};
	extend$1(doc, ssrDocument);
	return doc;
}
var ssrWindow = {
	document: ssrDocument,
	navigator: { userAgent: "" },
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	},
	history: {
		replaceState() {},
		pushState() {},
		go() {},
		back() {}
	},
	CustomEvent: function CustomEvent() {
		return this;
	},
	addEventListener() {},
	removeEventListener() {},
	getComputedStyle() {
		return { getPropertyValue() {
			return "";
		} };
	},
	Image() {},
	Date() {},
	screen: {},
	setTimeout() {},
	clearTimeout() {},
	matchMedia() {
		return {};
	},
	requestAnimationFrame(callback) {
		if (typeof setTimeout === "undefined") {
			callback();
			return null;
		}
		return setTimeout(callback, 0);
	},
	cancelAnimationFrame(id) {
		if (typeof setTimeout === "undefined") return;
		clearTimeout(id);
	}
};
function getWindow() {
	const win = typeof window !== "undefined" ? window : {};
	extend$1(win, ssrWindow);
	return win;
}
//#endregion
//#region node_modules/swiper/shared/utils.mjs
function classesToTokens(classes = "") {
	return classes.trim().split(" ").filter((c) => !!c.trim());
}
function deleteProps(obj) {
	const object = obj;
	Object.keys(object).forEach((key) => {
		try {
			object[key] = null;
		} catch (e) {}
		try {
			delete object[key];
		} catch (e) {}
	});
}
function nextTick(callback, delay = 0) {
	return setTimeout(callback, delay);
}
function now() {
	return Date.now();
}
function getComputedStyle(el) {
	const window = getWindow();
	let style;
	if (window.getComputedStyle) style = window.getComputedStyle(el, null);
	if (!style && el.currentStyle) style = el.currentStyle;
	if (!style) style = el.style;
	return style;
}
function getTranslate(el, axis = "x") {
	const window = getWindow();
	let matrix;
	let curTransform;
	let transformMatrix;
	const curStyle = getComputedStyle(el);
	if (window.WebKitCSSMatrix) {
		curTransform = curStyle.transform || curStyle.webkitTransform;
		if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
		transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
	} else {
		transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
		matrix = transformMatrix.toString().split(",");
	}
	if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
	else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
	else curTransform = parseFloat(matrix[4]);
	if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
	else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
	else curTransform = parseFloat(matrix[5]);
	return curTransform || 0;
}
function isObject(o) {
	return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function isNode(node) {
	if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
	return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend(...args) {
	const to = Object(args[0]);
	for (let i = 1; i < args.length; i += 1) {
		const nextSource = args[i];
		if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
			const keysArray = Object.keys(Object(nextSource)).filter((key) => key !== "__proto__" && key !== "constructor" && key !== "prototype");
			for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
				const nextKey = keysArray[nextIndex];
				const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
				if (desc !== void 0 && desc.enumerable) if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey];
				else extend(to[nextKey], nextSource[nextKey]);
				else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
					to[nextKey] = {};
					if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey];
					else extend(to[nextKey], nextSource[nextKey]);
				} else to[nextKey] = nextSource[nextKey];
			}
		}
	}
	return to;
}
function setCSSProperty(el, varName, varValue) {
	el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({ swiper, targetPosition, side }) {
	const window = getWindow();
	const startPosition = -swiper.translate;
	let startTime = null;
	let time;
	const duration = swiper.params.speed;
	swiper.wrapperEl.style.scrollSnapType = "none";
	window.cancelAnimationFrame(swiper.cssModeFrameID);
	const dir = targetPosition > startPosition ? "next" : "prev";
	const isOutOfBound = (current, target) => {
		return dir === "next" && current >= target || dir === "prev" && current <= target;
	};
	const animate = () => {
		time = (/* @__PURE__ */ new Date()).getTime();
		if (startTime === null) startTime = time;
		const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
		let currentPosition = startPosition + (.5 - Math.cos(progress * Math.PI) / 2) * (targetPosition - startPosition);
		if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
		swiper.wrapperEl.scrollTo({ [side]: currentPosition });
		if (isOutOfBound(currentPosition, targetPosition)) {
			swiper.wrapperEl.style.overflow = "hidden";
			swiper.wrapperEl.style.scrollSnapType = "";
			setTimeout(() => {
				swiper.wrapperEl.style.overflow = "";
				swiper.wrapperEl.scrollTo({ [side]: currentPosition });
			});
			window.cancelAnimationFrame(swiper.cssModeFrameID);
			return;
		}
		swiper.cssModeFrameID = window.requestAnimationFrame(animate);
	};
	animate();
}
function getSlideTransformEl(slideEl) {
	return slideEl.querySelector(".swiper-slide-transform") || slideEl.shadowRoot && slideEl.shadowRoot.querySelector(".swiper-slide-transform") || slideEl;
}
function elementChildren(element, selector = "") {
	const window = getWindow();
	const children = [...element.children];
	if (window.HTMLSlotElement && element instanceof HTMLSlotElement) children.push(...element.assignedElements());
	if (!selector) return children;
	return children.filter((el) => el.matches(selector));
}
function elementIsChildOfSlot(el, slot) {
	const elementsQueue = [slot];
	while (elementsQueue.length > 0) {
		const elementToCheck = elementsQueue.shift();
		if (el === elementToCheck) return true;
		elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
	}
}
function elementIsChildOf(el, parent) {
	const window = getWindow();
	let isChild = parent.contains(el);
	if (!isChild && window.HTMLSlotElement && parent instanceof HTMLSlotElement) {
		isChild = [...parent.assignedElements()].includes(el);
		if (!isChild) isChild = elementIsChildOfSlot(el, parent);
	}
	return isChild;
}
function showWarning(text) {
	try {
		console.warn(text);
		return;
	} catch (err) {}
}
function createElement(tag, classes = []) {
	const el = document.createElement(tag);
	el.classList.add(...Array.isArray(classes) ? classes : classesToTokens(classes));
	return el;
}
function elementOffset(el) {
	const window = getWindow();
	const document = getDocument();
	const box = el.getBoundingClientRect();
	const body = document.body;
	const clientTop = el.clientTop || body.clientTop || 0;
	const clientLeft = el.clientLeft || body.clientLeft || 0;
	const scrollTop = el === window ? window.scrollY : el.scrollTop;
	const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
	return {
		top: box.top + scrollTop - clientTop,
		left: box.left + scrollLeft - clientLeft
	};
}
function elementPrevAll(el, selector) {
	const prevEls = [];
	while (el.previousElementSibling) {
		const prev = el.previousElementSibling;
		if (selector) {
			if (prev.matches(selector)) prevEls.push(prev);
		} else prevEls.push(prev);
		el = prev;
	}
	return prevEls;
}
function elementNextAll(el, selector) {
	const nextEls = [];
	while (el.nextElementSibling) {
		const next = el.nextElementSibling;
		if (selector) {
			if (next.matches(selector)) nextEls.push(next);
		} else nextEls.push(next);
		el = next;
	}
	return nextEls;
}
function elementStyle(el, prop) {
	return getWindow().getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
	let child = el;
	let i;
	if (child) {
		i = 0;
		while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
		return i;
	}
}
function elementParents(el, selector) {
	const parents = [];
	let parent = el.parentElement;
	while (parent) {
		if (selector) {
			if (parent.matches(selector)) parents.push(parent);
		} else parents.push(parent);
		parent = parent.parentElement;
	}
	return parents;
}
function elementTransitionEnd(el, callback) {
	function fireCallBack(e) {
		if (e.target !== el) return;
		callback.call(el, e);
		el.removeEventListener("transitionend", fireCallBack);
	}
	if (callback) el.addEventListener("transitionend", fireCallBack);
}
function elementOuterSize(el, size, includeMargins) {
	const window = getWindow();
	if (includeMargins) return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
	return el.offsetWidth;
}
function makeElementsArray(el) {
	return (Array.isArray(el) ? el : [el]).filter((e) => !!e);
}
function getRotateFix(swiper) {
	return (v) => {
		if (Math.abs(v) > 0 && swiper.browser && swiper.browser.need3dFix && Math.abs(v) % 90 === 0) return v + .001;
		return v;
	};
}
function setInnerHTML(el, html = "") {
	if (typeof trustedTypes !== "undefined") el.innerHTML = trustedTypes.createPolicy("html", { createHTML: (s) => s }).createHTML(html);
	else el.innerHTML = html;
}
//#endregion
export { setCSSProperty as C, getWindow as D, getDocument as E, now as S, showWarning as T, getSlideTransformEl as _, elementChildren as a, makeElementsArray as b, elementNextAll as c, elementParents as d, elementPrevAll as f, getRotateFix as g, extend as h, deleteProps as i, elementOffset as l, elementTransitionEnd as m, classesToTokens as n, elementIndex as o, elementStyle as p, createElement as r, elementIsChildOf as s, animateCSSModeScroll as t, elementOuterSize as u, getTranslate as v, setInnerHTML as w, nextTick as x, isObject as y };

//# sourceMappingURL=utils-Ci38QQtA.js.map