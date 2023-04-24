/**
 * This is the Jquery file for the stores.jsp page
 */
if(Cookies.get('usertype') != 1) {
	//redirect to home page
	window.location.replace('home');
}
$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
	function Store(store) {
	    this.storeId = ko.observable(store.storeId);
	    this.area = ko.observable(store.area.areaName);
	    this.area_id = ko.observable(store.area.areaId);
	    this.branchName = ko.observable(store.branchName);
	    this.tin = ko.observable(store.tin);
	    this.address = ko.observable(store.address);
	    this.coordinates = ko.observable(store.coordinates);
	    this.delItemTitle = ko.observable("Delete item " + store.storeId);
	    this.editItemTitle = ko.observable("Edit item " + store.storeId);
	}
	
	function Area(area) {
	    this.areaId = ko.observable(area.areaId);
	    this.areaName = ko.observable(area.areaName);
	}
	
	// Overall viewmodel for this screen, along with initial state
	function StoresViewModel() {
		var self = this;
		
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		
		//used in the list
		self.stores = ko.observableArray([]);
		self.areas = ko.observableArray([]);
		
		//copy of self.stores, this one will be used in searching
	    self.storesCopy = ko.observableArray([]);
	    
	    //for paging
	    self.pageSize = ko.observable(10);
	    self.NumberPages = ko.observable(1);
	    self.currPage = ko.observable(1);
	    self.pagesArray = ko.observableArray([]);
	    self.maxNumberPages = ko.observable(1);
		
		//for the form
		self.storeid = ko.observable(0);
		self.areaid = ko.observable();
		self.branchname = ko.observable("");
		self.taxIdNumber = ko.observable("");
		self.branchaddress = ko.observable("");
		self.coordinates = ko.observable("");
		
		//These are used in search
		self.searchString = ko.observable("");
		self.searchResultsArray = ko.observableArray([]);
		
		//initialise the map
		self.mymap = L.map('mapContainer').setView([11.600960, 123.473753], 5); //Visayan Sea, Philippines as center
		//.setView([51.505, -0.09], 13);
		// Disable drag and zoom handlers.
		self.mymap.touchZoom.disable();
		self.mymap.scrollWheelZoom.disable();
		self.mymap.keyboard.disable();
//		mymap.dragging.disable();
		self.mymap.doubleClickZoom.disable(); 
//		//add custom control
//		mymap.addControl(new customControl());
		
		//popup
		//var layerPopup = null;
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		    minZoom: 5,
		    maxZoom: 18,
		    id: 'mapbox.streets',
		    accessToken: 'pk.eyJ1Ijoicm9sZGFucmVhbCIsImEiOiJjajMyZW5odTkwMDA0Mndud3FsbWU4MGEyIn0.4XNhZ5NL07H5tmKZJlTN7A'
		}).addTo(self.mymap);
		
		// load a tile layer
