(function () {
    "use strict";

    S.gallery = function(element) {
		var instance = this;
		instance.element = S.get(element);

		S.attach(window, "load", function() {
			init(instance);
		});

		S.attach(window, "orientationchange", function() {
			init(instance);
		});

		// obtiene el indice de la siguiente imagen a mostrar
		this.next = function() {
			var i = instance.index || 0;
			if(i < instance.images.length - 1) {
				return i + 1;
			}
			return 0;
		};

		// obtiene el indice de la imagen anterior
		this.previous = function() {
			var i = instance.index || 0;
			if(i > 1) {
				return i - 1;
			}
			return instance.images.length - 1;
		};

		this.keyDown = function(e) {
			switch(e.keyCode) {
				case 37:
        			showImage(instance, instance.next());
					break;

				case 39:
        			showImage(instance, instance.previous()); 
					break;
			}
		};
	};

	function init(instance) {	
		instance.windowSize = S.getWindowSize();
		if(instance.windowSize.width < 600) {
			// si no es lo suficientemente grande, no hacer nada.
			return;
		}

		var images = S.getChildrenByTag(instance.element, "img");
		instance.images = images;

		for (var i = 0; i < images.length; i++) {
			var img = images[i];
			buildImage(instance, img, i);
		};
	}

	function buildImage(instance, img, i) {
		S.addClass(img, "thumbnail");
		(function(index) {
			img.onclick = function() {
				showImage(instance, index);
			}
		})(i);
	}

	// destruye la ventana modal y todos sus elementos
	function destroy(instance) {
		var layers = instance.foreLayers;
		for (var i = 0; i < layers.length; i++) {
			var layer = layers[i];
			S.removeFromBody(layer);
			layer = null;
		}

		S.removeFromBody(instance.bgLayer);
		instance.bgLayer = null;
		S.detach(window, "keydown", instance.keyDown);
	}

	function showImage(instance, index) {
		if(!instance.bgLayer) {
			instance.bgLayer = buildBgLayer("gallery bgLayer noselect");
			buildLayers(instance);
			S.attach(window, "keydown", instance.keyDown);
			window.scrollTo(0, 0);
		}

		var layer = instance.foreLayers[index];

		if(instance.foreLayer) {
			S.removeClass(instance.foreLayer, "lyVisible");
		}

		layer.style.display = "block";
		S.addClass(layer, "lyVisible");
		instance.foreLayer = layer;
		instance.index = index;
	}   

	// crea el layer oscuro de fondo detrás de la ventana.
    function buildBgLayer(style) {
        var bgLayer = document.createElement('div');
        bgLayer.className = style;
        bgLayer.style.height = S.getDocumentHeight() + "px";
        document.body.appendChild(bgLayer);
        return bgLayer;
    }

	function buildLayers(instance) {
		var images = instance.images;
		instance.foreLayers = [];

		for (var i = 0; i < images.length; i++) {
			var img = images[i];
			buildLayer(instance, i);
		};
	}

	function buildLayer(instance, index) {
		var layer = buildBgLayer("gallery forePanel");
		instance.foreLayers[index] = layer;

		var img = document.createElement("img");
		img.className = "foreImage";
		img.src = instance.images[index].src;
        layer.appendChild(img);

        // centrar a lo alto.
        var marginTop = (instance.windowSize.height / 2) - (img.height / 2);
        if(marginTop > 0) {
	      	img.style.marginTop = marginTop + "px";
	    }

        img.onclick = function(e) {
			// para que no se propague al layer y se cierre el visor.
			S.cancelBubble(e);
        	showImage(instance, instance.next());	        	
        }

        img.ontouchstart = function(e) {
        	instance.dragging = true;
        	e.preventDefault();
        	instance.touchStart = e.changedTouches[0].clientX;
        };

        // gestionar el evento move en vez de end para que 
        // responda inmediátamente
        img.ontouchmove = function(e) {
        	if(!instance.dragging) {
        		return;
        	}

        	var delta = instance.touchStart - e.changedTouches[0].clientX;
        	if(Math.abs(delta) < 10) {
        		return;
        	}	

			instance.dragging = false;
        	e.preventDefault();
		
        	if(delta > 0) {
        		showImage(instance, instance.next());
        	} else {
        		showImage(instance, instance.previous());        		
        	}
        };

        // al hacer click fuera de la imagen se destruye el visor.
		layer.onclick = function() {
			destroy(instance);
		};
	}

})();
   






















