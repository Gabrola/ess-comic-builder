/**
 * @desc main object for comic builder component
 * @package comicBuilder
 * @author
 * 		Amr Abosree
 * 		Mustafa A. Abdel-Tawwab Jr.
 * 		Youssef Gaber
 * @since 2012-05-14 
 */
var canvas;
var comicBuilder={
	/**
	 * Options 
	 */
	memesURL:'ajax/memes.ajax.php',
	canvasElementId:"canvasElement",
	container:null,
	canvasElement: null,
	width:false,
	height:false,
	panelHeight:230,
	cellWidth:325,
	rowsNumber:2,
	canvas:null,
	searchXHR:null,
	isTextSelected:false,
	lockRotation:false,
	separatorMode:0,
	mouseOverPanel:-1,
	separators: {},
	watermarkEnabled: false,
	extraHeight:24,
	noSeparators: false,
	category: '',
	searchQuery: '',
	/**
	 * init function for assigning events and setting up structure
	 */
	init:function(){
		/*
		 * setting stuff
		 */
		this.canvasElement = jQuery("#"+this.canvasElementId);
		this.container=this.canvasElement.parent();
		this.width=this.cellWidth*2;
		this.height=this.panelHeight*this.rowsNumber + this.extraHeight;
		
		canvas = new fabric.Canvas(this.canvasElementId, {backgroundColor: '#FFFFFF'});
		canvas.backgroundImageStretch = false;
		canvas.freeDrawingLineWidth = 3;
		canvas.setWidth(this.width);
		canvas.setHeight(this.height);
		this.newCanvas();
			
		/**
		 * events 
		 */
		canvas.observe('object:selected', function(e) {
			comicBuilder.updateLayers();
			if(e.target instanceof fabric.Text){
				comicBuilder.isTextSelected = true;
				comicBuilder.textTool(true);
			} else {
				comicBuilder.isTextSelected = false;
				comicBuilder.textTool(false);
			}
		});
		canvas.observe('mouse:up', function(e) {
			if (comicBuilder.separatorMode == 2) {
				comicBuilder.addHorizontalSeparator(Math.floor(canvas.getPointer(e.e).y / comicBuilder.panelHeight));
			}
			else if (comicBuilder.separatorMode == 1) {
				comicBuilder.addVerticalSeparator(Math.floor(canvas.getPointer(e.e).y / comicBuilder.panelHeight));
			}
		});
		
		canvas.observe('selection:cleared', function(e) {
			comicBuilder.updateLayers();
			comicBuilder.isTextSelected = false;
			comicBuilder.textTool(false);
		});
		
		canvas.observe('selection:created', function(e) {
			canvas.getActiveGroup().forEachObject(function(o) {
				if(o instanceof fabric.Line){
					canvas.getActiveGroup().remove(o);
				}
			});
			
			comicBuilder.updateLayers();
			
			if(canvas.getActiveGroup().objects.length == 1){
				var o = canvas.getActiveGroup().objects[0];
				canvas.discardActiveGroup();
				canvas.setActiveObject(o);
				if(o instanceof fabric.Text){
					comicBuilder.isTextSelected = true;
					comicBuilder.textTool(true);
				} else {
					comicBuilder.isTextSelected = false;
					comicBuilder.textTool(false);
				}

				canvas.bringToFront(o);
			}
		});
		
		jQuery(canvas.upperCanvasEl).mousemove(function(e) {
			var newPanelIndex = Math.floor(e.offsetY / comicBuilder.panelHeight);
			
			if(comicBuilder.separatorMode != 0){
				if(newPanelIndex != comicBuilder.mouseOverPanel){
					comicBuilder.clearGuidelines();
					
					if(comicBuilder.separatorMode == 1)
						comicBuilder.addVerticalSeparator(newPanelIndex, true);
					else
						comicBuilder.addHorizontalSeparator(newPanelIndex, true);
					
					comicBuilder.mouseOverPanel = newPanelIndex;
				}
			}
		});
		
		jQuery(".categoryImage").click(function(event){
			comicBuilder.category = $(event.target).attr('data-original-title');
			comicBuilder.loadMemes();
			if(guiders._guiders[guiders._currentGuiderID].next == "3")
				guiders.next();
		});
		var keyupTimeout=false;
		jQuery(".searchQuery").keyup(function(){
			if($(".searchQuery").val().length < 1)
				return;
			
			if(comicBuilder.searchQuery == $(".searchQuery").val())
				return;
			
			comicBuilder.searchQuery = $(".searchQuery").val();
			if(keyupTimeout) window.clearTimeout(keyupTimeout);
			keyupTimeout=window.setTimeout(function(){comicBuilder.loadMemes();},500);
		});
		var cnvs = this.canvasElement;
		this.container.droppable({
			accept: '.memeImage',
			drop: function(event, ui) {
				var src = ui.draggable.attr("src");
				var oImg;
				var memeTitle=ui.draggable.attr("alt");
				fabric.Image.fromURL(src, function(img) {
					var width = img.width;
					var height = img.height;
					
					var MaxHeight = comicBuilder.panelHeight;
					var MaxWidth = comicBuilder.width;

					if(width > MaxWidth || height > MaxHeight){
						var WidthPercentage = MaxWidth / width;
						var HeightPercentage = MaxHeight / height;

						width *= Math.min(WidthPercentage, HeightPercentage);
						height *= Math.min(WidthPercentage, HeightPercentage);
					}
					
					oImg = img.set({title: memeTitle, left: ui.offset.left - jQuery(cnvs).offset().left + (width / 2), top: ui.offset.top - jQuery(cnvs).offset().top + (height / 2)})			
					oImg.scaleToWidth(width);
					canvas.add(oImg);
					canvas.renderAll();
					comicBuilder.updateLayers();
					if(guiders._guiders[guiders._currentGuiderID].next == "4")
						guiders.next();
				});
			}
		});
		jQuery("#btnDraw").click(function() {
			if($(this).hasClass('active')){
				comicBuilder.resetTools();
			} else {
				comicBuilder.resetTools();
				$('.freeHand').show();
				$(this).addClass('active');
				canvas.isDrawingMode = !canvas.isDrawingMode;
				if(guiders._guiders[guiders._currentGuiderID].next == "5")
					guiders.next();
			}
			
			if(canvas.isDrawingMode)
				canvas.deactivateAll();
		});
		
		jQuery("#btnTour").click(function() {
			guiders.show('1');
		});

		jQuery("#btnHorizontal").click(function() {
			jQuery("#btnHorizontal").toggleClass('active');
			if (comicBuilder.separatorMode == 2){
				comicBuilder.separatorMode = 0
				comicBuilder.panelSeparatorMode(false);
			} else if (comicBuilder.separatorMode == 1){
				jQuery("#btnVertical").toggleClass('active');
				comicBuilder.separatorMode = 2;
				comicBuilder.panelSeparatorMode(true);
			}
			else { 
				comicBuilder.separatorMode = 2;
				comicBuilder.panelSeparatorMode(true);
			}
			
			comicBuilder.clearGuidelines();
		});

		jQuery("#btnVertical").click(function() {
			jQuery("#btnVertical").toggleClass('active');
			if (comicBuilder.separatorMode == 1) {
				comicBuilder.separatorMode = 0
				comicBuilder.panelSeparatorMode(false);
			} else if (comicBuilder.separatorMode == 2){
				jQuery("#btnHorizontal").toggleClass('active');
				comicBuilder.separatorMode = 1;
				comicBuilder.panelSeparatorMode(true);
			}
			else {
				comicBuilder.separatorMode = 1;
				comicBuilder.panelSeparatorMode(true);
			}
			comicBuilder.clearGuidelines();
		});

		jQuery("#btnAddPanel").click(function() {
			comicBuilder.addPanel();
		});

		jQuery("#btnRemovePanel").click(function() {
			comicBuilder.removePanel();
		});

		jQuery("#btnPanelHeight").click(function() {
			newHeight = prompt('Enter new height in pixels...', comicBuilder.panelHeight);
			if(newHeight > 0){
				comicBuilder.panelHeight = newHeight;
				comicBuilder.redrawPanels();
			}
		});
		
		jQuery("#btnRotation").click(function() {
			comicBuilder.lockRotation = !comicBuilder.lockRotation;
			jQuery("#btnRotation").toggleClass('active');
			
			if(comicBuilder.lockRotation)
				jQuery("#btnRotation").attr('data-original-title', 'Enable Rotation');
			else
				jQuery("#btnRotation").attr('data-original-title', 'Disable Rotation');
			
			comicBuilder.updateLayers();
		});
		
		jQuery("#btnWatermark").click(function() {
			comicBuilder.watermarkEnabled = !comicBuilder.watermarkEnabled;
			jQuery("#btnWatermark").toggleClass('active');
			comicBuilder.resetWatermark();
			
			if(comicBuilder.watermarkEnabled)
				jQuery("#btnWatermark").attr('data-original-title', 'Disable Watermark');
			else
				jQuery("#btnWatermark").attr('data-original-title', 'Enable Watermark');
		});
		
		jQuery("#btnText").click(function() {
			if($(this).hasClass('active')){
				comicBuilder.resetTools();
			} else {
				comicBuilder.resetTools();
				$('.textTool').show();
				$(this).addClass('active');
				if(guiders._guiders[guiders._currentGuiderID].next == "8")
					guiders.next();
			}
		});
		
		jQuery(".textAdd").click(function() {
			var Text = $('.textString').val();
			var Font = $('.fontValue').val();
			var Size = $('.fontSize').val();
			var Color = $('.fontColor').val();
			var StrokeColor = $('.strokeColor').val();
			var StrokeWidth = $('.strokeSize').val();
			var Bold =  $('.fontBold').prop('checked');
			var Italic =  $('.fontItalic').prop('checked');
			
			if(Text.length < 1)
				return;
			
			if(Text.charCodeAt(0) >= 1536)
				Text = String.fromCharCode('8235') + Text;
			 else
				Text = String.fromCharCode('8234') + Text;
			
			var textObj = new fabric.Text(Text, {
				fontFamily: Font,
				left: comicBuilder.width / 2,
				top: comicBuilder.height / 2,
				fontSize: Size,
				textAlign: "left",
				fill: Color,
				strokeStyle: StrokeColor,
				strokeWidth: StrokeWidth,
				bold: Bold,
				italic: Italic
			});
			
			textObj.title = Text;
			canvas.add(textObj);
			canvas.renderAll();
			comicBuilder.updateLayers();
		});
		
		jQuery(".textString").keyup(function(){
			var text = $(".textString").val();
			if(text.length < 1){
				$(".textString").attr('dir', 'ltr');
				return;
			}
			
			if(text.charCodeAt(0) >= 1536){
				$(".textString").attr('dir', 'rtl');
				text = String.fromCharCode('8235') + text;
			} else {
				$(".textString").attr('dir', 'ltr');
				text = String.fromCharCode('8234') + text;
			}
			
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.setText(text);
				object.set('title', text);
				canvas.renderAll();
				comicBuilder.updateLayers();
			}
		});
		
		jQuery(".fontValue").change(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.fontFamily = $(".fontValue").val();
				canvas.renderAll();
			}
		});
		
		$('.fontColor').colorpicker().on('changeColor', function(ev){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.fill = ev.color.toHex();
				canvas.renderAll();
			}
		});
		
		jQuery(".fontSize").keyup(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.fontSize = $(".fontSize").val();
				canvas.renderAll();
			}
		});
		
		jQuery(".fontBold").change(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.bold = $(".fontBold").prop('checked');
				canvas.renderAll();
			}
		});
		
		jQuery(".fontItalic").change(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.italic = $(".fontItalic").prop('checked');
				canvas.renderAll();
			}
		});
		
		$('.strokeColor').colorpicker().on('changeColor', function(ev){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.strokeStyle = ev.color.toHex();
				canvas.renderAll();
			}
		});
		
		jQuery(".strokeSize").keyup(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.strokeWidth = $(".strokeSize").val();
				canvas.renderAll();
			}
		});
		
		jQuery("#btnLayers").click(function(){
			if($(this).hasClass('active')){
				comicBuilder.resetTools();
			} else {
				comicBuilder.resetTools();
				$('.layesTable').show();
				$(this).addClass('active');
			}
		});
		
		jQuery(".applyTemplate").click(function(){
			var Template = $('.templateFile').val();
			
			if(Template != ""){
				comicBuilder.newCanvasTemplate('templates/' + Template);
			}
		});
		
		jQuery(canvas.upperCanvasEl).attr("tabindex", "0").mousedown(function(e){
			$(this).focus();
			
			if(e.button == 2){
				if(object = canvas.findTarget(e)){
					if(active = canvas.getActiveObject()){
						if(object != active)
							canvas.deactivateAll();
					}
					
					if(active = canvas.getActiveGroup())
						if(object != active)
							canvas.deactivateAll();
					
					
					if(object instanceof fabric.Group){
						object.activateAllObjects();
						canvas.setActiveGroup(object);
					} else {
						object.setActive(true);
						canvas.setActiveObject(object);
					}
				} else {
					canvas.deactivateAll();
				}
			}
			
			return false;
		}).keydown(function(event){
			//Delete Shortcut
			if(event.keyCode == 46)
				comicBuilder.removeSelected();
			
			//PageUp & PageDown
			else if(event.keyCode == 33)
				comicBuilder.layerUp();
			else if(event.keyCode == 34)
				comicBuilder.layerDown();
			
			//Keyboard Arrows Movement
			else if(event.keyCode <= 40 || event.keyCode >= 37){
				if (canvas.getActiveObject()) obj = canvas.getActiveObject();
				else if (canvas.getActiveGroup()) obj = canvas.getActiveGroup();
				else return;
				if (event.ctrlKey) speed = 1;
				else if (event.shiftKey) speed = 10;
				else speed = 5;
				switch (event.keyCode){
					case 37:
						if (!obj.lockMovementX)
							obj.setLeft(obj.getLeft() - speed);
						break;
					case 38:
						if (!obj.lockMovementY)
							obj.setTop(obj.getTop() - speed);
						break;
					case 39:
						if (!obj.lockMovementX)
							obj.setLeft(obj.getLeft() + speed);
						break;
					case 40:
						if (!obj.lockMovementY)
							obj.setTop(obj.getTop() + speed);
						break;
				}
				
				obj.setCoords();
				canvas.renderAll();
			}
			
			//Flipping Shortcuts
			if(event.altKey){
				if (!canvas.getActiveObject())
					return;
				
				if(event.keyCode == 72)
					comicBuilder.flipHorizontal();
				else if(event.keyCode == 86)
					comicBuilder.flipVertical();
			}
			event.preventDefault();
		}).mouseup(function(e){
			if(canvas.isDrawingMode && e.button == 0) {
				if(guiders._guiders[guiders._currentGuiderID].next == "6")
					guiders.next();
			}
		});
		jQuery("#btnClear").click(function(){comicBuilder.newCanvas()});
		jQuery("#btnPicture").click(function(){
			jQuery("#inputFileHandler").trigger("click")
		});
		jQuery("#inputFileHandler").change(function(e){
			if(e.target.files.length>0){
				reader = new FileReader;
			    reader.onload = function(event) {
			        var img = new Image;
			        img.onload = function() {
			        	fabric.Image.fromURL(img.src, function(img) {
							var width = img.width;
							var height = img.height;
							var maxDimensions = 500;

							if(width > maxDimensions || height > maxDimensions){
								var percentage = maxDimensions / Math.max(width, height);
								width *= percentage;
							}

							oImg = img.set({left: 100 , top:100,title:"Local Image"});
							oImg.scaleToWidth(width);
							canvas.add(oImg);
							canvas.renderAll();
							comicBuilder.updateLayers();
						});
			        };
			        img.src = event.target.result;
			    };
			    reader.readAsDataURL(e.target.files[0]);
		   }
		});
		jQuery(".addImageSubmit").click(function(){
			//validating url
			$('.imageURL').popover('hide');
			var url=jQuery(".imageURL").val();
			if(url){
				jQuery(".imageURL").attr("disabled","disabled");
				var img = new Image;
				jQuery(".loadingExternalImage .loadingGif").show();
				jQuery.ajax({
					'url':'ajax/getimage.ajax.php',
					'data':{
						'image_url': encodeURIComponent($.base64.encode(url))
					},
					'dataType': 'json',
					'success':function(resp){
						if(resp.success){
							img.onload = function() {
					        	fabric.Image.fromURL(img.src, function(img) {
									var width = img.width;
									var height = img.height;
									var maxDimensions = 500;
									
									if(width > maxDimensions || height > maxDimensions){
										var percentage = maxDimensions / Math.max(width, height);
										width *= percentage;
									}
									oImg = img.set({left: 100 , top:100,title:"External Image"});
									oImg.scaleToWidth(width);
									canvas.add(oImg);
									canvas.renderAll();
									comicBuilder.updateLayers();
								});
								jQuery(".imageURL").removeAttr("disabled").val("");
								jQuery("#addImageModal").modal("hide");
								jQuery(".imageURL").val("");
								jQuery(".loadingExternalImage .loadingGif").hide();
						    };
						    img.onerror=function(){
								jQuery(".imageURL").removeAttr("disabled");
								$('.imageURL').popover('show');
								jQuery(".imageURL").val("");
								jQuery(".loadingExternalImage .loadingGif").hide();
						    }
							img.src=resp.message;
						}else{
							jQuery(".imageURL").removeAttr("disabled");
							$('.imageURL').popover('show');
							jQuery(".loadingExternalImage .loadingGif").hide();
						}
					}
				});
				
			}
		});
		jQuery(".addImageClose").click(function(){
			jQuery(".imageURL").val("");
			jQuery(".imageURL").removeAttr("disabled");
			$('.imageURL').popover('hide');
		});
		jQuery(".removeLayer").live("click",function(){
			comicBuilder.updateLayers();
			var objectIndex=parseInt(jQuery(this).parents("tr:first").attr("rel"));
			var canvasObjects=canvas.getObjects();
			if(canvasObjects[objectIndex]){
				canvas.remove(canvasObjects[objectIndex]);
				comicBuilder.updateLayers();
			}
			comicBuilder.textTool(false);
		});
		
		jQuery(".moveLayerUp").live("click",function(){
			comicBuilder.layerUp();
		});
		
		jQuery(".moveLayerDown").live("click",function(){
			comicBuilder.layerDown();
		});
		
		jQuery("#btnPreview").click(function(){
			if (!fabric.Canvas.supports('toDataURL')) {
				alert('Sorry, your browser is not supported.');
		    }
		    else {
				canvas.deactivateAll();
				canvas.forEachObject(function(o){
					if(o.get("title") == "||Watermark||"){
						canvas.bringToFront(o);
					}
				});
				window.open(canvas.toDataURL('png'), "");
				canvas.forEachObject(function(o){
					if(o.get("title") == "||Watermark||"){
						canvas.sendToBack(o);
					}
				});
				canvas.renderAll();
		    }
			
		});
		
		/*jQuery("#btnScrollable").click(function(){
			jQuery("#btnScrollable").toggleClass('active');
			
			if($('.canvasArea').css('overflow') == "auto"){
				$('.canvasArea').css('overflow', 'visible');
				$('.canvasArea').css('height', 'auto');
				$('.canvasArea').css('min-height', '484px');
				$('.canvasContainer').css('width', '650px');
			} else {
				$('.canvasArea').css('overflow', 'auto');
				$('.canvasArea').css('height', '484px');
				$('.canvasArea').css('min-height', '0');
				$('.canvasContainer').css('width', '670px');
			}
		});*/
		
		jQuery("#btnHideGrids").click(function(){
			comicBuilder.noSeparators = !comicBuilder.noSeparators;
			$("#btnHideGrids").toggleClass('active');
			comicBuilder.redrawPanels();
		});
		
		$(".selectObject").live("click",function(){
			var objectIndex=parseInt(jQuery(this).parents("tr:first").attr("rel"));
			var canvasObjects=canvas.getObjects();
			if(canvasObjects[objectIndex]){
				canvas.forEachObject(function(obj){
					obj.setActive(false);
				});
				canvasObjects[objectIndex].setActive(true);
				comicBuilder.updateLayers();
				canvas.renderAll();
			}
			
		});
		
		$('.freeHandColor').colorpicker().on('changeColor', function(ev){
			canvas.freeDrawingColor = ev.color.toHex();
		});
		
		$('.freeHandThickness').keyup(function(event){
			if(event.target.value > 0){
				canvas.freeDrawingLineWidth = event.target.value;
			}
		});
		
		/**
		 * Initializations
		 */
		
		$("[rel=tooltip]").tooltip();
		$('.imageURL').popover({
			animation:true,
			title:"Error",
			content:"Couldn't load image, please check if the link is correct and reachable",
			trigger:'manual'
		});
		$('.colorPicker').colorpicker({format: 'hex'});
		
		$(canvas.upperCanvasEl).contextMenu(
			[ 
				{'Flip Horizontally <span style="float:right;">Alt+H</span>':
					{
						icon: 'img/fliph.png',
						className: 'flipHorizontalItem',
						onclick: comicBuilder.flipHorizontal
					}
				},
				{'Flip Vertically <span style="float:right;">Alt+V</span>':
					{
						icon: 'img/flipv.png',
						className: 'flipVerticalItem',
						onclick: comicBuilder.flipVertical
					}
				},
				{'Expand to Pane':
					{
						className: 'expandPaneItem',
						onclick: function(){comicBuilder.expandToPane();}
					}
				},
				{'Expand to Panel':
					{
						className: 'expandPanelItem',
						onclick: function(){comicBuilder.expandToPanel();}
					}
				},
				{'Use as Background':
					{
						className: 'useBackgroundItem',
						onclick: function(){ 
							if(object = canvas.getActiveObject()){
								if(object instanceof fabric.Image){
									comicBuilder.newCanvasTemplate(object.getSrc());
								}
							}
						}
					}
				},
				{'Delete <span style="float:right;">Del</span>':
					{
						icon: 'img/delete.png',
						className: 'deleteItem',
						onclick: function(){comicBuilder.removeSelected();}
					}
				},
				{'New Comic':
					{
						className: 'clearItem',
						onclick: function(){comicBuilder.newCanvas();}
					}
				}
			],
			{ 
				beforeShow: function(){
					if(canvas.getActiveObject()){
						$('.flipHorizontalItem').show().removeClass('context-menu-item-disabled');
						$('.flipVerticalItem').show().removeClass('context-menu-item-disabled');
						$('.deleteItem').show().removeClass('context-menu-item-disabled');
						$('.clearItem').hide();
						$('.expandPaneItem').show().addClass('context-menu-item-disabled');
						$('.expandPanelItem').show().addClass('context-menu-item-disabled');
						$('.useBackgroundItem').show().addClass('context-menu-item-disabled');
					} else if(canvas.getActiveGroup()) {
						$('.flipHorizontalItem').show().addClass('context-menu-item-disabled');
						$('.flipVerticalItem').show().addClass('context-menu-item-disabled');
						$('.deleteItem').show();
						$('.clearItem').hide();
						$('.expandPaneItem').show().addClass('context-menu-item-disabled');
						$('.expandPanelItem').show().addClass('context-menu-item-disabled');
						$('.useBackgroundItem').show().addClass('context-menu-item-disabled');
					} else {
						$('.flipHorizontalItem').hide();
						$('.flipVerticalItem').hide();
						$('.deleteItem').hide();
						$('.clearItem').show();
						$('.expandPaneItem').hide();
						$('.expandPanelItem').hide();
						$('.useBackgroundItem').hide();
					}
					
					if(canvas.getActiveObject() instanceof fabric.Image){
						$('.expandPaneItem').show().removeClass('context-menu-item-disabled');
						$('.expandPanelItem').show().removeClass('context-menu-item-disabled');
						$('.useBackgroundItem').show().removeClass('context-menu-item-disabled');
					}
					
					return true;
				},
				theme: 'vista' 
			});
	},
	/**
	 * clears the canvas
	 * @author Yousif
	 */
	newCanvas:function(){
		$('.panelTool').attr('disabled', false);
		this.noSeparators = false;
		canvas.clear();
		canvas.setBackgroundImage();
		this.height=this.panelHeight*this.rowsNumber + this.extraHeight;
		this.width=this.cellWidth*2;
		canvas.setHeight(this.height);
		canvas.setWidth(this.width);
		this.resetWatermark();
		this.resetLines();
		
		fabric.Image.fromURL('img/stamp.png', function(img) {
			oImg = img.set({left: comicBuilder.width / 2, top: comicBuilder.height / 2, title: "ESS Stamp", selectable: true});
			oImg.scaleToWidth(150);
			canvas.add(oImg);
			canvas.renderAll();
			comicBuilder.updateLayers();
		});
	},
	newCanvasTemplate:function(templateFile){
		$('.panelTool').attr('disabled', true);
		this.noSeparators = true;
		this.separators = {};
		canvas.clear();
		
		canvas.setBackgroundImage(templateFile, function(img) {
			var width = img.width;
			var height = img.height;
			
			canvas.backgroundImageStretch = false;
			if(width > 650){
				canvas.backgroundImageStretch = true;
				var percentage = 650 / width;
				width *= percentage;
				height *= percentage;
			}
			
			var ExtraHeight = width * comicBuilder.extraHeight / 650;
			comicBuilder.width = width;
			comicBuilder.height = height + ExtraHeight;
			canvas.setWidth(comicBuilder.width);
			canvas.setHeight(comicBuilder.height);
			comicBuilder.resetWatermark();
		
			fabric.Image.fromURL('img/stamp.png', function(img) {
				oImg = img.set({left: comicBuilder.width / 2, top: comicBuilder.height / 2, title: "ESS Stamp", selectable: true});
				oImg.scaleToWidth(150);
				canvas.add(oImg);
				canvas.renderAll();
				comicBuilder.updateLayers();
			});
		});
	},
	resetWatermark:function(){
		canvas.forEachObject(function(o){
			if(o.title == "||Watermark||")
				canvas.remove(o);
		});
		
		canvas.setOverlayImage('img/footer.png', function(img){
			var width = img.width;
			var height = img.height;
			var percentage = comicBuilder.width / width;
			width *= percentage;
			height *= percentage;
			img.width = width;
			img.height = height;
			return img;
		});
		
		if(!comicBuilder.watermarkEnabled)
			return;
		
		fabric.Image.fromURL('img/watermark.png', function(img) {
			var width = img.width;
			var height = img.height;

			if(height > comicBuilder.height){
				var percentage = comicBuilder.height / height;
				width *= percentage;
				height *= percentage;
			}
			oImg = img.set({left: comicBuilder.width / 2 , top: comicBuilder.height / 2, title: "||Watermark||", selectable: false, coreItem: true});
			oImg.scaleToWidth(width);
			canvas.add(oImg);
			canvas.sendToBack(oImg);
			
			canvas.renderAll();
			comicBuilder.updateLayers();
		});
	},
	expandToPane:function(){
		if(object = canvas.getActiveObject()){
			if(object instanceof fabric.Image){
				y = object.getTop() - (object.currentHeight / 2);
				paneIndex = Math.floor(y / comicBuilder.panelHeight);
				if(paneIndex == -1) paneIndex++;
				ScaleX = comicBuilder.width / object.width;
				ScaleY = comicBuilder.panelHeight / object.height;
				object.selectable = false;
				object.scaleX = ScaleX;
				object.scaleY = ScaleY;
				object.setLeft(comicBuilder.width / 2);
				object.setTop((paneIndex * comicBuilder.panelHeight) + (comicBuilder.panelHeight / 2));
				
				object.setAngle(0);
				object.setCoords();
				canvas.renderAll();
			}
		}
	},
	expandToPanel:function(){
		if(object = canvas.getActiveObject()){
			if(object instanceof fabric.Image){
				x = object.getLeft() - (object.currentWidth / 2);
				y = object.getTop() - (object.currentHeight / 2);
				paneIndex = Math.floor(y / comicBuilder.panelHeight);
				panelIndex = Math.floor(x / comicBuilder.cellWidth);
				if(paneIndex == -1) paneIndex++;
				if(panelIndex == -1) panelIndex++;
				ScaleX = comicBuilder.cellWidth / object.width;
				ScaleY = comicBuilder.panelHeight / object.height;
				object.selectable = false;
				object.scaleX = ScaleX;
				object.scaleY = ScaleY;
				object.setLeft((panelIndex * comicBuilder.cellWidth) + (comicBuilder.cellWidth / 2));
				object.setTop((paneIndex * comicBuilder.panelHeight) + (comicBuilder.panelHeight / 2));
				
				object.setAngle(0);
				object.setCoords();
				canvas.renderAll();
			}
		}
	},
	resetLines:function(){
		canvas.forEachObject(function(o){
			if(o instanceof fabric.Line)
				canvas.remove(o);
		});
		
		this.separators = {};
		
		for(var i = 0; i < this.rowsNumber; i++){
			this.addVerticalSeparator(i);
			if(i != this.rowsNumber - 1)
				this.addHorizontalSeparator(i);
		}
	},
	addPanel:function(){
		if(this.separators['v' + (comicBuilder.rowsNumber - 1)]){
			comicBuilder.rowsNumber++;
			this.height=this.panelHeight*this.rowsNumber + this.extraHeight;
			canvas.setHeight(this.height);
			comicBuilder.resetWatermark();
			this.addHorizontalSeparator(comicBuilder.rowsNumber - 2);
		}
		else
			this.addVerticalSeparator(comicBuilder.rowsNumber - 1);
		
		canvas.renderAll();
	},
	removePanel:function(){
		var hIndex = 'h'+(comicBuilder.rowsNumber - 2);
		var vIndex = 'v'+(comicBuilder.rowsNumber - 1);
		
		if(vLine = this.separators[vIndex]){
			canvas.remove(vLine);
			delete this.separators[vIndex];
		} else if(hLine = this.separators[hIndex]){
			if(comicBuilder.rowsNumber == 1)
				return;
			
			comicBuilder.rowsNumber--;
			canvas.remove(hLine);
			delete this.separators[hIndex];
			this.height=this.panelHeight*this.rowsNumber + this.extraHeight;
			canvas.setHeight(this.height);
			comicBuilder.resetWatermark();
		}
		canvas.renderAll();
		this.updateLayers();
	},
	redrawPanels:function(){
		canvas.forEachObject(function(o){
			if(o instanceof fabric.Line)
				canvas.remove(o);
		});
		
		this.height=this.rowsNumber * this.panelHeight + this.extraHeight;
		canvas.setHeight(this.height);
		comicBuilder.resetWatermark();
		
		if(!comicBuilder.noSeparators){
			for(var index in this.separators){
				var line = this.separators[index];
				delete this.separators[index];
				if(line.type == 'h'){
					this.addHorizontalSeparator(line.panel);
				} else {
					this.addVerticalSeparator(line.panel);
				}
			}
		}
		
		canvas.renderAll();
	},
	flipHorizontal:function(){
		if(object = canvas.getActiveObject()){
			object.flipX = !object.flipX;
			canvas.renderAll();
		}
	},
	flipVertical:function(){
		if(object = canvas.getActiveObject()){
			object.flipY = !object.flipY;
			canvas.renderAll();
		}
	},
	/**
	 * loads memes images with ajax
	 */
	loadMemes:function(){
		jQuery(".loadingGif").show();
		if(this.searchXHR)this.searchXHR.abort();
		this.searchXHR=jQuery.ajax({
			'url':this.memesURL,
			'data':{
				'category': comicBuilder.category,
				'q': $('.searchQuery').val()
			},
			'dataType': 'json',
			'success':function(res){
				$(".memeImage").tooltip('hide');
				$(".categoryImage").tooltip('hide');
				
				if(res.length < 1){
					jQuery(".loadingGif").fadeOut();
					$(".memeImage").remove();
					
					if(comicBuilder.category != ""){
						if($("#categoryImages").is(':visible')){
							$("#categoryImages").hide();
							$('<img class="categoryImage upCategory" src="img/folder.png" rel="tooltip" title="Up" alt="Up" />').click(function(){comicBuilder.category = '';jQuery(".categoryImage").tooltip('hide');jQuery(".memeImage").remove();jQuery(".upCategory").remove();jQuery("#categoryImages").show();}).appendTo(jQuery(".memeList")).tooltip({placement:'left'});
						}
					} else {
						$(".upCategory").remove();
						$("#categoryImages").show();
					}
					return;
				}
				
				$(".memeImage").remove();
				$(".upCategory").remove();
				$("#categoryImages").hide();
				$('<img class="categoryImage upCategory" src="img/folder.png" rel="tooltip" title="Up" alt="Up" />').click(function(){comicBuilder.category = '';jQuery(".categoryImage").tooltip('hide');jQuery(".memeImage").remove();jQuery(".upCategory").remove();jQuery("#categoryImages").show();}).appendTo(jQuery(".memeList")).tooltip({placement:'left'});
				var memeImages = new Array();
				for(var i=0;i<res.length;i++){
					var meme=res[i];
					memeImages[i] = new Image();
					memeImages[i].title = meme.title;
					memeImages[i].alt = meme.title;
					memeImages[i].totalI = res.length;
					memeImages[i].i = i;
					memeImages[i].onload = function(){
						jQuery(this).addClass('memeImage')
						.attr('data-width', this.width)
						.attr('data-height', this.height)
						.appendTo(jQuery(".memeList"));
						
						jQuery(this).tooltip({placement:'left'})
						.draggable({helper: 'clone',
							start: function(e, ui){
								var width = jQuery(this).attr('data-width');
								var height = jQuery(this).attr('data-height');
								
								var MaxHeight = comicBuilder.panelHeight;
								var MaxWidth = comicBuilder.width;
								
								if(width > MaxWidth || height > MaxHeight){
									var WidthPercentage = MaxWidth / width;
									var HeightPercentage = MaxHeight / height;
									
									width *= Math.min(WidthPercentage, HeightPercentage);
									height *= Math.min(WidthPercentage, HeightPercentage);
								}
								
								$(ui.helper).css({width: width, height: height});
							}
						});
						
						if(this.i == (this.totalI - 1))
							jQuery(".loadingGif").fadeOut();
					};
					memeImages[i].src = meme.path;
				}
			},
			'error':function(err,msg){
				console.log("ERROR:"+err,msg)
			}
		});
	},
	/**
	 * updates layers panel 
	 */
	updateLayers:function(){
		var canvasObjects=canvas.getObjects();
		jQuery(".layesTable tbody").html("");
		if(canvasObjects.length>0){
			for(var i=canvasObjects.length - 1;i >= 0;i--){
				var object=canvasObjects[i];
				if(!(object instanceof fabric.Line))
					object.lockRotation = this.lockRotation;
				
				var title = object.get("title") || "Drawing";
				
				if(object.coreItem)
					continue;
				
				if(title.length > 18){
					title = title.substr(0, 18) + '...';
				}
				jQuery("<tr rel='"+i+"' class='"+(object.isActive()?"selected":"")+"'><td><span class='selectObject' >"+title+"</span></td><td><button class='tinyButtons btn btn-danger removeLayer' ><i class='icon-remove'></i></button></td></tr>").appendTo(jQuery(".layesTable tbody"));
			}
		}else{
			jQuery(".layesTable tbody").html("<tr><td colspan='2'>No layers added</td></tr>");
		}
	},
	/**
	 * removes selected objects from canvas 
	 */
	removeSelected:function(){
		if(o = canvas.getActiveObject()){
			if(o instanceof fabric.Line){
				var panel;
				if(o.type == 'h')
					panel = Math.floor(o.top / this.panelHeight) - 1;
				else
					panel = Math.floor(o.y1 / this.panelHeight);
				
				delete this.separators[o.type+panel];
			}
			canvas.remove(o);
		}

		if (canvas.getActiveGroup()) {
			canvas.getActiveGroup().forEachObject(function(o) {
				canvas.remove(o);
			});
		}

		this.textTool(false);
		canvas.deactivateAll();
		canvas.renderAll();
		this.updateLayers();
	},
	/**
	 * Deactivates any tools
	 */
	resetTools:function(){
		canvas.isDrawingMode = false;
		$('.toolContainer').hide();
		$('.toolButton').removeClass('active');
	},
	/**
	 * Deactivates any tools
	 */
	textTool:function(edit){
		if(edit){
			var object = canvas.getActiveObject();
			if(!object)
				object = canvas.getActiveGroup().objects[0];
			
			var Text = object.getText();
			if(Text.length > 0){
				Text = Text.substr(1, Text.length - 1);
			}
			
			$('.textString').val(Text);
			$('.fontValue').val(object.fontFamily);
			$('.fontSize').val(object.fontSize);
			$('.fontColor').val(object.fill);
			$('.strokeColor').val(object.strokeStyle);
			$('.strokeSize').val(object.strokeWidth);
			$('.fontBold').prop('checked', object.bold);
			$('.fontItalic').prop('checked', object.italic);
			$('.textAdd').attr("disabled", true);
		} else {
			$('.textString').val('');
			$('.fontValue').val('Droid Sans');
			$('.fontSize').val(25);
			$('.fontColor').val('#000000');
			$('.strokeColor').val('#FF0000');
			$('.strokeSize').val('0');
			$('.fontBold').prop('checked', false);
			$('.fontItalic').prop('checked', false);
			$('.textAdd').attr("disabled", false);
		}
	},
	//Mustafa: I put them in new functions to use them later in programming the PageUp & PageDown
	layerUp: function(){
		var objectIndex=parseInt(jQuery(".selected").attr("rel"));
		var canvasObjects=canvas.getObjects();
		if(canvasObjects[objectIndex]){
			canvas.bringForward(canvasObjects[objectIndex]);
			this.updateLayers();
		}
	},
	layerDown: function(){
		var objectIndex=parseInt(jQuery(".selected").attr("rel"));
		var canvasObjects=canvas.getObjects();
		if(canvasObjects[objectIndex]){
			canvas.sendBackwards(canvasObjects[objectIndex]);
			this.updateLayers();
		}
	},
	addHorizontalSeparator:function(panel, guideline){
		var title = "HPS Panel " + (panel+1) + "-" + (panel+2);
		
		if(!guideline){
			var AlreadyExists = false;
			canvas.forEachObject(function(o){
				if(o.title == title){
					AlreadyExists = true;
					return;
				}
			});
			if(AlreadyExists) return;
		}
	
		var hLine = new fabric.Line([ 0, (panel+1)*this.panelHeight, this.width, (panel+1)*this.panelHeight ], {
			fill: guideline ? 'blue' : 'black',
			strokeWidth: 2,
			selectable: true
		});
		
		if(guideline) {
			hLine.setOpacity(0.7);
			hLine.set("coreItem", true);
		}
		
		if(!comicBuilder.noSeparators)
			canvas.add(hLine);
		
		hLine.set("title", guideline ? "Guideline" : title);
		hLine.set("type", 'h');
		hLine.set("panel", panel);
		hLine.lockMovementX = hLine.lockMovementY = hLine.lockScalingX = hLine.lockScalingY = hLine.lockRotation = true;
		
		if(!guideline){
			this.separators['h'+panel] = hLine;
		}
		
		canvas.renderAll();
		this.updateLayers();
	},
	addVerticalSeparator:function(panel, guideline){
		var title = "VPS Panel " + (panel+1);
		
		if(!guideline){
			var AlreadyExists = false;
			canvas.forEachObject(function(o){
				if(o.title == title){
					AlreadyExists = true;
					return;
				}
			});
			if(AlreadyExists) return;
		}
		
		var vLine = new fabric.Line([this.cellWidth, panel*this.panelHeight, this.cellWidth, (panel+1)*this.panelHeight ], {
			fill: guideline ? 'blue' : 'black',
			strokeWidth: 2,
			selectable: true,
			coreItem: guideline ? true : false
		});
		
		if(guideline) {
			vLine.setOpacity(0.7);
			vLine.set("coreItem", true);
		}
		
		if(!comicBuilder.noSeparators)
			canvas.add(vLine);
		
		vLine.set("title", guideline ? "Guideline" : title);
		vLine.set("type", 'v');
		vLine.set("panel", panel);
		vLine.lockMovementX = vLine.lockMovementY = vLine.lockScalingX = vLine.lockScalingY = vLine.lockRotation = true;
		
		if(!guideline){
			this.separators['v'+panel] = vLine;
		}
		
		canvas.renderAll();
		this.updateLayers();
	},
	panelSeparatorMode:function(mode){
		jQuery(".memeImage").draggable("option", "disabled", mode);
		canvas.selection = !mode;
	},
	clearGuidelines:function(){
		this.mouseOverPanel = -1;
		canvas.forEachObject(function(o) {
			if(o instanceof fabric.Line && o.title == "Guideline"){
				canvas.remove(o);
			}
		});
	}
};
jQuery(document).ready(function(){
	comicBuilder.init();
});
function populateFontList(fontArray)
{
	var fontDetect = new Detector();
	for (var i in fontArray){
		var fontName = fontArray[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		var isAvailable = fontDetect.detect(fontName);
		if(isAvailable)
			if (!(fontName.match(/[_\-\s]Italic$/) || fontName.match(/[_\-\s](Demi)?[Bb]old$/) || fontName.match(/[_\-\s]Medium$/) || fontName.match(/[_\-\s](Ultra)?[Ll]ight$/) || fontName.match(/[_\-\s]Condensed$/)))
				$('.fontValue').append('<option value="'+fontName+'">'+fontName+'</option>')
	}
}

WebFontConfig = {
	google: {families: [ 'Droid Serif', 'Droid Sans', 'Lekton', 'Molengo' ]}
};
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();