//		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//		    minZoom: 5,
//		    maxZoom: 18,
//		    id: 'mapbox.streets',
//		    accessToken: 'pk.eyJ1Ijoicm9sZGFucmVhbCIsImEiOiJjajMyZW5odTkwMDA0Mndud3FsbWU4MGEyIn0.4XNhZ5NL07H5tmKZJlTN7A'
//		}).addTo(mymap);
		
		//get the list of stores on first load from DB
	    $.getJSON("get-stores", function(allData) {
	        var mappedItems = $.map(allData, function(store) { return new Store(store); });
	        
	        //make a copy of stores
	        self.storesCopy(mappedItems);
	        
	        //Do paging on first load
	        self.doPaging(self.pageSize());
	        
	    });
	    
	    //get the list of areas on first load from DB
	    $.getJSON("get-areas", function(allData) {
	        var mappedItems = $.map(allData, function(area) { return new Area(area); });
	        //fill areas array
	        self.areas(mappedItems);
	    });
	    
	    self.displayStore = function() {
	    	//change the modal title and button text
	    	$(".modal-title").text("Edit store");
			$("#editStoreSumbitButton").text("Update");
	    	
	    	//map the values to modal form
			self.storeid(this.storeId());
			self.areaid(this.area_id());
			self.branchname(this.branchName());
			self.taxIdNumber(this.tin());
			self.branchaddress(this.address());
			self.coordinates(this.coordinates());
	    	
			//show the modal
			$('#editStoreModal').modal('show');
	    };
	    
	    self.displayCoordinates = function() {
	    	
			if(self.areaid() == 1) {
				self.mymap.setView([14.57794,120.9746711],7); //Rizal Park, Manila as center
			} else if(self.areaid() == 2) {
				self.mymap.setView([10.425131, 123.575514], 9); //set to Tanon Strait, Negros Occidental as center
			} else if(self.areaid() == 3) {
				self.mymap.setView([8.0291503,124.2736951], 8); //set to Marawi City as center
			} else {
				self.mymap.setView([11.600960, 123.473753], 5); //Visayan Sea, Philippines as center
			}
			
			//show the modal
			$('#mapSelectModal').modal('show');
			$(".mod-title").text("Click map to select coordinates");
						
	    };
	    
	    $('#mapSelectModal').on('shown.bs.modal', function(){
			  setTimeout(function() {
				  self.mymap.invalidateSize();
			  }, 10);
		});
	    
	    self.mymap.on('click', function(e) 
	    		{ 
	    			//set latitude and longitude to coordinates
	    			self.coordinates(e.latlng.lat + "," + e.latlng.lng);
	    			//close the modal
	    			$('[id=mapModal]').click();
	    		});
	    
	    self.selectCoordinates = function() {
	    	
	    };
	    
	    self.displayAddStore = function() {
	    	//change the modal title and button text
	    	$(".modal-title").text("Add new store");
			$("#editStoreSumbitButton").text("Add");
			
			//Clear the values inside the form
			self.storeid(0);
			self.areaid("");
			self.branchname("");
			self.taxIdNumber("");
			self.branchaddress("");
			self.coordinates("");
			
			//show the Edit modal
			$('#editStoreModal').modal('show');
	    };
	    
	    self.cancelEdit = function() {
	    	//Clear the values inside the form
			self.areaid("");
			self.branchname("");
			self.taxIdNumber("");
			self.branchaddress("");
			self.coordinates("");
	    };
	    
	    self.editStore = function() {
	    	var storeId = this.storeid();
	    	var areaId = this.areaid();
	    	var branchname = this.branchname();
	    	var tin = this.taxIdNumber();
	    	var branchaddress = this.branchaddress();
	    	var coordinates = this.coordinates();
	    	
	    	//Add new store
	    	if(storeId==0) {
	    		var url = 'add-store';
				$.ajax({
					url: url,
					dataType: 'json',
					data: {areaId: areaId, branchName: branchname, branchaddress: branchaddress, coordinates: coordinates, tin: tin},
					success: function(store) {
						//close the modal
						$('[data-dismiss=modal]').click();
						
						var areaName = "";
						//loop through the areas array and get the name
						for(var i = 0; i<self.areas().length; i++) {
							if (self.areas()[i].areaId() == areaId) {
								areaName = self.areas()[i].areaName();
								break;
					        }
						}
						if(self.searchString() != '') {
							self.searchResultsArray.push({
								storeId : ko.observable(store.storeId),
							    area : ko.observable(areaName),
							    area_id: ko.observable(store.area.areaId),
							    branchName : ko.observable(store.branchName),
							    tin: ko.observable(store.tin),
							    address : ko.observable(store.address),
							    coordinates : ko.observable(store.coordinates),
							    delItemTitle : ko.observable("Delete item " + store.storeId),
							    editItemTitle : ko.observable("Edit item " + store.storeId)
							});
				    	}
						else {
							self.stores.push({
								storeId : ko.observable(store.storeId),
							    area : ko.observable(areaName),
							    area_id: ko.observable(store.area.areaId),
							    branchName : ko.observable(store.branchName),
							    tin: ko.observable(store.tin),
							    address : ko.observable(store.address),
							    coordinates : ko.observable(store.coordinates),
							    delItemTitle : ko.observable("Delete item " + store.storeId),
							    editItemTitle : ko.observable("Edit item " + store.storeId)
							});
						}
						
						//add also in the copy
						self.storesCopy.push({
							storeId : ko.observable(store.storeId),
						    area : ko.observable(areaName),
						    area_id: ko.observable(store.area.areaId),
						    branchName : ko.observable(store.branchName),
						    tin: ko.observable(store.tin),
						    address : ko.observable(store.address),
						    coordinates : ko.observable(store.coordinates),
						    delItemTitle : ko.observable("Delete item " + store.storeId),
						    editItemTitle : ko.observable("Edit item " + store.storeId)
						});
						
						//Do paging
				        self.doPaging(self.pageSize(), self.currPage());
				        
						//notify that adding is successful
						$.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'Store successfully added' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
					},
					error: function(jqXHR, textStatus, errorThrown) {
						errorMessage = "Cannot add store. Please check if branch name " +
						"already exists. Or try again later.";
						//Display error message
						$("#editStoreError").html(errorMessage);
					}
				});
	    	}
	    	//Edit store details
	    	else {
	    		var url = 'update-store';
				$.ajax({
					type: 'GET',
					url: url,
					data: {storeId: storeId, areaId: areaId, branchName: branchname, branchaddress: branchaddress, coordinates: coordinates, tin: tin},
					success: function() {
							var areaName = "";
							//loop through the areas array and get the name
							for(var i = 0; i<self.areas().length; i++) {
								if (self.areas()[i].areaId() == areaId) {
									areaName = self.areas()[i].areaName();
									break;
								}
							}
							//loop through the items and update the value
							for(var i = 0; i<self.stores().length; i++) {
								if (self.stores()[i].storeId() == storeId) {
								    self.stores()[i].area(areaName);
									self.stores()[i].area_id(areaId);
									self.stores()[i].branchName(branchname);
									self.stores()[i].tin(tin);
									self.stores()[i].address(branchaddress);
									self.stores()[i].coordinates(coordinates);
					                break;
					            }
							}
							//loop through the items copy and update the value
							for(var i = 0; i<self.stores().length; i++) {
								if (self.storesCopy()[i].storeId() == storeId) {
								    self.stores()[i].area(areaName);
									self.stores()[i].area_id(areaId);
									self.stores()[i].branchName(branchname);
									self.stores()[i].tin(tin);
									self.stores()[i].address(branchaddress);
									self.stores()[i].coordinates(coordinates);
					                break;
					            }
							}
							//Do paging
					        self.doPaging(self.pageSize(), self.currPage());
					        
					        $.notify({
								// options
								icon: 'glyphicon glyphicon-ok',
								message: 'Store details successfully updated' 
							},{
								// settings
								type: 'success',
								delay: 1000,
								offset: 55,
							});
						$('[data-dismiss=modal]').click();
						
					},
					error: function() {
						errorMessage = "Cannot edit item. Please check if item " +
								"code already exists. Or try again later.";
						//Display error message
						$("#editItemError").html(errorMessage);
						return false;
					},
				});
			}
			return true;
	    };
	    self.removeStore = function(store, event) {
	    	// get storeId of the row
			var storeId = event.currentTarget.id;
			
			bootbox.confirm({
				message: "You are about to delete store " + storeId + ".\nDo you want to proceed?",
				closeButton: false,
				size: "small",
			    callback: function(result){
			    	if(result) {
						var url = 'delete-' + storeId + '-store';
						$.ajax({
							url: url,
							success: function() {
								//remove the element from the table
								if(self.searchString() != '') {
									//remove from searchResultsArray
									for(var x in self.searchResultsArray()) {
										if(self.searchResultsArray()[x].storeId() == storeId) {
											self.searchResultsArray.remove(self.searchResultsArray()[x]);
											break;
										}
									}
						    	}
						    	else {
						    		self.stores.remove(store);
						    	}
								
								//remove also from the copy
								for(var x in self.storesCopy()) {
									if(self.storesCopy()[x].storeId() == storeId) {
										self.storesCopy.remove(self.storesCopy()[x]);
										break;
									}
								}
								
								//Do paging
						        self.doPaging(self.pageSize(), self.currPage());
						        
								$.notify({
									// options
									icon: 'glyphicon glyphicon-ok',
									message: 'Store successfully deleted' 
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
	    self.searchStores = function() {
	    	var searchString = self.searchString();
	    	self.searchResultsArray.removeAll();
	    	
	    	if(searchString != '') {
	    		for(var x in self.storesCopy()) {
	    			if ((self.storesCopy()[x].area().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.storesCopy()[x].branchName().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.storesCopy()[x].address().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    				) {
	    				self.searchResultsArray.push(self.storesCopy()[x]);
	    			}
	    		}
	    	}
	    	else {
	    		self.searchResultsArray(self.storesCopy().slice());
	    	}
	    	
	    	//Do paging
	        self.doPaging(self.pageSize(), self.currPage());
	    };
	    self.doPaging = function(pageSize, nextPage) {
	    	var storesArray = ko.observableArray([]);
	    	//make a copy of the results
	    	if(self.searchString() != '') {
	    		storesArray(self.searchResultsArray.slice());
	    	}
	    	else {
	    		storesArray(self.storesCopy().slice()); 
	    	}
	    	
	    	//clear items
	    	self.stores.removeAll();
	    	
	    	//set current page as next page if nextPage is defined
	    	if(nextPage)
	    		self.currPage(nextPage);
	    	
	    	//set page size
	    	self.pageSize(pageSize);
	    	
	    	//calculate number of pages
	        self.NumberPages(Math.ceil(storesArray().length/self.pageSize()));
	        
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
	    		if(storesArray()[i]) {
	    			self.stores.push(storesArray()[i]);
	    		}
	    		else {
	    			break;
	    		}
	    		
	    	}
	    };
	    
	};
	ko.applyBindings(new StoresViewModel());
});