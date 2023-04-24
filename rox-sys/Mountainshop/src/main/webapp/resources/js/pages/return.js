/**
 * This is the Jquery file for the pos.jsp page
 */
if(Cookies.get('usertype')==1) {
	//redirect to home page
	window.location.replace('home');
}
$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
	
	function Transaction(transaction) {
		this.transactionId = ko.observable(transaction.transactionId);
	    this.itemDescription = ko.observable(transaction.description);
	    this.receiptId = ko.observable(transaction.receiptId);
	    this.inventoryId = ko.observable(transaction.inventoryId);
	    this.itemQuantity = ko.observable(transaction.quantity);
	    this.itemPrice = ko.observable(transaction.price);
	    this.itemDiscount = ko.observable(transaction.discount);
	    this.itemQuantityToReturn = ko.observable(0);
	}
	
	function ReturnItemsViewModel() {
		var self = this;
		
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		
		//These are used to search for transactions using receipt Id
		self.receiptId = ko.observable("");
	    
		//container of the receipt items
		self.transactionItems = ko.observableArray([]);
		
		//container for items to be returned
		self.returnedItems = ko.observableArray([]);
		
		
		//flag for button
		self.isReturnable = ko.observable(false);
		
		//addItemQuantity is clicked
		self.addItemQuantity = function() {
			this.itemQuantityToReturn(this.itemQuantityToReturn() + 1);
			
			//loop through self.transactionItems and check if quantity of items to be returned is > 0
			for (var x in self.transactionItems()) {
				if(self.transactionItems()[x].itemQuantityToReturn() > 0 ) {
					self.isReturnable(true);
					return;
				}
			}
			
			self.isReturnable(false);
			
		};
		
		//subtractItemQuantity is clicked
		self.subtractItemQuantity = function() {
			this.itemQuantityToReturn(this.itemQuantityToReturn() - 1);
			
			//loop through self.transactionItems and check if quantity of items to be returned is > 0
			for (var x in self.transactionItems()) {
				if(self.transactionItems()[x].itemQuantityToReturn() > 0 ) {
					self.isReturnable(true);
					return;
				}
			}
			
			self.isReturnable(false);
		};
		
		//returnItems
		self.returnItems = function() {
			for (var x in self.transactionItems()) {
				if (self.transactionItems()[x].itemQuantityToReturn() > 0) {
					self.returnedItems.push(self.transactionItems()[x]);
				}
			}
			
			var url = "return-items";
			
			$.ajax({
				url: url,
				contentType: 'application/json; charset=utf-8',
				data: {returnedItems: ko.toJSON(self.returnedItems()), storeId: self.loggedInUserStoreId()},
				success: function(returnMessage) {
					if (returnMessage!=null) {
						
						alert("Success!\nPlease copy this voucher number: " + returnMessage
								+ ".\nThis will be used for payment later.");
						
						self.returnedItems.removeAll();
						
						// notify
						$.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'Items successfully returned' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
						//2.) view receipt
						
						// close the modal
						$('[data-dismiss=modal]').click();
						
						// empty the array of items to return
						self.returnedItems.removeAll();
						// set isReturnable to false
						self.isReturnable(false);
					}
				}
			});
		};
		
		self.getTransactionsByReceipt = function() {
			//clear error first
			$("#receiptIdError").text("");
			var receiptId = self.receiptId();
			var url1 = 'getVoucherByReceiptId';
			$.ajax({
				url: url1,
				data: {receiptId: receiptId},
				success: function(result) {
					if(result=='success') {
						//error message: You already have returned item(s) using the receipt Id before.
						$("#receiptIdError").text("You already have returned item(s) using the receipt Id before.");
					} else {
						var url2 = 'getTransactionsByReceipt';
						
						$.ajax({
							url: url2,
							dataType: 'json',
							data: {receiptId: receiptId},
							success: function(transactions) {
								
								var mappedItems = $.map(transactions, function(transaction) { return new Transaction(transaction); });
								
								//set to transactionItems the results
								self.transactionItems(mappedItems);
								
								//show returnItem modal
								$('#returnItemModal').modal('show');
							}
						});
					}
				}
			});
			
		};
	}
	ko.applyBindings(new ReturnItemsViewModel());
});