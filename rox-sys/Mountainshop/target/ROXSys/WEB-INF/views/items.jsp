<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/items.js"></script>
</head>
<body class="container">
<div class="container-fluid">
	<div class="page-header">
      <h1>Store items</h1>
  	</div>
  	<div class="row">
  		<div class="col-md-8 col-sm-8 col-lg-9 col-xs-6">
  			<button data-bind="click: displayAddItem" type="button" class="btn btn-primary btn-md" id="addItemButton">
  				<span class="glyphicon glyphicon-plus"></span> Add new item
  			</button>
  		</div>
        <div class="col-md-4 col-sm-4 col-lg-3 col-xs-6">
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input data-bind="value: searchString, valueUpdate:'keyup', event: { keyup: searchItems }" type="text" class="form-control input-md" placeholder="Name, or description" />
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
        	<th>Item ID</th>
        	<th>Bar Code</th>
        	<th>Item Name</th>
        	<th>Item Description</th>
        	<th>Price (PhP)</th>
        	<th>Action</th>
      	</tr>
    	</thead>
    	<tbody data-bind="foreach: items">
      		<td data-bind="text: itemId"></td>
      		<td data-bind="text: barCode"></td>
            <td data-bind="text: itemname"></td>
            <td data-bind="text: itemdesc"></td>
            <td data-bind="text: price"></td>
            <td>
            <a data-bind="tooltip: {title: editItemTitle, placement: 'left' }, attr: {id: itemId}, click: $parent.displayItem" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
            <!-- <a data-bind="tooltip: {title: delItemTitle, placement: 'left' }, attr: {id: itemId}, click: $parent.removeItem" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-remove red" aria-hidden="true"></span></a> -->
            </td>
    	</tbody>
    	<tbody data-bind="visible: items().length == 0">
      		<td></td>
            <td></td>
            <td>No item to show</td>
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
<!-- Add/Edit item modal -->
<div id="editItemModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Add new item</h4>
      </div>
      <div class="modal-body">
        <form>
        	<input data-bind="value: itemid" type="hidden"/>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Name*</span>
	      		<input id="itemNameInput" data-bind="value: itemName, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Item name" required="" maxlength="30"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Bar code*</span>
	      		<input data-bind="value: barcode, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Bar code" required="" maxlength="45"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Description</span>
	      		<input data-bind="value: itemDesc, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Description" maxlength="160"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Price*</span>
	      		<input data-bind="value: itemPrice, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Price" maxlength="10"/>
	      	</div>
	      	<div class="error" id="editItemError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal" data-bind="click: cancelEdit, enable:true">Cancel</button>
                <button type="button" id="editItemSumbitButton" class="btn btn-primary" data-bind="click: editItem, enable: (itemName().length > 0 && barcode().length > 9 && itemPrice() > 0)">Add</button>
      		</div> 
	    </form>
      </div>
    </div>
  </div>
</div>
</body>
</html>