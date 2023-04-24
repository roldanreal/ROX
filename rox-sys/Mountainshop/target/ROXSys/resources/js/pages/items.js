/**
 * This is the Jquery file for the items.jsp page
 */
if(Cookies.get('usertype')!=1) {
	//redirect to home page
	window.location.replace('home');
}
$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
    
	function Item(item) {
	    this.itemId = ko.observable(item.itemId);
	    this.barCode = ko.observable(item.barCode);
	    this.itemname = ko.observable(item.itemname);
	    this.itemdesc = ko.observable(item.itemdesc);
	    this.price = ko.observable(item.price);
	    this.delItemTitle = ko.observable("Delete item " + item.itemId);
	    this.editItemTitle = ko.observable("Edit item " + item.itemId);
	}
	// Overall viewmodel for this screen, along with initial state
	function ItemsViewModel() {
		var self = this;
	    
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		
		//These are the fields used in the add/edit items form
		self.itemid = ko.observable(0);
		self.itemName = ko.observable("");
		self.barcode = ko.observable("");
		self.itemDesc = ko.observable("");
		self.itemPrice = ko.observable("");
		
		//These are used in search
		self.searchString = ko.observable("");
		self.searchResultsArray = ko.observableArray([]);
		
		//used in the list
	    self.items = ko.observableArray([]);
	    
	    //copy of self.items, this one will be used in searching
	    self.itemsCopy = ko.observableArray([]);
	    
	    //for paging
	    self.pageSize = ko.observable(10);
	    self.NumberPages = ko.observable(1);
	    self.currPage = ko.observable(1);
	    self.pagesArray = ko.observableArray([]);
	    self.maxNumberPages = ko.observable(1);
	    
	    // get the list of items on first load from DB
	    $.getJSON("get-items", function(allData) {
	        var mappedItems = $.map(allData, function(item) { return new Item(item); });
	        
	        //make a copy of the items
	        self.itemsCopy(mappedItems);
	        
	        //Do paging on first load
	        self.doPaging(self.pageSize());
	        
	    });  
	    
	    
	    self.displayAddItem = function() {
	    	//change the modal title and button text
	    	$(".modal-title").text("Add new item");
			$("#editItemSumbitButton").text("Add");
			
			//enable item name text input
			$("#itemNameInput").prop('disabled', false);
			
			//Clear the values inside the form
			self.itemid("");
			self.barcode("");
			self.itemName("");
			self.itemDesc("");
			self.itemPrice("");
			
			//show the Edit modal
			$('#editItemModal').modal('show');
	    };
	    
	    self.displayItem = function() {
	    	//change the modal title and button text
	    	$(".modal-title").text("Edit item");
			$("#editItemSumbitButton").text("Update");
	    	
			//disable item name text input
			$("#itemNameInput").prop('disabled', true);
			
	    	//map the values to modal form
	    	self.itemid(this.itemId());
			self.itemName(this.itemname());
			self.barcode(this.barCode());
			self.itemDesc(this.itemdesc());
			self.itemPrice(this.price());
	    	
			//show the modal
			$('#editItemModal').modal('show');
	    };
	    
	    self.cancelEdit = function() {
	    	//Clear the values of the form
	    	self.itemid(0);
			self.itemName("");
			self.barcode("");
			self.itemDesc("");
			self.itemPrice("");
	    };
	    
	    self.editItem = function() {
	    	var itemId = this.itemid();
	    	var itemName = this.itemName();
	    	var barCode = this.barcode();
	    	var itemDesc = this.itemDesc();
	    	var itemPrice = this.itemPrice();
			
	    	//Add new item
	    	if(itemId==0) {
	    		var url = 'add-item';
				$.ajax({
					url: url,
					dataType: 'json',
					data: {itemName: itemName, barCode: barCode, itemDesc: itemDesc, itemPrice: itemPrice},
					success: function(item) {	
						//close the modal
						$('[data-dismiss=modal]').click();
						
						if(self.searchString() != '') {
							self.searchResultsArray.push({
								itemId : ko.observable(item.itemId),
								itemname : ko.observable(item.itemname),
								barCode : ko.observable(item.barCode),
							    itemdesc : ko.observable(item.itemdesc),
							    price: ko.observable(item.price),
							    delItemTitle : ko.observable("Delete item " + item.itemId),
							    editItemTitle : ko.observable("Edit item " + item.itemId)
							});
				    	}
						else {
							self.searchResultsArray.push({
								itemId : ko.observable(item.itemId),
								itemname : ko.observable(item.itemname),
								barCode : ko.observable(item.barCode),
							    itemdesc : ko.observable(item.itemdesc),
							    price: ko.observable(item.price),
							    delItemTitle : ko.observable("Delete item " + item.itemId),
							    editItemTitle : ko.observable("Edit item " + item.itemId)
							});
						}
						//add also in the copy
						self.itemsCopy.push({
							itemId : ko.observable(item.itemId),
							itemname : ko.observable(item.itemname),
							barCode : ko.observable(item.barCode),
						    itemdesc : ko.observable(item.itemdesc),
						    price: ko.observable(item.price),
						    delItemTitle : ko.observable("Delete item " + item.itemId),
						    editItemTitle : ko.observable("Edit item " + item.itemId)
						});
						
						//Do paging
				        self.doPaging(self.pageSize(), self.currPage());
				        
						//notify that adding is successful
						$.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'Item successfully added' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
					},
					error: function(jqXHR, textStatus, errorThrown) {
						errorMessage = "Cannot add item. Please check if bar code " +
						"or item name already exist. Or try again later.";
						//Display error message
						$("#editItemError").html(errorMessage);
					}
				});
	    	}
	    	//Edit the item
	    	else {
	    		var url = 'update-item';
				$.ajax({
					type: 'GET',
					url: url,
					data: {itemId: itemId, itemName: itemName, barCode: barCode, itemDesc: itemDesc, itemPrice: itemPrice},
					success: function() {
							//loop through the items and update the value
							for(var i = 0; i<self.items().length; i++) {
								if (self.items()[i].itemId() == itemId) {
									self.items()[i].itemname(itemName);
									self.items()[i].barCode(barCode);
									self.items()[i].itemdesc(itemDesc);
									self.items()[i].price(itemPrice);
					                break;
					            }
							}
							//loop through the items copy and update the value
							for(var i = 0; i<self.itemsCopy().length; i++) {
								if (self.itemsCopy()[i].itemId() == itemId) {
									self.itemsCopy()[i].itemname(itemName);
									self.items()[i].barCode(barCode);
									self.itemsCopy()[i].itemdesc(itemDesc);
									self.items()[i].price(itemPrice);
					                break;
					            }
							}
							//Do paging
					        self.doPaging(self.pageSize(), self.currPage());
					        
					        $.notify({
								// options
								icon: 'glyphicon glyphicon-ok',
								message: 'Item successfully updated' 
							},{
								// settings
								type: 'success',
								delay: 1000,
								offset: 55,
							});
						$('[data-dismiss=modal]').click();
						
					},
					error: function() {
						errorMessage = "Cannot add item. Please check if bar code " +
						"or item name already exist. Or try again later.";
						//Display error message
						$("#editItemError").html(errorMessage);
						return false;
					},
				});
			}
			return true;
	    };
	    
	    self.removeItem = function(item, event) {
	    	
	    	// get itemId of the row
			var itemId = event.currentTarget.id;
			
			bootbox.confirm({
				message: "You are about to delete item " + itemId + ".\nDo you want to proceed?",
				closeButton: false,
				size: "small",
			    callback: function(result){
			    	if(result) {
						var url = 'delete-' + itemId + '-item';
						$.ajax({
							url: url,
							success: function() {
								//remove the element from the table
								if(self.searchString() != '') {
									//remove from searchResultsArray
									for(var x in self.searchResultsArray()) {
										if(self.searchResultsArray()[x].itemId() == itemId) {
											self.searchResultsArray.remove(self.searchResultsArray()[x]);
											break;
										}
									}
						    	}
						    	else {
						    		self.items.remove(item); 
						    	}
								
								//remove also from the copy
								for(var x in self.itemsCopy()) {
									if(self.itemsCopy()[x].itemId() == itemId) {
										self.itemsCopy.remove(self.itemsCopy()[x]);
										break;
									}
								}
								
								//Do paging
						        self.doPaging(self.pageSize(), self.currPage());
						        
								$.notify({
									// options
									icon: 'glyphicon glyphicon-ok',
									message: 'Item successfully deleted' 
								},{
									// settings
									type: 'success',
									delay: 1000,
									offset: 55,
								});
							},
							error: function(jqXHR, textStatus, errorThrown) {
							    alert("error:" + textStatus + " exception:" + errorThrown);
							},
						});
					}
			    }
			});
	    };
	    
	    self.searchItems = function() {
	    	var searchString = self.searchString();
	    	self.searchResultsArray.removeAll();
	    	
	    	if(searchString != '') {
	    		for(var x in self.itemsCopy()) {
	    			if ((self.itemsCopy()[x].itemname().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.itemsCopy()[x].itemdesc().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.itemsCopy()[x].barCode().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    				) {
	    				self.searchResultsArray.push(self.itemsCopy()[x]);
	    			}
	    		}
	    	}
	    	else {
	    		self.searchResultsArray(self.itemsCopy().slice());
	    	}
	    	
	    	//Do paging
	        self.doPaging(self.pageSize(), self.currPage());
	    };
	    
	    self.doPaging = function(pageSize, nextPage) {
	    	
	    	var itemsArray = ko.observableArray([]);
	    	//make a copy of the results
	    	if(self.searchString() != '') {
	    		itemsArray(self.searchResultsArray.slice());
	    	}
	    	else {
	    		itemsArray(self.itemsCopy().slice()); 
	    	}
	    	
	    	//clear items
	    	self.items.removeAll();
	    	
	    	//set current page as next page if nextPage is defined
	    	if(nextPage)
	    		self.currPage(nextPage);
	    	
	    	//set page size
	    	self.pageSize(pageSize);
	    	
	    	//calculate number of pages
	        self.NumberPages(Math.ceil(itemsArray().length/self.pageSize()));
	        
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
	    		if(itemsArray()[i]) {
	    			self.items.push(itemsArray()[i]);
	    		}
	    		else {
	    			break;
	    		}
	    		
	    	}
	    };
	    
	}
	ko.applyBindings(new ItemsViewModel());
});