// add/remove numbers at the start of the strokes of all characters on the page
function setNumbers(x) {
	// if(x) add numbers else remove them
	var go, g, list, l;
	list = document.querySelectorAll("svg.acjk circle, svg.acjk text:not(.background)");
	if (x) {
		if (list && list.length) return;
		list = document.querySelectorAll("svg.acjk path[clip-path]");
		l = 0;
		go = 0;
		for (let k = 0; k < list.length; k++) {
			// several character svg can be in the page, do not set g outside the loop
			g = list[k];
			while (g.tagName != "svg") g = g.parentNode;
			if (g != go) { l = 0; go = g; }

			let clipAttr = list[k].getAttribute('clip-path');
			// Kiểm tra xem có phải là một phần của nét vẽ không (khớp c1, c3a, c3b...)
			let isStrokePart = clipAttr.match(/c([0-9]+)[a-z]?\)$/);

			if (isStrokePart) {
				// Xác định xem đây có phải là phần chính để đánh số không (c1 hoặc c3a)
				let isPrimary = clipAttr.match(/c[0-9]+a?\)$/);
				if (isPrimary) l++;

				// --- [CHANGE START] Set màu cho TẤT CẢ các phần của nét ---
				if (typeof window.getStrokeColor === 'function') {
					// Dùng chỉ số l hiện tại (l của 3b sẽ giống l của 3a)
					list[k].style.stroke = window.getStrokeColor(l);
				}
				// --- [CHANGE END] ---

				// Chỉ thực hiện vẽ số thứ tự cho phần chính
				if (isPrimary) {
					let a, c, d, e, cx, cy, cx1, cy1, cx2, cy2, m, s, p;
					// Màu cho label number (mặc định)
					let color1 = "#000", color2 = "#fff", color3 = "#000", fs = 40;

					a = list[k].getAttributeNS(null, "d");
					a = a.replace(/([0-9])[-]/g, "$1 -");
					a = a.replace(/^M[ ]*([0-9.-]+)[ ,]+([0-9.-]+)[ ]*H[ ]*([0-9.-]+)/, "M$1 $2L$3 $2");
					a = a.replace(/^M[ ]*([0-9.-]+)[ ,]+([0-9.-]+)[ ]*V[ ]*([0-9.-]+)/, "M$1 $2L$1 $3");
					c = a.match(/^M[ ]*([0-9.-]+)[ ,]+([0-9.-]+)[^0-9.-]+([0-9.-]+)[ ,]+([0-9.-]+)/);
					if (c && c.length) {
						cx1 = parseInt(c[1]);
						cy1 = parseInt(c[2]);
						cx2 = parseInt(c[3]);
						cy2 = parseInt(c[4]);
						d = Math.sqrt((cy2 - cy1) * (cy2 - cy1) + (cx2 - cx1) * (cx2 - cx1));
						if (d) {
							cx = cx1 + (cx2 - cx1) * fs / d / 2;
							cy = cy1 + (cy2 - cy1) * fs / d / 2;
						}
						else {
							cx = cx1;
							cy = cy1;
						}
						if (cx < (fs + (fs >> 3))) cx = fs + (fs >> 3);
						if (cy < (fs + (fs >> 3))) cy = fs + (fs >> 3);
						e = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
						e.setAttributeNS(null, "cx", cx);
						e.setAttributeNS(null, "cy", cy);
						e.setAttributeNS(null, "r", fs);
						e.setAttributeNS(null, "stroke", color1);
						e.setAttributeNS(null, "fill", color2);
						e.setAttributeNS(null, "stroke-width", Math.max(1, fs >> 3));
						p = list[k].style.getPropertyValue("--d");
						if (p) e.style.setProperty("--d", p);
						g.appendChild(e);
						e = document.createElementNS('http://www.w3.org/2000/svg', 'text');
						e.setAttributeNS(null, "x", cx);
						e.setAttributeNS(null, "y", cy + (fs >> 1));
						e.setAttributeNS(null, "text-anchor", "middle");
						e.setAttributeNS(null, "font-family", "arial");
						e.setAttributeNS(null, "font-weight", "normal");
						e.setAttributeNS(null, "fill", color3);
						e.setAttributeNS(null, "font-size", (fs >> 1) * 3);
						e.textContent = l;
						if (p) e.style.setProperty("--d", p);
						g.appendChild(e);
					}
				}
			}
		}

	}
	else if (list && list.length) {
		for (let k = 0; k < list.length; k++) list[k].parentNode.removeChild(list[k]);

		// --- [CHANGE START] Reset stroke colors when removing numbers ---
		let paths = document.querySelectorAll("svg.acjk path[clip-path]");
		for (let k = 0; k < paths.length; k++) {
			paths[k].style.removeProperty("stroke");
		}
		// --- [CHANGE END] ---
	}
}
