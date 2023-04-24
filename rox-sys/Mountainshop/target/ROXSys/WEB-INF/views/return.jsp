<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/return.js"></script>
	
</head>
<body class="container">
  <div class="page-header">
    <h1>Return Items</h1>
  </div>
  <center>
  	<div class="half">
  		<form>
			<div class="form-group input-group">
				<span class="input-group-addon">O.R. Number</span>
			    	<input data-bind="value: receiptId, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Official Receipt number" maxlength="11"/>
			</div>
			<div class="error" id="receiptIdError"></div> 
			<div class="modal-footer">
		    	<button data-bind="click: getTransactionsByReceipt, enable: (receiptId().length > 0 && receiptId() > 0)" type="button" id="editAreaSumbitButton" class="btn btn-primary">Search</button>
		    </div> 
  		</form>
  	</div>
  </center>
<!-- Return item modal -->
<div id="returnItemModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Return item(s)</h4>
      </div>
      <div class="modal-body">
        <form>
        	<input data-bind="value: receiptId" type="hidden"/>
        	<div class"table-responsive">
			  	<table id="itemsTable" class="table table-striped">
			    	<thead>
			      	<tr>
			        	<th>Item</th>
			        	<th>Discount</th>
			        	<th>Price</th>
			        	<th>Quantity</th>
			      	</tr>
			    	</thead>
			    	<tbody data-bind="foreach: transactionItems">
			      		<td data-bind="text: itemDescription"></td>
			      		<td data-bind="text: itemDiscount"></td>
			            <td data-bind="text: itemPrice"></td>
			            <td>
			            	<span>
				            	<button data-bind="click: $parent.subtractItemQuantity, enable: (itemQuantityToReturn() > 0)" type="button" class="btn btn-primary btn-sm">
	  								<span class="glyphicon glyphicon-minus"></span>
	  							</button>
	  							<input class="returnInput" type="text" data-bind="value: itemQuantityToReturn, disable: true" />
	  							<button data-bind="click: $parent.addItemQuantity, enable: (itemQuantityToReturn() < itemQuantity())" type="button" class="btn btn-primary btn-sm">
	  								<span class="glyphicon glyphicon-plus"></span>
	  							</button>
  							</span>
			            </td>
			    	</tbody>
			    	<tbody data-bind="visible: transactionItems().length == 0">
			      		<td></td>
			            <td></td>
			            <td>No item to show</td>
			            <td></td>
			            <td></td>
			    	</tbody>
			  	</table>
			</div>
	      	<div class="error" id="editItemError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal" data-bind="enable:true">Cancel</button>
                <button type="button" id="editItemSumbitButton" class="btn btn-primary" data-bind="enable: isReturnable(), click: returnItems">Return</button>
      		</div> 
	    </form>
      </div>
    </div>
  </div>
</div>
</body>
</html>