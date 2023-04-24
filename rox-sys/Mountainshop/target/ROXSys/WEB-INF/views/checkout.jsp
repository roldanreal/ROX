<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/plugin/anysearch.min.js"></script>
	<script src="resources/js/pages/checkout.js"></script>
	
	
</head>
<body class="container">
  <div class="page-header">
    <h1>Checkout items</h1>
  </div>
  <div id="rightDiv" class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
  	<div class="row">
        <div class="col-md-4 col-sm-4 col-lg-4 col-xs-6">
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input data-bind="value: searchString, valueUpdate:'keyup', event: { keyup: searchItems }" type="text" class="form-control input-md" placeholder="Barcode, Item name" />
                    <span class="input-group-btn">
                        <i class="glyphicon glyphicon-search"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="col-md-8 col-sm-8 col-lg-8 col-xs-6">
            <button type="button" class="btn btn-primary btn-md" id="purchaseItemButton" data-bind="click: addToCart">
  				<span class="glyphicon glyphicon-plus"></span> Add to cart
  			</button>
        </div>
  	</div>
  	<div class"table-responsive">
  	<table id="itemsTable" class="table table-striped">
    	<thead>
      	<tr>
      		<th></th>
        	<th>Bar Code</th>
        	<th>Item Name</th>
        	<th>Price</th>
        	<th>Quantity</th>
        	<th>Discount (%)</th>
      	</tr>
    	</thead>
    	<tbody data-bind="foreach: inventory">
    		<td><input type="checkbox" data-bind="checked: itemSelected"/></td>
      		<td data-bind="text: barCode"></td>
            <td data-bind="text: itemName"></td>
            <td data-bind="text: itemPrice"></td>
            <td><input class="inputReceipt" type="text" data-bind="value: itemQuantity, enable: itemSelected(), valueUpdate:'afterkeydown'"/></td>
            <td><input class="inputReceipt" type="text" data-bind="value: itemDiscount, enable: itemSelected(), valueUpdate:'afterkeydown'"/></td>
    	</tbody>
    	<tbody data-bind="visible: inventory().length == 0">
      		<td></td>
            <td></td>
            <td></td>
            <td>No inventory to show</td>
            <td></td>
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
  <div id="leftDiv" class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 posReceipt">
    <div class="right">
       <button type="button" class="btn btn-primary btn-md" id="checkoutButton" data-bind="click: doPayment, enable: transactionItems().length>0">
  			<span class="glyphicon glyphicon-shopping-cart"></span> Checkout
  		</button>
    </div>
    <div id="receiptDiv">
    	<p data-bind="text: storeBranchName"></p>
    	<p data-bind="text: storeAddress"></p>
    	<p data-bind="text: storeTin"></p>
    	<hr />
    	<table id="itemsTable" class="table">
    	  <thead>
      		<tr>
      		  <th>Qty x Price</th>
        	  <th>Item</th>
        	  <th>Discount</th>
        	  <th>Total</th>
        	  <th></th>
	      	</tr>
          </thead>
    	  <tbody data-bind="foreach: transactionItems">
    	    <td data-bind="text: itemQuantityXPrice"></td>
            <td data-bind="text: itemDescription"></td>
            <td data-bind="text: itemDiscountText"></td>
            <td data-bind="text: itemPriceAfterDiscount"></td>
            <td><a data-bind="tooltip: {title: 'Remove from cart', placement: 'left' }, attr: {id: inventoryId}, click: $parent.removeFromCart" href="" data-toggle="tooltip" data-placement="top">x</a></td>
    	  </tbody>
    	</table>
    	<hr />
    	<table class="table table-borderless">
    		<tr>
    			<td><label class="left">Net amount due:</label></td>
    			<td class="right" data-bind="text: netAmountDue"></td>
    		</tr>
    		<tr>
    			<td><label class="left">Cashier:</label></td>
    			<td class="right" data-bind="text: loggedInUser"></td>
    		</tr>
    		<tr>
    			<td><label class="left">Total items:</label></td>
    			<td class="right" data-bind="text: totalItems"></td>
    		</tr>
    	</table>
    	<hr />
    	<table class="table table-borderless">
    		<tr>
    			<td><label class="left">Vatable Sale:</label></td>
    			<td class="right" data-bind="text: vatableSale"></td>
    		</tr>
    		<tr>
    			<td><label class="left">VAT(12%):</label></td>
    			<td class="right" data-bind="text: vat"></td>
    		</tr>
    	</table>
    	<hr />
    	<p>Thank you for visiting us.</p>
    	<p>Please come again.</p>
    </div>
  </div>
<!-- Add-to-cart modal -->
<div id="addToCartModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Add to cart</h4>
      </div>
      <div class="modal-body">
        <form>
        	<input data-bind="value: inventoryid" type="hidden"/>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Bar code</span>
	      		<input data-bind="value: barcode, valueUpdate:'afterkeydown', enable: false" type="text" class="form-control" placeholder="Bar code" required="" maxlength="45"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Item</span>
	      		<input data-bind="value: itemdescription, valueUpdate:'afterkeydown', enable: false" type="text" class="form-control" placeholder="Item" required="" maxlength="160"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Price</span>
	      		<input data-bind="value: itemprice, valueUpdate:'afterkeydown', enable: false" type="text" class="form-control" placeholder="Description"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Quantity*</span>
	      		<input data-bind="value: itemquantity, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Price" maxlength="10"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Discount*</span>
	      		<input data-bind="value: itemdiscount, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Discount" maxlength="10"/>
	      	</div>
	      	<div class="error" id="addToCartError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal" data-bind="click: cancelEdit, enable: true">Cancel</button>
                <button type="button" id="editItemSumbitButton" class="btn btn-primary" data-bind="click: addToCartThruBarcode, enable: (itemdescription().length > 0 && barcode().length > 9 && itemprice() > 0)">Add</button>
      		</div> 
	    </form>
      </div>
    </div>
  </div>
