let dicos = { Ja: null, Ko: null, ZhHans: null, ZhHant: null };
let hanviet = null;

function ucFirst(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
function lcFirst(s) {
	return s.charAt(0).toLowerCase() + s.slice(1);
}
function cleanData(e) {
	// don't use this function as an input handler because it disturbs asian language IME
	// remember \u200B (zero-length-space) is used in animCJK char lists
	// keep only the 1st convenient character if any
	// todo: keep also jamo
	let data = e.value;
	e.value = "";
	for (let c of data) if (c.codePointAt(0) >= 11904) { e.value = c; break; }
}
function hideSvg() {
	var list, k, km;
	list = document.querySelectorAll("#a svg.acjk");
	if (list && (km = list.length))
		for (k = 0; k < km; k++) list[k].style.visible = "none";
}
function scrollToOk() {
	var top, height, okTop;
	top = document.getElementById('a').offsetTop;
	okTop = document.getElementById('ok').offsetTop;
	height = document.getElementById('a').getBoundingClientRect().height;
	hideSvg(); // cosmetic
	if (window.innerHeight > (top + height)) window.scrollTo(0, 0);
	else window.scrollTo(0, okTop - 8);
}
function getStrokesFromAcjk(acjk) {
	let a = acjk.split(/[^0-9]+/u), n = 0;
	a.forEach(b => n += -(-b));
	return n;
}
function buildDicoContent(r) {
	let c, dec, hex, dico = "";
	c = r.character; // assume r has the character property
	dec = c.codePointAt(0);
	hex = dec.toString(16).padStart(5, '0');
	dico += "<dt>" + c + " U+" + hex + " &amp;#" + dec + ";</dt>";
	if (hanviet) {
		if (hanviet[c]) dico += "<dt>Hán-Việt</dt><dd class=\"hanviet\">" + hanviet[c].toUpperCase() + "</dd>";
		else if (dec >= 11904) dico += "<dt>Hán-Việt</dt><dd class=\"hanviet-missing\" title=\"Chưa có âm Hán-Việt cho ký tự này\">? <span class='hv-missing-hint'>Chưa có — xem kanji-bank/missing_hanviet.json để bổ sung</span></dd>";
	}
	if (ROMAN_MAP[c]) dico += "<dt>Phiên âm</dt><dd class=\"roman\">" + ROMAN_MAP[c] + "</dd>";
	if (Object.hasOwn(r, "pinyin")) dico += "<dt>Pinyin</dt><dd class=\"pinyin\">" + (r.pinyin + "").replace(/\([^\)]+\)/g, "").replace(/[ ]+/g, ", ") + "</dd>";
	if (Object.hasOwn(r, "on")) dico += "<dt>On</dt><dd class=\"on\">" + (r.on + "").replace(/,([^ ])/g, ", $1") + "</dd>";
	if (Object.hasOwn(r, "kun")) dico += "<dt>Kun</dt><dd class=\"kun\">" + (r.kun + "").replace(/,([^ ])/g, ", $1") + "</dd>";
	if (Object.hasOwn(r, "definition")) dico += "<dt>Definition</dt><dd class=\"definition\">" + r.definition + "</dd>";
	if (Object.hasOwn(r, "acjk")) dico += "<dt>Strokes</dt><dd class=\"strokes\">" + getStrokesFromAcjk(r.acjk) + "</dd>";
	if (Object.hasOwn(r, "radical")) dico += "<dt>Radical</dt><dd class=\"radical\">" + r.radical + "</dd>";
	if (Object.hasOwn(r, "decomposition")) dico += "<dt>Decomposition</dt><dd class=\"decomposition\">" + r.decomposition + "</dd>";
	if (Object.hasOwn(r, "acjk")) dico += "<dt>Acjk</dt><dd class=\"acjkDecomposition\">" + r.acjk + "</dd>";
	if (Object.hasOwn(r, "acjks")) dico += "<dt>Acjks</dt><dd class=\"acjksDecomposition\">" + r.acjks + "</dd>";
	return dico;
}
function langToDir(lang) {
	switch (lang) {
		case "ko": return "Ko";
		case "zh-Hans": return "ZhHans";
		case "zh-Hant": return "ZhHant";
		default: return "Ja";
	}
}
function getOneFromDico(c, langLabel) {
	for (let e of dicos[langLabel])
		if (e["character"] == c) return e;
	return null;
}
function endError(c, lang, dec) {
	let ul = document.getElementById("output");
	let li = document.createElement("li");
	let language;
	switch (lang) {
		case "zh-Hans": language = "simplified Chinese"; break;
		case "zh-Hant": language = "traditional Chinese"; break;
		case "ko": language = "Korean"; break;
		default: language = "Japanese";
	}
	li.classList.add("error");
	li.innerHTML = c + " not found in " + language + " repository!";
	ul.append(li);
	ul.scrollIntoView({ block: "nearest" });
}
function endOk(c, lang, dec, svg, dicoLine) {
	let ul = document.getElementById("output");
	let li = document.createElement("li");
	let cartouche = "<dl>" + buildDicoContent(dicoLine) + "</dl>";
	let roman = ROMAN_MAP[c] ? "<div class=\"pronunciation\">Phiên âm: " + ROMAN_MAP[c] + "</div>" : "";
	let hv = "";
	if (hanviet) {
		if (hanviet[c]) hv = "<div class=\"pronunciation hv\">Hán-Việt: " + hanviet[c].toUpperCase() + "</div>";
		else if (c.codePointAt(0) >= 11904 && !ROMAN_MAP[c]) hv = "<div class=\"pronunciation hv-missing\" title=\"Chưa có âm Hán-Việt\">Hán-Việt: ?</div>";
	}
	li.innerHTML = hv + roman + svg + cartouche;
	ul.append(li);
	setNumbers(document.querySelector('[name="numbers"]').checked);
	setColors(window.colorEnabled !== false);
	ul.scrollIntoView({ block: "nearest" });
}
function continueOk(c, lang, langLabel, dec, j, o) {
	let dicoLine = getOneFromDico(c, langLabel);
	if (dicoLine) {
		let zoo = (Object.hasOwn(dicoLine, "set") && dicoLine['set'].includes("bopomofo")) ? 1 : 0;
		fetch('svgs' + langLabel + (zoo ? "Zoo" : "") + "/" + dec + ".svg", o)
			.then(r => { if (!r.ok) throw r.statusText; return r.text(); })
			.then(s => { endOk(c, lang, dec, s, dicoLine); return true; })
			.catch(e => { console.log(e); endError(c, lang, dec) });
	}
	else endError(c, lang, dec);
}
function ok() {
	let c, dec, e, s, lang;
	e = document.getElementById("data");
	s = document.querySelector('[name="section"]:checked');
	lang = s ? s.getAttribute("data-lang") : "ja";
	document.getElementById("output").innerHTML = "";
	cleanData(e);
	c = e.value;
	if (c) {
		let kana, j, langLabel = langToDir(lang);
		let o = { cache: "no-cache" };
		dec = c.codePointAt(0);
		kana = (langLabel == "Ja") && (dec >= 12353) && (dec <= 12540);
		if (kana)
			fetch('svgs' + langLabel + "Kana/" + dec + ".svg", o)
				.then(r => { if (!r.ok) throw r.statusText; return r.text(); })
				.then(s => {
					// For kana, still try to find it in dictionary to get definition if it exists
					if (dicos[langLabel]) {
						let dicoLine = getOneFromDico(c, langLabel);
						endOk(c, lang, dec, s, dicoLine || { character: c });
					} else {
						fetch('dictionary' + langLabel + ".txt", o)
							.then(r => { if (!r.ok) throw r.statusText; return r.text(); })
							.then(j => {
								j = j.replace(/\}\n\{/ug, "},{");
								dicos[langLabel] = JSON.parse("[" + j + "]");
								let dicoLine = getOneFromDico(c, langLabel);
								endOk(c, lang, dec, s, dicoLine || { character: c });
							})
							.catch(() => endOk(c, lang, dec, s, { character: c }));
					}
					return true;
				})
				.catch(e => { console.log(e); endError(c, lang, dec) });
		else if (j = dicos[langLabel]) continueOk(c, lang, langLabel, dec, j, o);
		else fetch('dictionary' + langLabel + ".txt", o)
			.then(r => { if (!r.ok) throw r.statusText; return r.text(); })
			.then(j => {
				j = j.replace(/\}\n\{/ug, "},{");
				dicos[langLabel] = JSON.parse("[" + j + "]");
				continueOk(c, lang, langLabel, dec, j, o);
				return true;
			})
			.catch(e => { console.log(e) }); // just in case
	}
}
function doIt(c) {
	document.getElementById("data").value = c;
	ok();
}

