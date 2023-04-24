<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/inventory.js"></script>
</head>
<body class="container">
<div class="container-fluid">
	<div class="page-header">
      <h1>Inventory</h1>
  	</div>
  	<div class="row">
  		<div class="col-md-8 col-sm-8 col-lg-9 col-xs-6">
  			<button type="button" data-bind="click: displayAddInventory, enable: (storeid1() > 0 && items().length > 0 && currentResultStoreId()==storeid1())"  class="btn btn-primary btn-md" id="addInventoryButton">
  				<span class="glyphicon glyphicon-plus"></span> Add new inventory
  			</button>
  			<button type="button" data-bind="click: displaySearchFromOther"  class="btn btn-primary btn-md" id="searchFromOther">
  				Search from other stores
  			</button>
  		</div>
        <div class="col-md-4 col-sm-4 col-lg-3 col-xs-6">
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input data-bind="value: searchString, valueUpdate:'keyup', event: { keyup: searchInventory }" type="text" class="form-control input-md" placeholder="Item name" />
                    <span class="input-group-btn">
                        <i class="glyphicon glyphicon-search"></i>
                    </span>
                </div>
            </div>
        </div>
  	</div>
  	<div class="row">
  		<div class="col-md-4 col-sm-6 col-lg-3 col-xs-12">
  			<div class="form-group input-group">
	      		<span class="input-group-addon">Store Area</span>
	      		<select class="form-control" data-bind="options: areas,
                       optionsText: 'areaName',
                       optionsValue: 'areaId',
                       value: areaid1,
                       optionsCaption: 'All areas',
                       disable: loggedInUsertype()!=1
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Store Branch</span>
	      		<select class="form-control" data-bind="options: stores,
                       optionsText: 'branchName',
                       optionsValue: 'storeId',
                       value: storeid1,
                       optionsCaption: 'All branches',
                       disable: loggedInUsertype()!=1
                       ">
                </select>
	      	</div>
	      	<div class="col-md-8 col-sm-8 col-lg-9 col-xs-6 searchInventory">
	  			<button type="button" data-bind="click: getInventory, enable: (storeid1() > 0 && currentResultStoreId()!=storeid1())"  class="btn btn-primary btn-md" id="searchInventoryButton">
	  				Search
	  			</button>
  			</div>
  		</div>
  	</div>
  	<div data-bind="visible: inventoryCopy().length > 0 || currentResultStoreId()==storeid1()" class="table-responsive inventory">
  	<table id="itemsTable" class="table table-striped">
    	<thead>
      	<tr>
        	<th>Inventory ID</th>
        	<th>Item Name</th>
        	<th>Description</th>
        	<th>Bar Code</th>
        	<th>Quantity</th>
        	<th>Action</th>
      	</tr>
    	</thead>
    	<tbody data-bind="foreach: inventory">
      		<td data-bind="text: inventoryId"></td>
            <td data-bind="text: itemname"></td>
            <td data-bind="text: itemdescription"></td>
            <td data-bind="text: barCode"></td>
            <td data-bind="text: itemCount"></td>
            <td>
            <button data-bind="tooltip: {title: editInventoryTitle, placement: 'left' }, attr: {id: inventoryId}, click: $parent.displayInventoryQuantity, disable: $parent.loggedInUsertype()!=1" type="button"  class="btn btn-primary btn-sm">
  				<span class="glyphicon glyphicon-pencil"></span> Edit
  			</button>
            <!-- <button data-toggle="tooltip" data-placement="top" type="button" data-bind="tooltip: {title: delInventoryTitle, placement: 'left' }, click: $parent.removeInventoryItem, enable: (itemCount() <= 0 && $parent.loggedInUsertype()==1), attr: {id: inventoryId}"  class="btn btn-primary btn-sm">
  				<span class="glyphicon glyphicon-remove red"></span> Remove
  			</button>  -->
            </td>
    	</tbody>
    	<tbody data-bind="visible: inventory().length == 0">
      		<td></td>
            <td></td>
            <td>No inventory to show</td>
            <td></td>
            <td></td>
    	</tbody>
  	</table>
  </div>
  <div data-bind="visible: inventoryCopy().length > 0 || currentResultStoreId()==storeid1()" class="text-center col-md-4 col-md-offset-4 inventory">
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
<!-- Edit inventory modal -->
<div id="editInventoryModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Add inventory</h4>
      </div>
      <div class="modal-body">
        <form>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Item*</span>
	      		<select class="form-control" data-bind="options: items,
                       optionsText: 'itemName',
                       optionsValue: 'itemId',
                       value: inventory_itemId,
                       optionsCaption: 'Select item to add'
                       ">
                </select>
	      	</div>
	      	<div class="error" id="editInventoryError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-bind="click: addInventory, enable: (inventory_itemId() > 0)" id="editInventorySubmitButton">Add</button>
      		</div> 
	    </form>
      </div>
    </div>
  </div>