</div>
<!-- Checkout items modal -->
<div id="paymentModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
      	<span><h4 class="modal-title">Checkout items</h4>
  			<button data-bind="tooltip: {title: 'Add payment type', placement: 'right' }, click: addPaymentMethod" type="button" style="position-right: 0px;" class="btn btn-primary btn-md">
  					<span class="glyphicon glyphicon-plus"></span> Add payment method
  			</button>
  		</span>
      </div>
      <div class="modal-body">
        <form>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Amount due</span>
	      		<input data-bind="value: amountDue, enable: false" type="text" class="form-control" placeholder="Amount due" required="" maxlength="45"/>
	      	</div>
	      	<table data-bind="visible: returnedItemVouchers().length > 0" id="returnItemsVoucherTable" class="table">
	    	  <thead>
	      		<tr>
	      		  <th>Voucher Number</th>
	        	  <th>Amount</th>
	        	  <th></th>
		      	</tr>
	          </thead>
	    	  <tbody data-bind="foreach: returnedItemVouchers">
	    	    <td data-bind="text: returnedItemVoucherNumber"></td>
	            <td data-bind="text: returnedItemVoucherAmount"></td>
	            <td><a data-bind="tooltip: {title: 'Remove voucher', placement: 'left' }, attr: {id: returnedItemVoucherNumber}, click: $parent.removeVoucher" href="" data-toggle="tooltip" data-placement="top">x</a></td>
	    	  </tbody>
	    	</table>
	    	<table data-bind="visible: paymentMethods().length > 0" id="returnItemsVoucherTable" class="table">
	    	  <thead>
	      		<tr>
	      		  <th>Payment type</th>
	        	  <th>Reference number</th>
	        	  <th>Amount</th>
	        	  <th></th>
		      	</tr>
	          </thead>
	    	  <tbody data-bind="foreach: paymentMethods">
	    	    <td data-bind="text: pmPaymentType"></td>
	            <td data-bind="text: pmPaymentReferenceId"></td>
	            <td data-bind="text: pmAmountPaid"></td>
	            <td><a data-bind="tooltip: {title: 'Remove payment', placement: 'left' }, attr: {id: pmId}, click: $parent.removePayment" href="" data-toggle="tooltip" data-placement="top">x</a></td>
	    	  </tbody>
	    	</table>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Total payment</span>
	      		<input data-bind="value: totalAmountPaid, event: { keyup: computeTotalAmountPaidAndChange}, disable: true" type="text" class="form-control" placeholder="Amount paid" required="" maxlength="160"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Change</span>
	      		<input data-bind="value: amountChange, enable: false" type="text" class="form-control" placeholder="Change"/>
	      	</div>
	      	<div class="error" id="checkoutError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal" data-bind="click: cancelEdit, enable: true">Cancel</button>
                <button type="button" id="checkoutSubmitButton" class="btn btn-primary" data-bind="enable: amountChange() >= 0 && totalAmountPaid() > 0, click: checkoutItems">Check out</button>
      		</div> 
	    </form>
      </div>
    </div>
  </div>
</div>
<!-- Add returned item(s) voucher modal -->
<div id="returnedItemVoucherModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Add payment method</h4>
      </div>
      <div class="modal-body">
        <form>
        	<div class="form-group input-group">
	      		<span class="input-group-addon">Payment type*</span>
	      		<select class="form-control" data-bind="options: paymentTypes,
                       optionsText: 'paymentType',
                       optionsValue: 'paymentTypeId',
                       value: paymentTypeOptionsId,
                       optionsCaption: 'Payment type'
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group" data-bind="visible: paymentTypeOptionsId() && paymentTypeOptionsId()==4">
	      		<span class="input-group-addon">Voucher number*</span>
	      		<input data-bind="value: voucherNumber, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Voucher number" required="" maxlength="45"/>
	      	</div>
	      	<div class="form-group input-group" data-bind="visible: paymentTypeOptionsId() && (paymentTypeOptionsId() == 2 || paymentTypeOptionsId() == 3)">
	      		<span class="input-group-addon">Payment Reference Id*</span>
	      		<input data-bind="value: paymentReferenceId, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Reference Id" required="" maxlength="160"/>
	      	</div>
	      	<div class="form-group input-group" data-bind="visible: paymentTypeOptionsId() && (paymentTypeOptionsId() < 4)">
	      		<span class="input-group-addon">Amount*</span>
	      		<input data-bind="value: amountPaid, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Amount paid" required="" maxlength="160"/>
	      	</div>
	      	<div class="error" id="returnedItemVoucherError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" id="paymentMethodModal" data-dismiss="modal" data-bind="click: cancelAddPaymentMethod, enable: true">Cancel</button>
                <button type="button" id="addPaymentSubmitButton" class="btn btn-primary" data-bind="enable: paymentTypeOptionsId() && ((paymentTypeOptionsId() == 1 && amountPaid() && amountPaid() != '' && amountPaid() > 0) || ((paymentTypeOptionsId() == 2 || paymentTypeOptionsId() == 3) && paymentReferenceId() && paymentReferenceId() != '' && amountPaid() && amountPaid() > 0) || (paymentTypeOptionsId() == 4 && voucherNumber() != '' && voucherNumber() >= 0)), click: addPayment">Add payment</button>
      		</div> 
	    </form>
      </div>
    </div>
  </div>
</div>
</body>
</html>