function initSection() {
	let section = localStorage.getItem("section") ? localStorage.getItem("section") : "Ja",
		e = document.querySelector('[name="section"][value="' + section + '"]');
	if (e) {
		e.checked = true;
		document.documentElement.lang = e.getAttribute("data-lang");
		populateCharLists();
	}
}
function initDico() {
	let dico = (localStorage.getItem("dico") == "1") ? true : false;
	document.querySelector('[name="dico"]').checked = dico;
}
function initGrid() {
	// default ON (null means not set yet → default true)
	let grid = localStorage.getItem("grid") !== "0";
	document.querySelector('[name="grid"]').checked = grid;
}
function initNumbers() {
	// default ON (null means not set yet → default true)
	let numbers = localStorage.getItem("numbers") !== "0";
	document.querySelector('[name="numbers"]').checked = numbers;
}
function initXrays() {
	let xrays = (localStorage.getItem("xrays") == "1") ? true : false;
	document.querySelector('[name="xrays"]').checked = xrays;
}
function initSize() {
	let size;
	size = localStorage.getItem("size") ? localStorage.getItem("size") : "256";
	document.querySelector('[name="size"]').value = size;
	document.querySelector(':root').style.setProperty('--size', size + "px");
}
function initColor() {
	// default ON (null means not set yet → default true)
	let color = localStorage.getItem("color") !== "0";
	document.querySelector('[name="color"]').checked = color;
	window.colorEnabled = color;
}
function initAll() {
	initSection();
	initDico();
	initGrid();
	initNumbers();
	initColor();
	initXrays();
	initSize();
}
function changeSection() {
	let e = document.querySelector('[name="section"]:checked'),
		section, lang;
	if (e) {
		section = e.value;
		lang = e.getAttribute("data-lang");
		localStorage.setItem("section", section);
		document.documentElement.lang = lang;
		populateCharLists();
		ok();
	}
}
function changeDico() {
	let dico = document.querySelector('[name="dico"]').checked;
	localStorage.setItem("dico", dico ? "1" : "0");
}
function changeGrid() {
	let grid = document.querySelector('[name="grid"]').checked;
	localStorage.setItem("grid", grid ? "1" : "0");
}
function changeNumbers() {
	let numbers = document.querySelector('[name="numbers"]').checked;
	localStorage.setItem("numbers", numbers ? "1" : "0");
	setNumbers(numbers);
	// Colors are independent — reapply after numbers change
	setColors(window.colorEnabled !== false);
}
function changeColor() {
	let color = document.querySelector('[name="color"]').checked;
	localStorage.setItem("color", color ? "1" : "0");
	window.colorEnabled = color;
	setColors(color);
}
function changeXrays() {
	let xrays = document.querySelector('[name="xrays"]').checked;
	localStorage.setItem("xrays", xrays ? "1" : "0");
}
function changeSize() {
	let size = document.querySelector('[name="size"]').value;
	localStorage.setItem("size", size);
	document.querySelector(':root').style.setProperty('--size', size + "px");
}
function addCharHandlers(langLabel) {
	// No longer needed with new span-based approach
	// but kept for compatibility if needed, though we now handle clicks in endPopulateChars
}
function getcharListFromDico(langLabel, setLabel) {
	if (setLabel == "hiragana") return "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをんゔがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉゕゖっゃゅょゎ";
	if (setLabel == "katakana") return "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲンヴガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヷヸヹヺァィゥェォヵヶッャュョヮー";
	let s = "";
	for (let e of dicos[langLabel])
		if (e["set"].includes(setLabel)) s += e["character"];
	// sort by unicode
	// most of the time, it is already done, but not always
	let a = [...s];
	a.sort(function (x, y) { return x.codePointAt(0) - y.codePointAt(0); });
	return a.join('');
}
function endPopulateChars(langLabel) {
	if (dicos[langLabel]) {
		for (let qis of qi[langLabel]) {
			let e = document.querySelector('details:has(summary h3[id="' + lcFirst(langLabel) + ucFirst(qis[0]) + '"])');
			if (e) {
				let nav = e.querySelector('nav');
				let p = document.createElement('p');
				p.classList.add('charList');
				let s = getcharListFromDico(langLabel, qis[0]);

				// --- [CHANGE] Wrap each character in a span for better UI/UX ---
				for (let c of [...s]) {
					let span = document.createElement('span');
					span.textContent = c;
					span.addEventListener('click', () => doIt(c));
					p.append(span);
				}

				nav.before(p);
				let h3 = e.querySelector('h3');
				if (h3) {
					let len = [...s].length;
					h3.innerHTML = h3.innerHTML + " ( " + len + " character" + (len > 1 ? "s" : "") + ")";
				}
			}
		}
	}
}
function populateCharLists() {
	let langLabel = localStorage.getItem("section") ? localStorage.getItem("section") : "Ja";
	// if(dicos[langLabel]) assume populateCharLists() was already done for langLabel
	if (!dicos[langLabel]) {
		let o = { cache: "no-cache" };
		fetch('dictionary' + langLabel + ".txt", o)
			.then(r => { if (!r.ok) throw r.statusText; return r.text(); })
			.then(j => {
				// a dictionary contains one json per line
				// transform it in a global json
				j = j.replace(/\}\n\{/ug, "},{");
				dicos[langLabel] = JSON.parse("[" + j + "]");
				endPopulateChars(langLabel); return true;
			})
			.catch(e => { console.log(e) }); // just in case
	};
}
window.addEventListener("load", function () {
	// add a handler to #data input to do something when the user hits the return key
	document.getElementById("data").addEventListener("keyup", function (event) {
		event.preventDefault();
		if (event.keyCode == 13) ok();
	});
	// add a handler to #ok button to do something when the user hits it
	document.getElementById("ok").addEventListener("click", ok);
	// add other handlers
	document.querySelector('[name="section"][value="Ja"]').addEventListener("change", changeSection);
	document.querySelector('[name="section"][value="Ko"]').addEventListener("change", changeSection);
	document.querySelector('[name="section"][value="ZhHans"]').addEventListener("change", changeSection);
	document.querySelector('[name="section"][value="ZhHant"]').addEventListener("change", changeSection);
	document.querySelector('[name="dico"]').addEventListener("change", changeDico);
	document.querySelector('[name="grid"]').addEventListener("change", changeGrid);
	document.querySelector('[name="numbers"]').addEventListener("change", changeNumbers);
	document.querySelector('[name="color"]').addEventListener("change", changeColor);
	document.querySelector('[name="xrays"]').addEventListener("change", changeXrays);
	document.querySelector('[name="size"]').addEventListener("change", changeSize);
	initAll();
	// Load Hán-Việt data
	fetch('hanviet.json')
		.then(r => r.json())
		.then(j => hanviet = j)
		.catch(e => console.log('Hán-Việt data not found'));
});
