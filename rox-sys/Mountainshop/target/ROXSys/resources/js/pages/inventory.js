/**
 * This is the Jquery file for the inventory.jsp page
 */

$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
	function Inventory(inventory) {
	    this.inventoryId = ko.observable(inventory.inventoryId);
	    this.inventoryItemId = ko.observable(inventory.itemId);
	    this.itemname = ko.observable(inventory.itemName);
	    this.itemdescription = ko.observable(inventory.itemDescription);
	    this.barCode = ko.observable(inventory.barCode);
	    this.itemCount = ko.observable(inventory.itemQuantity);
	    this.inventoryStoreId = ko.observable(inventory.storeId);
	    this.inventoryStoreAreaId = ko.observable(inventory.areaId);
	    this.delInventoryTitle = ko.observable("Remove inventory " + inventory.inventoryId);
	    this.editInventoryTitle = ko.observable("Edit inventory " + inventory.inventoryId);
	}
	
	function SearchInventory(inventory) {
		this.searchStoreBranch = ko.observable(inventory.store.branchName);
		this.searchItemName = ko.observable(inventory.item.itemname);
		this.searchItemDescription = ko.observable(inventory.item.itemdesc);
		this.searchItemBarCode = ko.observable(inventory.item.barCode);
		this.searchItemQuantity = ko.observable(inventory.itemCount);
	}
	
	function Item(item) {
	    this.itemId = ko.observable(item.itemId);
	    this.itemName = ko.observable(item.itemname);
	}
	
	function Area(area) {
	    this.areaId = ko.observable(area.areaId);
	    this.areaName = ko.observable(area.areaName);
	}
	
	function Store(store) {
	    this.storeId = ko.observable(store.storeId);
	    this.area_id = ko.observable(store.area.areaId);
	    this.branchName = ko.observable(store.branchName);
	}
	
	// Overall viewmodel for this screen, along with initial state
	function InventoryViewModel() {
		var self = this;
		
		//list of inventory
		self.inventory = ko.observableArray([]);
		self.inventoryCopy = ko.observableArray([]);
		self.searchInventoryArray = ko.observableArray([]);
		
		//list of items
		self.items = ko.observableArray([]);
		self.itemsCopy = ko.observableArray([]);
		
		//list of areas
		self.areas = ko.observableArray([]);
		
		//list of store branches
		self.stores = ko.observableArray([]);
		self.stores2 = ko.observableArray([]); //for search other stores
		self.storesCopy = ko.observableArray([]);
		
		//used in select (viewing inventory)
		self.areaid1 = ko.observable();
		self.storeid1 = ko.observable();
		
		//used in select (search inventory from other stores)
		self.searchItem = ko.observable("");
		self.searchBarcode = ko.observable();
		self.areaid2 = ko.observable();
		self.storeid2 = ko.observable();
		
		//used in current store inventory displayed
		self.currentResultStoreId = ko.observable();
		
		//used in modal forms
		self.formInventoryId = ko.observable(0);
		self.formItemName = ko.observable("");
		self.formItemQuantity = ko.observable("");
		self.inventory_itemId = ko.observable(0);
		
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		
		//for paging
	    self.pageSize = ko.observable(10);
	    self.NumberPages = ko.observable(1);
	    self.currPage = ko.observable(1);
	    self.pagesArray = ko.observableArray([]);
	    self.maxNumberPages = ko.observable(1);
	    
	    //These are used in search
		self.searchString = ko.observable("");
		self.searchResultsArray = ko.observableArray([]);
		
		
		//on first load, decide what button to show
		self.displayButtons = function() {
			if(self.loggedInUsertype()!=1) {
				$("#addInventoryButton").css('display', 'none');
				$("#searchFromOther").css('display', 'inline');
				$(".searchInventory").css('display', 'none');
			} else {
				$("#searchFromOther").css('display', 'none');
				$(".searchInventory").css('display', 'inline');
				if(self.inventoryCopy().length>0) {
					$("#addInventoryButton").css('display', 'inline');
				}
			}
		};
		
		//call displayButtons method
		self.displayButtons();
		
		self.getInventory = function() {
			var storeId = null;
			if(self.loggedInUsertype()!=1) {
				storeId = self.loggedInUserStoreId();
			} else {
				storeId = self.storeid1();
			}
			var url = 'get-inventory';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {storeId: storeId},
				success: function(allData) {
					var mappedItems = $.map(allData, function(inventory) { return new Inventory(inventory); });
			        
			        //make a copy of the inventory
			        self.inventoryCopy(mappedItems);
			        //save in inventory
			        self.inventory(self.inventoryCopy().slice());
			        
			        //display button
			        self.displayButtons();
			        
			        //set current result store Id
			        self.currentResultStoreId(storeId);
			        //get the items
			        self.getItems();
			        //Do paging
			        self.doPaging(self.pageSize());
			        
			        
			        
				}
			});
		};
		
		//call getInventory method for non-admin
		if(self.loggedInUsertype()!=1) {
			self.getInventory();
			
		}
		
		//get the list of areas on first load from DB
	    $.getJSON("get-areas", function(allData) {
	        var mappedItems = $.map(allData, function(area) { return new Area(area); });
	        //fill areas array
	        self.areas(mappedItems);
	    });
		self.getItems = function() {
			//clear items array first
			self.items.removeAll();
			self.itemsCopy.removeAll();
			//get the list of items on first load from DB
		    $.getJSON("get-items", function(allData) {
		        var mappedItems = $.map(allData, function(item) { return new Item(item); });
		        //fill items array
		        self.items(mappedItems);
		        //have a copy
		        self.itemsCopy(self.items().slice());
		        //update inventory items to be added
		        self.updateItems();
		    }); 
		};
		self.getStores = function() {
			//get the list of stores from DB
		    $.getJSON("get-stores", function(allData) {
		        var mappedItems = $.map(allData, function(store) { return new Store(store); });
		        //fill stores array
		        self.stores(mappedItems);
		        //have a copy
		        self.storesCopy(self.stores.slice());
		        //fill stores array for searching from other stores
		        self.stores2(self.stores.slice());
		        
		        //set the initial value of area, if user type is not Admin
		        if(self.loggedInUsertype() != 1) {
		        	for(var x in self.storesCopy()) {
						if(self.storesCopy()[x].storeId() == self.loggedInUserStoreId()) {
							self.areaid1(self.storesCopy()[x].area_id());
							break;
						}
					}
		        }
		        //set store id in dropdown if user not admin
		        if(self.loggedInUsertype()!=1) {
		        	self.storeid1(self.loggedInUserStoreId());
		        }
		        
		    });
		};
		
		//get stores
		self.getStores();
		
		self.updateItems = function() {
			for(var i in self.itemsCopy()) {
	        	for(var j in self.inventory()) {
	        		if(self.itemsCopy()[i].itemId() == self.inventory()[j].inventoryItemId()) {
	        			self.items.remove(self.itemsCopy()[i]);
	        		}
	        	}
			}
		};
	    //display add inventory modal
	    self.displayAddInventory = function() {	    	
	    	//empty error
			$("#editInventoryError").html("");
			self.inventory_itemId(0);
			//show the Edit modal
			$('#editInventoryModal').modal('show');
	    };
	    
	    //display search inventory from other stores modal
	    self.displaySearchFromOther = function() {
	    	//Clear values of search inventory form
	    	self.searchItem("");
			self.searchBarcode(null);
			self.areaid2(null);
			self.storeid2(null);
			
	    	//empty error
			$("#searchFromOtherError").html("");
			self.inventory_itemId(0);
			//show the Edit modal
			$('#searchFromOtherModal').modal('show');
	    };
	    
	    self.displayInventoryQuantity = function() {
	    	//map the values to modal form
	    	self.formInventoryId(this.inventoryId());
	    	self.formItemName(this.itemname());
	    	self.formItemQuantity(""+this.itemCount());
	    	
			//show the modal
			$('#editInventoryQuantityModal').modal('show');
	    };
	    
	    self.cancelEdit = function() {
	    	//Clear the values of the form
	    	self.formItemName("");
	    	self.formItemQuantity("");
	    };
	    
	    self.cancelSearch = function() {
	    	//Clear values of search inventory form
	    	self.searchItem("");
			self.searchBarcode(null);
			self.areaid2(null);
			self.storeid2(null);
	    };
	    
	    self.closeViewResult = function() {
	    	//clear search inventory result array
	    	self.searchInventoryArray.removeAll();
	    };
	    
	    self.searchFromOther = function() {
	    	
	    	//Clear error message
			
	    	var searchItem = self.searchItem();
			var searchBarcode = self.searchBarcode();
			var areaid2 = self.areaid2();
			var storeid2 = self.storeid2();
			
	    	var url = 'search-inventory';
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: url,
				data: {areaid2: areaid2, storeid2: storeid2, searchItem: searchItem, searchBarcode: searchBarcode},
				success: function(allData) {
					var mappedItems = $.map(allData, function(inventory) { return new SearchInventory(inventory); });
					//fill search inventory array
				    self.searchInventoryArray(mappedItems);
				    
				    if(self.searchInventoryArray().length==0) {
				    	errorMessage = "No inventory found.";
						//Display error message
						$("#searchFromOtherError").html(errorMessage);
						return false;
				    } else {
				    	//Clear error message
				    	errorMessage = "";
						//Display error message
						$("#searchFromOtherError").html(errorMessage);
						//return false;
				    	//Display inventory
				    	$('#viewInventoryModal').modal('show');
				    }				
				},
				error: function() {
					errorMessage = "Something is wrong. Please try again later.";
					//Display error message
					$("#searchFromOtherError").html(errorMessage);
					return false;
				},
			});
	    };
	    
	    self.editInventory = function() {
	    	var inventoryId = this.formInventoryId();
	    	var itemCount = this.formItemQuantity();
	    	
	    	var url = 'update-inventory';
			$.ajax({
				type: 'GET',
				url: url,
				data: {inventoryId: inventoryId, itemCount: itemCount},
				success: function() {
						//loop through the inventory and update the value
						for(var i = 0; i<self.inventory().length; i++) {
							if (self.inventory()[i].inventoryId() == inventoryId) {
								self.inventory()[i].itemCount(itemCount);
				                break;
				            }
						}
				        $.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'Inventory item successfully updated' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
					$('[data-dismiss=modal]').click();
					
				},
				error: function() {
					errorMessage = "Cannot edit item. Please try again later.";
					//Display error message
					$("#editItemError").html(errorMessage);
					return false;
				},
			});
	    };
	    
	    self.addInventory = function() {
	    	var areaId = this.areaid1();
	    	var storeId = this.storeid1();
	    	var itemId = this.inventory_itemId();
	    	
	    	var url = 'add-inventory';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {storeId: storeId, itemId: itemId},
				success: function(inventory) {
					//close the modal
					$('[data-dismiss=modal]').click();
					//remove from items
					for(var i in self.items()) {
			        	if(self.items()[i].itemId() == itemId) {
			        		self.items.remove(self.items()[i]);
			        		break;
			        	}
					}
					var itemName = "";
					for(var i in self.itemsCopy()) {
			        	if(self.itemsCopy()[i].itemId() == itemId) {
			        		itemName = self.itemsCopy()[i].itemName();
			        		break;
			        	}
					}
					if(self.searchString() != '') {
						self.searchResultsArray.push({
							inventoryId : ko.observable(inventory.inventoryId),
							inventoryItemId : ko.observable(inventory.item.itemId),
							itemname: ko.observable(itemName),
							itemdescription : ko.observable(inventory.item.itemdesc),
							barCode : ko.observable(inventory.item.barCode),
							itemCount : ko.observable(inventory.itemCount),
							inventoryStoreId: ko.observable(inventory.store.storeId),
							inventoryStoreAreaId: ko.observable(areaId),
							delInventoryTitle : ko.observable("Remove inventory " + inventory.inventoryId),
							editInventoryTitle : ko.observable("Edit inventory " + inventory.inventoryId)
						});
			    	}
					else {
						self.searchResultsArray.push({
							inventoryId : ko.observable(inventory.inventoryId),
							inventoryItemId : ko.observable(inventory.item.itemId),
							itemname: ko.observable(itemName),
							itemdescription : ko.observable(inventory.item.itemdesc),
							barCode : ko.observable(inventory.item.barCode),
							itemCount : ko.observable(inventory.itemCount),
							inventoryStoreId: ko.observable(inventory.store.storeId),
							inventoryStoreAreaId: ko.observable(areaId),
							delInventoryTitle : ko.observable("Remove inventory " + inventory.inventoryId),
							editInventoryTitle : ko.observable("Edit inventory " + inventory.inventoryId)
						});
					}
					//add also in the copy
					self.inventoryCopy.push({
						inventoryId : ko.observable(inventory.inventoryId),
						inventoryItemId : ko.observable(inventory.item.itemId),
						itemname: ko.observable(itemName),
						itemdescription : ko.observable(inventory.item.itemdesc),
						barCode : ko.observable(inventory.item.barCode),
						itemCount : ko.observable(inventory.itemCount),
						inventoryStoreId: ko.observable(inventory.store.storeId),
						inventoryStoreAreaId: ko.observable(areaId),
						delInventoryTitle : ko.observable("Remove inventory " + inventory.inventoryId),
						editInventoryTitle : ko.observable("Edit inventory " + inventory.inventoryId)
					});
					
					//Do paging
			        self.doPaging(self.pageSize(), self.currPage());
					//notify that adding is successful
					$.notify({
						// options
						icon: 'glyphicon glyphicon-ok',
						message: 'Inventory item successfully added' 
					},{
						// settings
						type: 'success',
						delay: 1000,
						offset: 55,
					});		
				}
			});
	    };
	    self.removeInventoryItem = function(inventory, event) {
	    	//get inventoryId of the row
			var inventoryId = event.currentTarget.id;
			bootbox.confirm({
				message: "You are about to delete inventory item " + inventoryId + ".\nDo you want to proceed?",
				closeButton: false,
				size: "small",
			    callback: function(result){
			    	if(result) {
						var url = 'delete-' + inventoryId + '-inventory';
						$.ajax({
							url: url,
							success: function() {
								//add to items
								var itemId = 0;
								var itemName = "";
								for(var i in self.inventory()) {
						        	if(self.inventory()[i].inventoryId() == inventoryId) {
						        		itemId = self.inventory()[i].inventoryItemId();
						        		itemName = self.inventory()[i].itemname();
						        		break;
						        	}
								}
								self.items.push({
									itemId : ko.observable(itemId),
									itemName : ko.observable(itemName)
								});
								
								//remove the element from the table
								if(self.searchString() != '') {
									//remove from searchResultsArray
									for(var x in self.searchResultsArray()) {
										if(self.searchResultsArray()[x].inventoryId() == inventoryId) {
											self.searchResultsArray.remove(self.searchResultsArray()[x]);
											break;
										}
									}
						    	}
						    	else {
						    		self.inventory.remove(inventory); 
						    	}
								
								//remove also from the copy
								for(var x in self.itemsCopy()) {
									if(self.inventoryCopy()[x].inventoryId() == inventoryId) {
										self.inventoryCopy.remove(self.inventoryCopy()[x]);
										break;
									}
								}
								
								//Do paging
						        self.doPaging(self.pageSize(), self.currPage());
						        		
								$.notify({
									// options
									icon: 'glyphicon glyphicon-ok',
									message: 'Inventory item successfully deleted' 
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
	    
	    //listen if new areaid1 is selected in selection
	    self.areaid1.subscribe(function(newAreaIdValue) {
	    	//clear inventory and stores array
	    	self.inventory.removeAll();
	    	
	    	if(newAreaIdValue) {
	    		//update inventory
	    		for(var x in self.inventoryCopy()) {
	    			if ((self.inventoryCopy()[x].inventoryStoreAreaId() == newAreaIdValue)) {
	    				self.inventory.push(self.inventoryCopy()[x]);
	    			}
	    		}
	    		//clear stores array
	    		self.stores.removeAll();
	    		//update the selection in store branches
	    		for(var x in self.storesCopy()) {
	    			if ((self.storesCopy()[x].area_id() == newAreaIdValue)) {
	    				self.stores.push(self.storesCopy()[x]);
	    			}
	    		}
	    		
	    	}
	    	else {
	    		if(self.storeid1()) {
	    			for(var x in self.inventoryCopy()) {
		    			if ((self.inventoryCopy()[x].inventoryStoreId() == self.storeid1())) {
		    				self.inventory.push(self.inventoryCopy()[x]);
		    			}
		    		}
	    		}
	    		else {
	    			self.inventory(self.inventoryCopy().slice());
	    		}
	    		//return copy of stores
	    		self.stores(self.storesCopy().slice());
	    		
	    	}
	    });
	    
	    //listen if new areaid2 is selected in selection
	    self.areaid2.subscribe(function(newAreaIdValue) {
	  
	    	if(newAreaIdValue) {
	    		//clear stores array
	    		self.stores2.removeAll();
	    		//update the selection in store branches
	    		for(var x in self.storesCopy()) {
	    			if ((self.storesCopy()[x].area_id() == newAreaIdValue)) {
	    				self.stores2.push(self.storesCopy()[x]);
	    			}
	    		}
	    		
	    	}
	    	else {
	    		//return copy of stores
	    		self.stores2(self.storesCopy().slice());
	    		
	    	}
	    });
	    
	    //listen if new storeid1 is selected in selection
	    self.storeid1.subscribe(function(newStoreIdValue) {
	    	//alert('subscribe store');
	    	self.inventory.removeAll();
	    	//update the selection in store branches
	    	if(newStoreIdValue) {
	    		for(var x in self.inventoryCopy()) {
	    			if ((self.inventoryCopy()[x].inventoryStoreId() == newStoreIdValue)) {
	    				self.inventory.push(self.inventoryCopy()[x]);
	    			}
	    		}
	    	}
	    	else {
	    		if(self.areaid1()) {
	    			for(var x in self.inventoryCopy()) {
		    			if ((self.inventoryCopy()[x].inventoryStoreAreaId() == self.areaid1())) {
		    				self.inventory.push(self.inventoryCopy()[x]);
		    			}
		    		}
	    		}
	    		else {
	    			self.inventory(self.inventoryCopy().slice());
	    		}
	    	}
	    });
	    self.searchInventory = function() {
	    	var searchString = self.searchString();
	    	self.searchResultsArray.removeAll();
	    	
	    	if(searchString != '') {
	    		for(var x in self.inventoryCopy()) {
	    			if ((self.inventoryCopy()[x].itemname().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)) {
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
	    self.doPaging = function(pageSize, nextPage) {
	    	
	    	var inventoryArray = ko.observableArray([]);
	    	//make a copy of the results
	    	if(self.searchString() != '') {
	    		inventoryArray(self.searchResultsArray.slice());
	    	}
	    	else {
	    		inventoryArray(self.inventoryCopy().slice()); 
	    	}
	    	
	    	//clear inventory
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
	
	ko.applyBindings(new InventoryViewModel());
	
});