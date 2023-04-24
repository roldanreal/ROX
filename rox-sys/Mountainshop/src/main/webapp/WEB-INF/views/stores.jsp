<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<head>
	<jsp:include page="header.jsp" />
	
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css"
   integrity="sha512-07I2e+7D8p6he1SIM+1twR5TIrhUQn9+I6yjqD53JQjFiMf8EtC93ty0/5vJTZGF8aAocvHYNEDJajGdNx1IsQ=="
   crossorigin=""/>
   <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"
   integrity="sha512-A7vV8IFfih/D732iSSKi20u/ooOfj/AGehOKq0f4vLT1Zr2Y+RX7C+w8A1gaSasGtRUZpF/NZgzSAu4/Gc41Lg=="
   crossorigin=""></script>
	
	
	<!-- Leaflet 
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"/>
  	<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
  	-->
	
	<meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
	<!-- Mapbox JS and CSS -->
	<script src='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js'></script>
	<link href='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css' rel='stylesheet' />
	
	<!-- Leaflet AJAX -->
  	<script src="resources/js/plugin/leaflet.ajax.min.js"></script>
	
	<!-- Ionicons CSS -->
	<link href='resources/css/ionicons.min.css' rel='stylesheet' />
	
	<!-- Awesome Markers -->
	<script src="resources/js/plugin/leaflet.awesome-markers.min.js"></script>
	<link rel="stylesheet" href="resources/css/leaflet.awesome-markers.css">
	
	<!-- Highcharts -->
	<script src="resources/js/plugin/highcharts.js"></script>
  	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/stores.js"></script>
	
</head>
<body>
<div class="container-fluid">
	<div class="page-header">
      <h1>Stores</h1>
  	</div>
  	<div class="row">
  		<div class="col-md-8 col-sm-8 col-lg-9 col-xs-6">
  			<button data-bind="click: displayAddStore" type="button" class="btn btn-primary btn-md" id="addStoreButton">
  				<span class="glyphicon glyphicon-plus"></span> Add new store
  			</button>
  		</div>
        <div class="col-md-4 col-sm-4 col-lg-3 col-xs-6">
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input data-bind="value: searchString, valueUpdate:'keyup', event: { keyup: searchStores }" type="text" class="form-control input-md" placeholder="Branch name, Area name" />
                    <span class="input-group-btn">
                        <i class="glyphicon glyphicon-search"></i>
                    </span>
                </div>
            </div>
        </div>
  	</div>
  <div class"table-responsive">
  	<table id="storesTable" class="table table-striped">
    	<thead>
      	<tr>
        	<th>Store ID</th>
        	<th>Area</th>
        	<th>Branch Name</th>
        	<th>TIN</th>
        	<th>Address</th>
        	<th>Coordinates</th>
        	<th>Action</th>
      	</tr>
    	</thead>
    	<tbody data-bind="foreach: stores">
      		<td data-bind="text: storeId"></td>
            <td data-bind="text: area, value: area_id"></td>
            <td data-bind="text: branchName"></td>
            <td data-bind="text: tin"></td>
            <td data-bind="text: address"></td>
            <td data-bind="text: coordinates"></td>
            <td>
            <a data-bind="tooltip: {title: editItemTitle, placement: 'left' }, attr: {id: storeId}, click: $parent.displayStore" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
            <!-- <a data-bind="tooltip: {title: delItemTitle, placement: 'left' }, attr: {id: storeId}, click: $parent.removeStore" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-remove red" aria-hidden="true"></span></a> -->
            </td>
    	</tbody>
    	<tbody data-bind="visible: stores().length == 0">
      		<td></td>
            <td></td>
            <td>No store to show</td>
            <td></td>
            <td></td>
    	</tbody>
  	</table>
  </div>
  <div class="text-center col-md-4 col-md-offset-4">
  	<ul class="pagination pagination-md">
		<li data-bind="css: { disabled: (currPage() === 1) }"><a data-bind="css: { disabled: (currPage() === 1) }, click: function() { if(currPage() != 1) { doPaging(pageSize(), currPage()-1)}}" href="">&laquo;</a></li>
	</ul>
    <ul data-bind="foreach: pagesArray" class="pagination pagination-md">
		<li data-bind="css: { active: $parent.currPage() === pageNumber()}"><a data-bind="text: pageNumber, click: function() { $parent.doPaging($parent.pageSize(), pageNumber())}" href=""></a></li>
	</ul>
	<ul class="pagination pagination-md">
		<li data-bind="css: { disabled: (currPage() === maxNumberPages() || maxNumberPages() === 0) }"><a data-bind="click: function() { if(currPage() != maxNumberPages()) { doPaging(pageSize(), currPage()+1)}}" href="">&raquo;</a></li>
	</ul>
  </div>
</div>
<!-- Add/Edit store modal -->
<div id="editStoreModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Add new store</h4>
      </div>
      <div class="modal-body">
        <form>
        	<input type="hidden" data-bind="value: storeid"/>      
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Store Area*</span>
	      		<select class="form-control" data-bind="options: areas,
                       optionsText: 'areaName',
                       optionsValue: 'areaId',
                       value: areaid,
                       optionsCaption: 'Choose area...',
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Branch Name*</span>
	      		<input data-bind="value: branchname, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Branch name" required="" maxlength="45"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">TIN*</span>
	      		<input data-bind="value: taxIdNumber, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Tax Identification Number" required="" maxlength="12"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Address*</span>
	      		<input data-bind="value: branchaddress, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Address" required="" maxlength="160"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Coordinates*</span>
	      		<input data-bind="value: coordinates, valueUpdate:'afterkeydown', numeric" type="text" class="form-control" placeholder="Coordinates" required="" maxlength="60"/>
	      		<span data-bind="click: displayCoordinates" class="input-group-addon">
                        <span class="glyphicon glyphicon-pushpin"></span>
                </span>
	      	</div>
	      	<!-- <div class="form-group input-group">
	      		<span class="input-group-addon">Longitude*</span>
	      		<input data-bind="value: longitude, valueUpdate:'afterkeydown', numeric" type="text" class="form-control" placeholder="Longitude" required="" maxlength="30"/>
	      	</div> -->
	      	<div class="error" id="editStoreError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal" data-bind="click: cancelEdit">Cancel</button>
                <button type="button" id="editStoreSumbitButton" class="btn btn-primary" data-bind="click: editStore, enable: (areaid && branchname().length > 0 && taxIdNumber().length == 12 && branchaddress().length > 0 && coordinates().length > 0)">Add</button>
      		</div> 
	    </form>
      </div>
      
    </div>
  </div>
</div>
<!-- Modal that contains map -->
<div id="mapSelectModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title mod-title">Click map to select coordinates</h4>
      </div>
      <div class="modal-body">
        <div class="table-responsive">
			<div id="mapContainer"></div>
			<div class="modal-footer">
	        	<button id="mapModal" type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      		</div>
  		</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>