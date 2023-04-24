<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/area.js"></script>
	
</head>
<body class="container">
  <div class="page-header">
    <h1>Serviced areas</h1>
  </div>
  <div class="row">
  		<div class="col-md-8 col-sm-8 col-lg-9 col-xs-6">
  			<button data-bind="click: displayAddArea" type="button" class="btn btn-primary btn-md" id="addItemButton">
  				<span class="glyphicon glyphicon-plus"></span> Add new service area
  			</button>
  		</div>
        <div class="col-md-4 col-sm-4 col-lg-3 col-xs-6">
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input data-bind="value: searchString, valueUpdate:'keyup', event: { keyup: searchAreas }" type="text" class="form-control input-md" placeholder="Area name" />
                    <span class="input-group-btn">
                        <i class="glyphicon glyphicon-search"></i>
                    </span>
                </div>
            </div>
        </div>
  	</div>
  	<div class"table-responsive">
  	<table id="itemsTable" class="table table-striped">
    	<thead>
      	<tr>
        	<th>Area ID</th>
        	<th>Area Name</th>
        	<th>Zoom Level</th>
        	<th>Action</th>
      	</tr>
    	</thead>
    	<tbody data-bind="foreach: areas">
      		<td data-bind="text: areaId"></td>
            <td data-bind="text: areaName"></td>
            <td data-bind="text: zoomLevel"></td>
            <td>
            	<a data-bind="tooltip: {title: editAreaTitle, placement: 'left' }, attr: {id: areaId}, click: $parent.displayArea" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
            	<!-- <a data-bind="tooltip: {title: delAreaTitle, placement: 'left' }, attr: {id: areaId}, click: $parent.removeArea" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-remove red" aria-hidden="true"></span></a> -->
            </td>
    	</tbody>
    	<tbody data-bind="visible: areas().length == 0">
      		<td></td>
            <td></td>
            <td>No area to show</td>
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
  	<!-- Add/Edit item modal -->
	<div id="editAreaModal" class="modal fade" role="dialog">
	  <div class="modal-dialog">
	    <!-- Modal content-->
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title">Add new service area</h4>
	      </div>
	      <div class="modal-body">
	        <form>
	        	<input data-bind="value: areaid" type="hidden"/>      
		      	<div class="form-group input-group">
		      		<span class="input-group-addon">Area name</span>
		      		<input data-bind="value: areaname, valueUpdate:'afterkeydown', event: { keyup: searchAreas }" type="text" class="form-control" placeholder="Name of area" maxlength="160"/>
		      	</div>
		      	<div class="form-group input-group">
		      		<span class="input-group-addon">Zoom level</span>
		      		<input data-bind="value: zoomlevel, valueUpdate:'afterkeydown', event: { keyup: searchAreas }" type="text" class="form-control" placeholder="Zoom level" maxlength="2"/>
		      	</div>
		      	<div class="error" id="editAreaError">
		      	</div> 
		      	<div class="modal-footer">
	        		<button data-bind="click: cancelEdit" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
	                <button data-bind="click: editArea, enable: (areaname().length > 0) && (zoomlevel().length > 0 && zoomlevel() > 0)" type="button" id="editAreaSumbitButton" class="btn btn-primary">Add</button>
	      		</div> 
		    </form>
	      </div>
	      
	    </div>
	  </div>
	</div>
</body>
</html>