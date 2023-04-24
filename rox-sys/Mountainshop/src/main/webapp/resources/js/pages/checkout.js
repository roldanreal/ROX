/**
 * This is the Jquery file for the pos.jsp page
 */
//before page loads, if user is admin, redirect to home page
if(Cookies.get('usertype')==1) {
	//redirect to home page
	window.location.replace('home');
}

$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
	function ReturnedItemVoucher(returnedItemVoucher) {
		this.returnedItemVoucherNumber = ko.observable(returnedItemVoucher.returnItemVoucherId);
		this.returnedItemVoucherAmount = ko.observable(returnedItemVoucher.amount);
	}
	
	function PaymentType(paymentType) {
		this.paymentTypeId = ko.observable(paymentType.paymentTypeId);
		this.paymentType = ko.observable(paymentType.paymentType);
	}
	function Inventory(inventory) {
		this.itemSelected = ko.observable(false);
	    this.inventoryId = ko.observable(inventory.inventoryId);
	    this.areaId = ko.observable(inventory.areaId);
	    this.storeId = ko.observable(inventory.storeId);
	    this.itemName = ko.observable(inventory.itemName);
	    this.barCode = ko.observable(inventory.barCode);
	    this.itemDescription = ko.observable(inventory.itemDescription);
	    this.itemPrice = ko.observable(inventory.itemPrice);
	    this.itemQuantity = ko.observable("");
	    this.itemDiscount = ko.observable("");
	}
	
	function POSViewModel() {
		var self = this;
	
		//list of inventory
		self.inventory = ko.observableArray([]);
		self.inventoryCopy = ko.observableArray([]);
		
		//used in transaction
		//list of transaction items
		self.transactionItems = ko.observableArray([]);
		self.netAmountDue = ko.observable(0);
		self.vatableSale = ko.observable(0);
		self.totalItems = ko.observable(0);
		self.vat = ko.observable(0);
		
		//note of the contents: inventory id, description, quantity (kunin na lahat, item name, price)
		
		//for add-to-cart modal
		self.inventoryid = ko.observable();
		self.barcode = ko.observable("");
		self.itemdescription = ko.observable("");
		self.itemprice = ko.observable("");
		self.itemquantity = ko.observable("1");
		self.itemdiscount = ko.observable("0");
		self.areaid = ko.observable("");
		self.storeid = ko.observable("");
		self.itemname = ko.observable("");
		
		//for check out modal
		self.amountDue = ko.observable(0);
		self.amountChange = ko.observable(0);
		self.returnedItemVouchers = ko.observableArray([]);
		
		//total amount paid: summation of voucher amounts, plus amount paid
		self.totalAmountPaid = ko.observable(0);
		
		
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		self.loggedInUserId = ko.observable(Cookies.get('userId'));
		
		//These are used in search
		self.searchString = ko.observable("");
		self.searchResultsArray = ko.observableArray([]);
		
		//for paging
	    self.pageSize = ko.observable(10);
	    self.NumberPages = ko.observable(1);
	    self.currPage = ko.observable(1);
	    self.pagesArray = ko.observableArray([]);
	    self.maxNumberPages = ko.observable(1);
	    
	    //used in Store details
	    self.storeBranchName = ko.observable("");
	    self.storeAddress = ko.observable("");
	    self.storeTin = ko.observable("");
	    self.storeDetailsString = ko.observable("");
	    
	    //returned item voucher
	    self.voucherNumber = ko.observable("");
	    
	    //for receipt printing
	    self.storeDetails = ko.observableArray([]);
		
	    //for payment types
	    self.paymentTypes = ko.observableArray([]);
	    self.paymentTypeOptionsId = ko.observable();
	    self.paymentReferenceId = ko.observable();
	    self.amountPaid = ko.observable("");
	    self.paymentMethods = ko.observableArray([]);
	    
	    //for use in identification for payment method array
	    self.paymentMethodIdentification = ko.observable(0);
	    
	    //used to read barcodes
	    $(document).anysearch({
	        reactOnKeycodes: 'all',
	        secondsBetweenKeypress: 1,
	        searchPattern: {1: '[^~,]*'},
	        excludeFocus: 'input,textarea,select,#tfield',
	        enterKey: 13,
	        backspaceKey: 8,
	        checkIsBarcodeMilliseconds: 250,
	        searchFunc: function(barCodeString) {
	        	//what to do with the barcode
	        	//search the inventory
	        	for(var x in self.inventoryCopy()) {
	        		if (self.inventoryCopy()[x].barCode()==barCodeString) {
	        			//set the values
	        			self.inventoryid(self.inventoryCopy()[x].inventoryId());
	        			self.barcode(self.inventoryCopy()[x].barCode());
	        			self.itemdescription(self.inventoryCopy()[x].itemDescription());
	        			self.itemprice(self.inventoryCopy()[x].itemPrice());
	        			self.itemquantity(1);
	        			self.itemdiscount(0);
	        			self.areaid(self.inventoryCopy()[x].areaId());
	        			self.storeid(self.inventoryCopy()[x].storeId());
	        			self.itemname(self.inventoryCopy()[x].itemName());
	        			//open modal
	        			$('#addToCartModal').modal('show');
	        			
	        		}
	        	}
	        }
	    });
	    
		$.ajax({
			url: 'getPaymentTypes',
			dataType: 'json',
			success: function(allData) {
				var mappedItems = $.map(allData, function(paymentType) { return new PaymentType(paymentType); });
		        //save to array
				self.paymentTypes(mappedItems);        
			}
		});
		
		var url = 'get-inventory';
		$.ajax({
			url: url,
			dataType: 'json',
			data: {usertype: self.loggedInUsertype(), storeId: self.loggedInUserStoreId()},
			success: function(allData) {
				var mappedItems = $.map(allData, function(inventory) { return new Inventory(inventory); });
		        
		        //make a copy of the inventory
		        self.inventoryCopy(mappedItems);        
		        //Do paging on first load
		        self.doPaging(self.pageSize());
			}
		});
		
		$.ajax({
			url: 'get-'+self.loggedInUserStoreId()+'-store',
			dataType: 'json',
			data: {storeId: self.loggedInUserStoreId()},
			success: function(store) {
				self.storeBranchName("Recreational Outdoor eXchange - " + store.branchName);
				self.storeAddress(store.address);
				
				self.storeTin('VAT Reg. TIN: ' + self.processTin(store.tin));
				
				
				var storeDetails = self.storeBranchName() + '\n' + self.storeAddress() + '\n' + self.storeTin();
				
				self.storeDetailsString(storeDetails);
				
				//set store details
				self.storeDetails.push({
					storeBranchName: ko.observable(self.storeBranchName()),
					storeAddress: ko.observable(self.storeAddress()),
					cashier: ko.observable(self.loggedInUser()),
					storeId: self.loggedInUserStoreId()
				});
				
			}
		});
		
		self.doPayment = function() {
			//set values
			self.amountDue(self.netAmountDue());
			//open modal
			$('#paymentModal').modal('show');
		};
			
		self.addPaymentMethod = function() {
			//Clear values
			self.paymentTypeOptionsId(null);
		    self.paymentReferenceId("");
		    self.amountPaid("");
			//open modal
			$('#returnedItemVoucherModal').modal('show');
		};
		
		self.cancelAddPaymentMethod = function() {
			//Clear values
			self.paymentTypeOptionsId(null);
		    self.paymentReferenceId("");
		    self.amountPaid("");
		};
	
		self.processTin = function(tin) {
			var processedTin = tin.charAt(0);
			for (var i=1; i < tin.length; i++) {
				if(i%3==0) {
					processedTin += ('-' + tin.charAt(i));
				} else {
					processedTin += tin.charAt(i);
				}
			}
			return processedTin;
		};
		
		self.computeTotalAmountPaidAndChange = function() {
			var totalAmountinVouchers = 0.0;
			var totalAmountinOtherPayments = 0.0;
			var totalAmountPaid = 0.0;
			for (var x in self.returnedItemVouchers()) {
				totalAmountinVouchers += parseFloat(self.returnedItemVouchers()[x].returnedItemVoucherAmount());
			}
			for (var x in self.paymentMethods()) {
				totalAmountinOtherPayments += parseFloat(self.paymentMethods()[x].pmAmountPaid);
			}
			
			totalAmountPaid = (totalAmountinVouchers + totalAmountinOtherPayments);
			self.totalAmountPaid(totalAmountPaid.toFixed(2));
			
			//update change
			self.amountChange(parseFloat(totalAmountPaid - self.amountDue()).toFixed(2));
			
		};
		
		self.isVoucherExisting = function(voucherNumber) {
			for(var x in self.returnedItemVouchers()) {
				if(self.returnedItemVouchers()[x].returnedItemVoucherNumber()==voucherNumber) {
					return true;
				}
				
			}
			
			return false;
		};
		
		self.addPayment = function() {
			var paymentTypeOptionsId = self.paymentTypeOptionsId();
		    var paymentReferenceId = self.paymentReferenceId();
		    var voucherNumber = self.voucherNumber();
		    var amountPaid = self.amountPaid();
		    
		    var pmId = self.paymentMethodIdentification() + 1;
		    //for Cash
		    if(paymentTypeOptionsId==1) {
		    	//push to array the values
		    	self.paymentMethods.push({
		    		pmTypeOptionsId: paymentTypeOptionsId,
		    		pmId : pmId,
		    		pmPaymentType : "Cash",
		    		pmPaymentReferenceId : "",
		    		pmAmountPaid : amountPaid
		    	});
		    	//recompute total amount
			    self.computeTotalAmountPaidAndChange();
		    	
		    } else if (paymentTypeOptionsId==2 || paymentTypeOptionsId==3) { // Credit or Debit
		    	//push to array the values
		    	self.paymentMethods.push({
		    		pmTypeOptionsId: paymentTypeOptionsId,
		    		pmId : pmId,
		    		pmPaymentType : (paymentTypeOptionsId==2)?"Debit":"Credit",
		    		pmPaymentReferenceId : paymentReferenceId,
		    		pmAmountPaid : amountPaid
		    		
		    	});
		    	//recompute total amount
			    self.computeTotalAmountPaidAndChange();
		    } else if (paymentTypeOptionsId==4) { // Returned item(s) Voucher
		    	if(self.isVoucherExisting(voucherNumber)) {
					//error message: Voucher already added
					$("#returnedItemVoucherError").text("Voucher already added");
				} else {
					var url = 'add-voucher';
					$.ajax({
						url: url,
						dataType: 'json',
						data: {voucherNumber: voucherNumber, storeId: self.loggedInUserStoreId()},
						success: function(vouchers) {
							if(vouchers.length > 0) {
								for (var x in vouchers) {
									//if voucher is not yet claimed/used
									if(vouchers[x].status=='unclaimed') {
										self.returnedItemVouchers.push({
											returnedItemVoucherNumber: ko.observable(vouchers[x].returnItemVoucherId),
											returnedItemVoucherAmount : ko.observable(vouchers[x].amount.toFixed(2))
										});
									} //error message: Voucher is already claimed/used
									else {
										$("#returnedItemVoucherError").text("Voucher is already claimed/used");
									}
									
								}
								//recompute total amount
							    self.computeTotalAmountPaidAndChange();
							} else {
								//error message: Voucher not found
								$("#returnedItemVoucherError").text("Voucher not found");
							}				
						}
					});
				}
		    }
		    //update identification
		    self.paymentMethodIdentification(pmId);
			//close the modal
			$('[id=paymentMethodModal]').click();
		};
		
		self.addVoucher = function() {
			var voucherNumber = self.voucherNumber();
			if(self.isVoucherExisting(voucherNumber)) {
				//error message: Voucher already added
				$("#returnedItemVoucherError").text("Voucher already added");
			} else {
				var url = 'add-voucher';
				$.ajax({
					url: url,
					dataType: 'json',
					data: {voucherNumber: voucherNumber, storeId: self.loggedInUserStoreId()},
					success: function(vouchers) {
						if(vouchers.length > 0) {
							for (var x in vouchers) {
								//if voucher is not yet claimed/used
								if(vouchers[x].status=='unclaimed') {
									self.returnedItemVouchers.push({
										returnedItemVoucherNumber: ko.observable(vouchers[x].returnItemVoucherId),
										returnedItemVoucherAmount : ko.observable(vouchers[x].amount.toFixed(2))
									});
									//recompute total amount
									self.computeTotalAmountPaidAndChange();
									//close the modal
									$('[id=voucherModal]').click();
								} //error message: Voucher is already claimed/used
								else {
									$("#returnedItemVoucherError").text("Voucher is already claimed/used");
								}
								
							}	
						} else {
							//error message: Voucher not found
							$("#returnedItemVoucherError").text("Voucher not found");
						}				
					}
				});
			}
			
		};
		
		self.checkoutItems = function() {
			var transactionItems = self.transactionItems();
			var returnedItemVouchers = self.returnedItemVouchers();
			var userName = self.loggedInUser();
			var storeDetails = self.storeDetailsString();
			var paymentMethods = self.paymentMethods();
			
			var url = 'checkout-items';
			
			$.ajax({
				url: url,
				contentType: 'application/json; charset=utf-8',
				data: {transactionItems: ko.toJSON(transactionItems), userName: userName, storeDetails: storeDetails,
						netAmountDue : self.netAmountDue(), amountPaid: self.totalAmountPaid(), amountChange: self.amountChange(),
						returnedItemVouchers: ko.toJSON(returnedItemVouchers), paymentMethods: ko.toJSON(paymentMethods),
						storeId: self.loggedInUserStoreId(), userId: self.loggedInUserId(), totalItems: self.totalItems(),
						vatableSale: self.vatableSale(), vat: self.vat(), paymentTypes: ko.toJSON(self.paymentTypes())},
				success: function(returnMessage) {
					if (returnMessage=='success') {
						//unselect inventory, zero the quantity, and discount
						for (var x in self.inventory()) {
							self.inventory()[x].itemSelected(false);
							self.inventory()[x].itemQuantity("");
							self.inventory()[x].itemDiscount("");
						}
						
						//reset transaction items
						self.transactionItems.removeAll();
						//reset payment mthods array
						self.paymentMethods.removeAll();
						
						//set net amount due
						self.netAmountDue(0);
						//set vatableSale
						self.vatableSale(0);
						//set tax
						self.vat(0);
						//set total items bought
						self.totalItems(0);
						
						// notify
						$.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'Items successfully checked out' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
						
						//close the modal
						$('[data-dismiss=modal]').click();
						
						
						//2.) view receipt
						
						
					}
				}
			});
			
		};
		
		self.computeOtherReceiptDetails = function() {
			var netAmountDue = 0;
			var vatableSale = 0;
			var vat = 0;
			var totalItems = 0;
			for(var x in self.transactionItems()) {
				netAmountDue += parseFloat(self.transactionItems()[x].itemPriceAfterDiscount());
				totalItems += parseInt(self.transactionItems()[x].itemQuantity());
			}
			vatableSale = (netAmountDue/100)*88;
			vat = (netAmountDue/100)*12;
			//set net amount due
			self.netAmountDue(netAmountDue.toFixed(2));
			//set vatableSale
			self.vatableSale(vatableSale.toFixed(2));
			//set tax
			self.vat(vat.toFixed(2));
			//set total items bought
			self.totalItems(totalItems);
			
		};
		
		self.addToCart = function() {
			var isInTransactionItemsArray = null;
			
			for(var x in self.inventory()) {				
				isInTransactionItemsArray = false;
				if(self.inventory()[x].itemSelected() && self.inventory()[x].itemQuantity() > 0
						&& (self.inventory()[x].itemDiscount() > 0 || self.inventory()[x].itemDiscount() == "")) {
					
					var priceTotal = (self.inventory()[x].itemQuantity() * self.inventory()[x].itemPrice()).toFixed(2);
					var itemDiscountText = "";
					var itemDiscount = 0;
					if (self.inventory()[x].itemDiscount()>0) {
						itemDiscountText = self.inventory()[x].itemDiscount() + "%(-"+ (priceTotal*(self.inventory()[x].itemDiscount()/100)).toFixed(2) + ")";
						itemDiscount = self.inventory()[x].itemDiscount();
					}
					else {
						itemDiscountText = "0%";
					}
					
					//check if item is already on transactionItems array
					for(var y in self.transactionItems()) {
						//if present, add quantity to transactionItems array
						if((self.transactionItems()[y].barCode() == self.inventory()[x].barCode()) && (self.transactionItems()[y].itemDiscount() == self.inventory()[x].itemDiscount())) {
							var itemQuantity = parseInt(self.transactionItems()[y].itemQuantity()) + parseInt(self.inventory()[x].itemQuantity());
							
							self.transactionItems()[y].itemQuantity(itemQuantity);
							priceTotal = (itemQuantity * self.inventory()[x].itemPrice()).toFixed(2);
							
							
							
							if (self.transactionItems()[y].itemDiscount()>0) {
								itemDiscountText = self.transactionItems()[y].itemDiscount() + "%(-"+ (priceTotal*(self.transactionItems()[y].itemDiscount()/100)).toFixed(2) + ")";
								itemDiscount = self.transactionItems()[y].itemDiscount();
							}
							else {
								itemDiscountText = "0%";
							}
				
							self.transactionItems()[y].itemQuantityXPrice(self.transactionItems()[y].itemQuantity() + " x " + self.inventory()[x].itemPrice());
							self.transactionItems()[y].itemPriceTotal(priceTotal);
							self.transactionItems()[y].itemDiscountText(itemDiscountText);
							self.transactionItems()[y].itemLessPrice("-"+ priceTotal*(self.transactionItems()[y].itemDiscount()/100));
							self.transactionItems()[y].itemPriceAfterDiscount((priceTotal * (1-(self.transactionItems()[y].itemDiscount()/100))).toFixed(2));
							
							isInTransactionItemsArray = true;
							break;
						}
					}
					
					//push to transaction items if it doesn't exist yet
					if (!isInTransactionItemsArray) {
						self.transactionItems.push({
							itemSelected: ko.observable(false),
							inventoryId: ko.observable(self.inventory()[x].inventoryId()),
							itemName: ko.observable(self.inventory()[x].itemName()),
							barCode: ko.observable(self.inventory()[x].barCode()),
							itemDescription: ko.observable(self.inventory()[x].itemDescription()),
							itemPrice: ko.observable(self.inventory()[x].itemPrice()),
							itemQuantity: ko.observable(self.inventory()[x].itemQuantity()),
							itemQuantityXPrice : ko.observable(self.inventory()[x].itemQuantity() + " x " + self.inventory()[x].itemPrice()),
							itemPriceTotal : ko.observable(priceTotal),
							itemDiscount: ko.observable(itemDiscount),
							itemDiscountText: ko.observable(itemDiscountText),
							itemLessPrice: ko.observable("-"+ priceTotal*(self.inventory()[x].itemDiscount()/100)),
							itemPriceAfterDiscount: ko.observable((priceTotal * (1-(self.inventory()[x].itemDiscount()/100))).toFixed(2))
						});
					}
					
					//compute other details
					self.computeOtherReceiptDetails();
					
				}
			}
			
		};
		
		self.removeFromCart = function(inventory, event) {
			// get inventoryId of the row
			var inventoryId = event.currentTarget.id;
			
			for(var x in self.transactionItems()) {
				if(self.transactionItems()[x].inventoryId()==inventoryId) {
					//remove from transaction
					self.transactionItems.remove(inventory);
					//Do paging
			        self.doPaging(self.pageSize(), self.currPage());
			        break;
				}
				
			}

			//compute other details
			self.computeOtherReceiptDetails();
			
		};
		
		self.removeVoucher = function(voucher, event) {
			// get inventoryId of the row
			var voucherId = event.currentTarget.id;
			
			for(var x in self.returnedItemVouchers()) {
				if(self.returnedItemVouchers()[x].returnedItemVoucherNumber()==voucherId) {
					//remove from vouchers array
					self.returnedItemVouchers.remove(voucher);
			        break;
				}
				
			}
			
			//recompute totalAmountPaid
			self.computeTotalAmountPaidAndChange();
		};
		
		self.removePayment = function(payment, event) {
			// get inventoryId of the row
			var pmId = event.currentTarget.id;
			
			for(var x in self.paymentMethods()) {
				if(self.paymentMethods()[x].pmId==pmId) {
					//remove from payment methods array
					self.paymentMethods.remove(payment);
			        break;
				}
				
			}
			//recompute totalAmountPaid
			self.computeTotalAmountPaidAndChange();
		};
		
		self.searchItems = function() {
	    	var searchString = self.searchString();
	    	self.searchResultsArray.removeAll();
	    	
	    	if(searchString != '') {
	    		for(var x in self.inventoryCopy()) {
	    			if ((self.inventoryCopy()[x].itemName().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.inventoryCopy()[x].barCode().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    				) {
	    				self.searchResultsArray.push(self.inventoryCopy()[x]);
	    			}
	    		}
	    	}
	    	else {
	    		self.searchResultsArray(self.inventoryCopy().slice());
	    	}
	    	
	    	//Do paging
	        self.doPaging(self.pageSize(), self.currPage());
	    };
	    
	    self.cancelEdit = function() {
	    	//Clear the values of the form
	    	self.inventoryid("");
			self.barcode("");
			self.itemdescription("");
			self.itemprice("");
			self.itemquantity("");
			self.itemdiscount(""); 
			self.areaid("");
			self.storeid("");
			self.itemname("");
			
			//for check out
			self.amountDue(0);
			self.amountPaid("");
			self.amountChange(0);
			self.returnedItemVouchers.removeAll();
			
			//for voucher
			self.voucherNumber("");
	    };
	    
	    self.addToCartThruBarcode = function() {
	    	var isInTransactionItemsArray = null;
	    	//check if item is already on transactionItems array
			for(var x in self.transactionItems()) {
				isInTransactionItemsArray = false;
				//if present, add quantity to transactionItems array
				if((self.transactionItems()[x].barCode() == self.barcode()) && (self.transactionItems()[x].itemDiscount() == self.itemdiscount())) {
					var itemQuantity = parseInt(self.itemquantity()) + parseInt(self.transactionItems()[x].itemQuantity());
					self.transactionItems()[x].itemQuantity(itemQuantity);
					priceTotal = (itemQuantity * self.transactionItems()[x].itemPrice()).toFixed(2);
					
					
					
					if (self.transactionItems()[x].itemDiscount()>0) {
						itemDiscountText = self.transactionItems()[x].itemDiscount() + "%(-"+ (priceTotal*(self.transactionItems()[x].itemDiscount()/100)).toFixed(2) + ")";
						itemDiscount = self.transactionItems()[x].itemDiscount();
					}
					else {
						itemDiscountText = "0%";
					}
		
					self.transactionItems()[x].itemQuantityXPrice(self.transactionItems()[x].itemQuantity() + " x " + self.transactionItems()[x].itemPrice());
					self.transactionItems()[x].itemPriceTotal(priceTotal);
					self.transactionItems()[x].itemDiscountText(itemDiscountText);
					self.transactionItems()[x].itemLessPrice("-"+ priceTotal*(self.transactionItems()[x].itemDiscount()/100));
					self.transactionItems()[x].itemPriceAfterDiscount((priceTotal * (1-(self.transactionItems()[x].itemDiscount()/100))).toFixed(2));
					
					isInTransactionItemsArray = true;
					break;
				}
			}
	    	
	    	var priceTotal = (self.itemquantity() * self.itemprice()).toFixed(2);
			var itemDiscountText = "";
			var itemDiscount = 0;
			if (self.itemdiscount()>0) {
				itemDiscountText = self.itemdiscount() + "%(-"+ (priceTotal*(self.itemdiscount()/100)).toFixed(2) + ")";
				itemDiscount = self.itemdiscount();
			}
			else {
				itemDiscountText = "0%";
			}
			
			//push to transaction items if it doesn't exist yet
			if (!isInTransactionItemsArray) {
				self.transactionItems.push({
					itemSelected: ko.observable(false),
					inventoryId: ko.observable(self.inventoryid()),
					itemName: ko.observable(self.itemname()),
					barCode: ko.observable(self.barcode()),
					itemDescription: ko.observable(self.itemdescription()),
					itemPrice: ko.observable(self.itemprice()),
					itemQuantity: ko.observable(self.itemquantity()),
					itemQuantityXPrice : ko.observable(self.itemquantity() + " x " + self.itemprice()),
					itemPriceTotal : ko.observable(priceTotal),
					itemDiscount: ko.observable(itemDiscount),
					itemDiscountText: ko.observable(itemDiscountText),
					itemLessPrice: ko.observable("-"+ priceTotal*(self.itemdiscount()/100)),
					itemPriceAfterDiscount: ko.observable((priceTotal * (1-(self.itemdiscount()/100))).toFixed(2))
				});
			}
			
			//compute other details
			self.computeOtherReceiptDetails();
			
			//clear data on form
			self.cancelEdit();
			
			//close the modal
			$('[data-dismiss=modal]').click();
			
	    };
		
		self.doPaging = function(pageSize, nextPage) {
	    	
	    	var inventoryArray = ko.observableArray([]);
	    	//make a copy of the results
	    	if(self.searchString() != '') {
	    		inventoryArray(self.searchResultsArray.slice());
	    	}
	    	else {
	    		inventoryArray(self.inventoryCopy().slice()); 
	    	}
	    	
	    	//clear items
	    	self.inventory.removeAll();
	    	
	    	//set current page as next page if nextPage is defined
	    	if(nextPage)
	    		self.currPage(nextPage);
	    	
	    	//set page size
	    	self.pageSize(pageSize);
	    	
	    	//calculate number of pages
	        self.NumberPages(Math.ceil(inventoryArray().length/self.pageSize()));
	        
	        //clear pages array
	        self.pagesArray.removeAll();
	        
	        //populate pagesArray
	        for(var i = 0; i < self.NumberPages(); i++) {
	        	self.pagesArray.push({
	        		pageNumber: ko.observable((i+1))
	        	});
	        }
	        
	        //set max number of pages
	        self.maxNumberPages(self.NumberPages());
	        
	        //if current page is greater than max number of pages, set currPage = maxNumberPages
	        if(self.currPage() > self.maxNumberPages())
	        	self.currPage(self.maxNumberPages());
	        
	        //if maxNumberPages is less than 1, set currPage to 1
	        if(self.maxNumberPages() < 1)
	        	self.currPage(1);
	        
	        var startIndex = (self.currPage()-1)*self.pageSize();

	    	for(var i = startIndex; i < (self.pageSize() + startIndex); i++) {
	    		if(inventoryArray()[i]) {
	    			self.inventory.push(inventoryArray()[i]);
	    		}
	    		else {
	    			break;
	    		}
	    		
	    	}
	    };
	}
	ko.applyBindings(new POSViewModel());
});