</div>
<!-- Search other stores' inventory modal -->
<div id="searchFromOtherModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Search Inventory of other stores</h4>
      </div>
      <div class="modal-body">
        <form>       
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Store area</span>
	      		<select class="form-control" data-bind="options: areas,
                       optionsText: 'areaName',
                       optionsValue: 'areaId',
                       value: areaid2,
                       optionsCaption: 'All areas',
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Store branch</span>
	      		<select class="form-control" data-bind="options: stores2,
                       optionsText: 'branchName',
                       optionsValue: 'storeId',
                       value: storeid2,
                       optionsCaption: 'All branches',
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Item name*</span>
	      		<input data-bind="value: searchItem, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Item name"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Barcode</span>
	      		<input data-bind="value: searchBarcode, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Barcode"/>
	      	</div>
	      	<div class="error" id="searchFromOtherError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" data-bind="click: cancelSearch" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-bind="click: searchFromOther, enable: (searchItem().length > 0)" id="searchFromOtherSubmitButton">Search</button>
      		</div> 
	    </form>
      </div>
    </div>
  </div>
</div>
<!-- Edit inventory modal -->
<div id="editInventoryQuantityModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Change quantity</h4>
      </div>
      <div class="modal-body">
        <form>
        	<input data-bind="value: formInventoryId" type="hidden"/ >
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Item name*</span>
	      		<input data-bind="value: formItemName, enable: false" type="text" class="form-control" placeholder="Item name"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Quantity*</span>
	      		<input data-bind="value: formItemQuantity, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Quantity"/>
	      	</div>
	      	<div class="error" id="editInventoryQuantityError">
	      	</div>
	      	<div class="modal-footer">
        		<button data-bind="click: cancelEdit" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button data-bind="click: editInventory, enable: formItemQuantity() && formItemQuantity() >= 0" type="button" class="btn btn-primary" id="editInventorySubmitButton">Save</button>
      		</div>
	    </form>
      </div>
    </div>
  </div>
</div>
<!-- View inventory from other stores modal -->
<div id="viewInventoryModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Inventory Search Results</h4>
      </div>
      <div class="modal-body">
        <form>
	      	<div class="table-responsive inventory">
			  	<table id="resultsTable" class="table table-striped" cellspacing="0" width="100%">
			  		<thead>
			            <tr>
			                <th>Store brach</th>
				        	<th>Item Name</th>
				        	<th>Description</th>
				        	<th>Bar Code</th>
				        	<th>Quantity</th>
			            </tr>
			        </thead>
			    	<tbody data-bind="foreach: searchInventoryArray">
			      		<td data-bind="text: searchStoreBranch"></td>
			            <td data-bind="text: searchItemName"></td>
			            <td data-bind="text: searchItemDescription"></td>
			            <td data-bind="text: searchItemBarCode"></td>
			            <td data-bind="text: searchItemQuantity"></td>
			    	</tbody>
			  	</table>
			  	<div class="modal-footer">
	        		<button data-bind="click: closeViewResult" type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      			</div>
  			</div>
	    </form>
      </div>
    </div>
  </div>
</div>
</body>
</html>