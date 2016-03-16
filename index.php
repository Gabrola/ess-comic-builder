<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>ESS Comic Builder</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="ESS Comic Builder">
    <meta name="author" content="ESS">
    <!-- Le styles -->
    <link href="css/bootstrap.css" rel="stylesheet">
	<link href="css/colorpicker.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.css" rel="stylesheet">
    <link href="css/comic-builder.css?<?php print filemtime("css/comic-builder.css"); ?>" rel="stylesheet">
    <link href="css/jquery.contextmenu.css" rel="stylesheet">
    <link href="css/guiders-1.2.8.css" rel="stylesheet">
	
	<!--Fonts -->
	<link href="css/fonts.css" rel="stylesheet">
	
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="brand" href="">ESS Comic Builder</a>
        </div>
      </div>
    </div>

    <div class="container">
		<div class='row mainContainer'>
			<div class='panel memeContainer'>
				<div class='searchPanel'>
					<div class='searchOptions'>
						<input type="text" class="searchQuery" placeholder="Search Memes…" />
					</div>
					<div class='searchLoading'>
						<img src='img/circle_ball.gif' alt='loading' title='Loading Memes' class='loadingGif' />
					</div>
				</div>
				<div class='memeList'>
					<div id="categoryImages">
						<?php
						foreach(glob("memes/*", GLOB_ONLYDIR) as $CategoryFile)
						{
							$Category = basename($CategoryFile);
						?>
							<img class="categoryImage" src="img/folder.png" rel="tooltip" title="<?php print $Category; ?>" />
						<?php } ?>
					</div>
				</div>
				<div class="templateTool">
					<label>Choose Template</label>
					<select class="templateFile">
						<option value=""></option>
						<?php
						foreach(glob("templates/*") as $Template)
						{
							$PathInfo = pathinfo($Template);
							$TemplateFile = basename($Template);
							$TemplateName = basename($Template, '.'.$PathInfo['extension']);
						?>
						<option value="<?php print $TemplateFile; ?>"><?php print $TemplateName; ?></option>
						<?php } ?>
					</select>
					<button class="btn btn-primary applyTemplate">Apply</button>
				</div>
			</div>
			<div class='panel canvasContainer'>
				<div class='drawingTools'>
					<!-- Any buttons that will load tools in the right panel will have the class 'toolButton' so we can easily toggle the 'active' class when changing tools -->
					<button class="btn btn-danger" rel="tooltip" title="New Comic" id="btnClear"><i class="icon-white icon-file"></i></button>
					<button class="btn btn-primary toolButton" rel="tooltip" title="Freehand Drawing" id="btnDraw"><i class="icon-white icon-pencil"></i></button>
					<button class="btn btn-primary active" rel="tooltip" title="Disable Rotation" id="btnRotation"><i class="icon-white icon-repeat"></i></button>
					<button class="btn btn-primary toolButton" rel="tooltip" title="Text Tool" id="btnText"><i class="icon-white icon-font"></i></button>
					<button class="btn btn-primary" rel="tooltip" title="Add Image" id="btnPicture"><i class="icon-white icon-folder-open"></i></button>
					<button class="btn btn-primary" rel="tooltip" title="Add Image with URL" data-toggle="modal" href="#addImageModal" id="btnPictureExternal"><i class="icon-white icon-picture"></i></button>
					<button class="btn btn-primary toolButton active" rel="tooltip" title="Layers" id="btnLayers"><i class="icon-white icon-book"></i></button>
					<button class="btn btn-primary" rel="tooltip" title="Enable Watermark" id="btnWatermark"><i class="icon-white icon-tint"></i></button>
					<button class="btn btn-primary" rel="tooltip" title="Tour" id="btnTour"><i class="icon-white icon-info-sign"></i></button>
					
					<!--<button class="btn btn-info" rel="tooltip" title="Scrollable Canvas" id="btnScrollable"><i class="icon-white icon-resize-vertical"></i></button>-->
					
					<button class="btn btn-success rightBtn" id="btnPreview"><i class="icon-white icon-ok-circle"></i> Preview</button>
				</div>
				<div class='canvasArea'>
					<canvas id='canvasElement'></canvas>
				</div>
				<div class='panelTools'>
					<button class="btn btn-primary panelTool" rel="tooltip" title="Add Horizontal Panel Separator" id="btnHorizontal"><i class="icon-white icon-resize-horizontal"></i></button>
					<button class="btn btn-primary panelTool" rel="tooltip" title="Add Vertical Panel Separator" id="btnVertical"><i class="icon-white icon-resize-vertical"></i></button>
					<button class="btn btn-primary panelTool" rel="tooltip" title="Add Panel" id="btnAddPanel"><i class="icon-white icon-plus-sign"></i></button>
					<button class="btn btn-primary panelTool" rel="tooltip" title="Remove Panel" id="btnRemovePanel"><i class="icon-white icon-minus-sign"></i></button>
					<button class="btn btn-primary panelTool" rel="tooltip" title="Change Panel Height" id="btnPanelHeight"><i class="icon-white icon-resize-full"></i></button>
					<button class="btn btn-primary panelTool active" rel="tooltip" title="Toggle Grids (&#1576;&#1610;&#1588;&#1610;&#1604; &#1575;&#1604;&#1582;&#1591;&#1608;&#1591;)" id="btnHideGrids"><i class="icon-white icon-th-large"></i></button>
				</div>
			</div>
			<div class='panel toolsContainer'>
				<!-- Tool boxes will have the  'toolContainer' class so we can easily hide them when changing between tools-->
				<table class="table table-condensed layesTable toolContainer">
			        <thead>
			          <tr>
			            <th>Layers</th>
			            <th></th>
			          </tr>
			        </thead>
			        <tbody>
			          
			        </tbody>
			        <tfoot>
			        	<td colspan="2">
			        		<button class='tinyButtons btn btn-primary moveLayerUp' ><i class='icon-chevron-up'></i></button>
			        		<button class='tinyButtons btn btn-primary moveLayerDown' ><i class='icon-chevron-down'></i></button>
			        		<!-- <button class='btn btn-danger removeLayer' ><i class='icon-remove'></i></button> -->
			        	</td>
			        </tfoot>
			      </table>
				<div class="toolContainer textTool">
					<textarea class="textString" placeholder="Enter your text..."></textarea>
					<label>Font</label>
					<select class='fontValue'>
						<optgroup label="Website Fonts"></optgroup>
						<option value="Droid Sans" selected="selected">Droid Sans</option>
						<option value="Droid Serif">Droid Serif</option>
						<option value="Impact">Impact</option>
						<option value="Lekton">Lekton</option>
						<option value="Molengo">Molengo</option>
						<optgroup label="Your Fonts"></optgroup>
					</select>
					<label>Color</label>
					<input type="text" class="colorPicker fontColor" value="#000000" />
					<label>Font Size</label>
					<input type="text" class="fontSize" value="25" />
					<label class="checkbox">
						<input type="checkbox" class="fontBold" /> Bold
					</label>
					<label class="checkbox">
						<input type="checkbox" class="fontItalic" /> Italic
					</label>
					<label>Stroke Color</label>
					<input type="text" class="colorPicker strokeColor" value="#FF0000" />
					<label>Stroke Size</label>
					<input type="text" class="strokeSize" value="0" />
					<button class="btn btn-primary textAdd">Add</button>
				</div>
				<div class="toolContainer freeHand">
					<label>Color</label>
					<input type="text" class="colorPicker freeHandColor" value="#000000" />
					<label>Line Thickness</label>
					<input type="text" class="freeHandThickness" value="2" />
				</div>
				<div class="toolContainer animateTool">
					<table class="table table-condensed framesTable">
						<thead>
						  <tr>
							<th>Frames</th>
						  </tr>
						</thead>
						<tbody>
						  
						</tbody>
						<tfoot>
							<tr>
								<td>
									<button class="btn btn-primary addFrame">Add Frame</button>
								</td>
							</tr>
							<tr>
								<td>
									<button class="btn btn-primary renderGif">Render GIF</button>
								</td>
							</tr>
						</tfoot>
			      </table>
				</div>
			</div>
			<div style="clear: both"></div>
			<div class="footerText">
				<p>Controls:
					<ul>
						<li>Right click for different options</li>
						<li>Arrow keys for object movement. Holding shift key speeds up movement; holding ctrl key slows it down.</li>
					</ul>
				</p>
			</div>
		</div>
    </div> <!-- /container -->
    <div style='width:0px;height:0px;overflow: hidden;'>
    	<!-- dirty trick to make trigger click work on chrome -->
    	<input type='file' id='inputFileHandler'  />
    </div>
	
	
	<div class="modal fade " id="addImageModal">
	  <div class="modal-header">
	    <button class="close" data-dismiss="modal">×</button>
	    <h3>Add External Image</h3>
	  </div>
	  <div class="modal-body">
	    <label for='imageURLInput'>Image URL</label>
	    <div class='input-prepend'>
		    <span class="add-on"><i class=" icon-globe"></i></span>
		    <input id='imageURLInput' type='text' class='span5 imageURL' placeholder="http://www.xyz.com/image.jpg"   />
	    	<span class='loadingExternalImage'>
	    		<img src='img/circle_ball.gif' alt='loading image' title='Loading Image' class='loadingGif' />
	    	</span>
	    </div>
	    <div class='note'>
	    	Only .jpeg,.jpg,.png allowed 
	    </div>
	  </div>
	  <div class="modal-footer">
	    <a href="#" class="btn addImageClose" data-dismiss="modal">Close</a>
	    <a href="#" class="btn btn-primary addImageSubmit">Add Image</a>
	  </div>
	</div>
	
    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
	<script src="js/fabric.js?<?php print filemtime("js/fabric.js"); ?>"></script>
	<script src="js/jquery-1.7.2.min.js"></script>
	<script src="js/jquery.contextmenu.js"></script>
	<script src="js/jquery.base64.min.js"></script>
    <script src="js/guiders-1.2.8.js"></script>
	<script src="js/bootstrap.js"></script>
	<script src="js/bootstrap-tooltip.js"></script>
	<script src="js/bootstrap-colorpicker.js"></script>
	<script src="js/jquery-ui-1.8.20.custom.min.js"></script>
	<script src="js/detector.min.js"></script>
	<script type="text/javascript" src="js/LZWEncoder.js"></script>
	<script type="text/javascript" src="js/NeuQuant.js"></script>
	<script type="text/javascript" src="js/GIFEncoder.js"></script>
    <script src="js/tour.js"></script>
	<script src="js/comic_builder.js?<?php print filemtime("js/comic_builder.js"); ?>"></script>
	<object id="fontListSWF" name="fontListSWF" type="application/x-shockwave-flash" data="swf/FontList.swf" width="1" height="1"><param name="movie" value="swf/FontList.swf"><embed src="swf/FontList.swf" width="1" height="1"></embed></object>
	<!-- Authors:
	*	Amr Abosree
	*	Youssef Gaber
	*	Mustafa A. Abdel-Tawwab Jr.
	-->
  </body>
</html>
