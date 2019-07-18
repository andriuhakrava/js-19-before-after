function beforeAfter(div){
	if (!div) return;
	let img = div.querySelectorAll('img');
	if (img.length < 2) return;
	let imgBefore = img[0];
	let imgAfter = img[1];
	div.classList.add('before-after');
	imgBefore.classList.add('img-before');
	imgAfter.classList.add('img-after');
	div.style.width = imgAfter.offsetWidth + 'px';
	
	let imgBeforeWrap = document.createElement('div');
	imgBeforeWrap.classList.add('img-before-wrap')
	imgBeforeWrap.style.width = '50%';
	imgBeforeWrap.style.height = imgAfter.offsetHeight + 'px';
	imgBefore.parentElement.insertBefore(imgBeforeWrap, imgAfter);
	imgBeforeWrap.appendChild(imgBefore);
	
	let handler = document.createElement('div');
	handler.classList.add('before-after-handler');
	handler.innerHTML = '<span></span>';
	imgAfter.parentElement.insertBefore(handler, imgAfter);
	handler.style.height = imgAfter.offsetHeight + 'px';
	handler.style.left = (div.clientWidth - handler.offsetWidth) / 2 + 'px';
	let handlerSpan = handler.querySelector('span');
	handlerSpan.style.left = (handler.offsetWidth - handlerSpan.offsetWidth) / 2 + 'px';
	handlerSpan.style.top = (handler.offsetHeight - handlerSpan.offsetHeight) / 2 + 'px';

	handler.addEventListener('mousedown', handlerMouseDown);
	if (!window.beforeAfterConfig){
		window.beforeAfterConfig = {};
		window.addEventListener('mousemove', windowMouseMove);
		window.addEventListener('mouseup', windowMouseUp);
	}

	imgBefore.ondragstart = function() { return false; }
	imgAfter.ondragstart = function(){ return false; }

	function handlerMouseDown(e){
		let shift = (handler.offsetWidth - e.target.offsetWidth) / 2;
		if (e.target.tagName === 'SPAN'){
			handler.mousePosX = (handler.offsetWidth - e.target.offsetWidth) / 2 + e.layerX;
		} else {
			handler.mousePosX = e.layerX;
		}

		handler.mousePosX = (e.target.tagName === 'SPAN' ? shift : 0) + e.layerX;
		window.beforeAfterConfig.handler = handler;
	}

	function windowMouseUp(e){
		if (window.beforeAfterConfig) window.beforeAfterConfig.handler = null;
	}

	function windowMouseMove(e){
		if (!window.beforeAfterConfig.handler) return;
		let x = e.pageX;
		let handler = window.beforeAfterConfig.handler;
		let div = getMainParent(handler);
		let offsetX = getOffset(div).left;
		let left = Math.min(Math.max(x - offsetX, 0), div.clientWidth) - handler.mousePosX;
		handler.style.left = left + 'px';
		div.querySelector('.img-before-wrap').style.width = left + handler.offsetWidth / 2 +	'px';
	}

	function getMainParent(elem){
		if (elem.classList.contains('before-after')) return elem;
		for (let parent = elem.parentElement; parent; parent = parent.parentElement){
			if (parent.classList.contains('before-after')) return parent;
		}
	}

	function getOffset(elem){
		let left = elem.offsetLeft;
		let top = elem.offsetTop;
		for (let parent = elem.offsetParent; parent; parent = parent.offsetParent){
			left += parent.offsetLeft;
			top += parent.offsetTop;
		}
		return {left, top};
	}
}

