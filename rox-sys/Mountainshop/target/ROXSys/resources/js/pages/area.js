/**
 * JQuery file for Area page
 */
//Check if user is logged in
$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
    
	function Area(area) {
	    this.areaId = ko.observable(area.areaId);
	    this.areaName = ko.observable(area.areaName);
	    this.zoomLevel = ko.observable(area.zoomLevel);
	    this.delAreaTitle = ko.observable("Delete area " + area.areaId);
	    this.editAreaTitle = ko.observable("Edit area " + area.areaId);
	}
	// Overall viewmodel for this screen, along with initial state
	function AreaViewModel() {
		var self = this;
		
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		
		self.areas = ko.observableArray([]);
		
		//copy of areas array
		self.areasCopy = ko.observableArray([]);
		
		//for Add/Edit area form
		self.areaid = ko.observable(0);
		self.areaname = ko.observable("");
		self.zoomlevel = ko.observable(0);
		
		//These are used in search
		self.searchString = ko.observable("");
		self.searchResultsArray = ko.observableArray([]);
		
		//for paging
	    self.pageSize = ko.observable(5);
	    self.NumberPages = ko.observable(1);
	    self.currPage = ko.observable(1);
	    self.pagesArray = ko.observableArray([]);
	    self.maxNumberPages = ko.observable(1);
	    
		// get the list of areas on first load from DB
	    $.getJSON("get-areas", function(allData) {
	        var mappedItems = $.map(allData, function(area) { return new Area(area); });
	        
	        //make a copy of the items
	        self.areasCopy(mappedItems);
	        
	        //Do paging on first load
	        self.doPaging(self.pageSize());
	    });  
	    
	    self.displayAddArea = function() {
	    	//change the modal title and button text
	    	$(".modal-title").text("Add new area");
			$("#editAreaSumbitButton").text("Add");
			
			//Clear the values inside the form
			self.areaid(0);
			self.areaname("");
			self.zoomlevel("");
			
			//show the Edit modal
			$('#editAreaModal').modal('show');
	    };
	    
	    self.displayArea = function() {
	    	//change the modal title and button text
	    	$(".modal-title").text("Edit item");
			$("#editAreaSumbitButton").text("Update");
	    	
	    	//map the values to modal form
	    	self.areaid(this.areaId());
			self.areaname(this.areaName());
			self.zoomlevel(this.zoomLevel());
	    	
			//show the modal
			$('#editAreaModal').modal('show');
	    };
	    
	    self.cancelEdit = function() {
	    	//Clear the values of the form
	    	self.areaid(0);
			self.areaname("");
	    };
	    
	    self.editArea = function() {
	    	var areaId = this.areaid();
	    	var areaName = this.areaname();
			
	    	//Add new area
	    	if(areaId==0) {
	    		var url = 'add-area';
	    		$.ajax({
					url: url,
					dataType: 'json',
					data: {areaName: areaName},
					success: function(area) {
						//close the modal
						$('[data-dismiss=modal]').click();
						
						if(self.searchString() != '') {
							self.searchResultsArray.push({
								areaId : ko.observable(area.areaId),
								areaName : ko.observable(area.areaName),
							    delAreaTitle : ko.observable("Delete area " + area.areaId),
							    editAreaTitle : ko.observable("Edit area " + area.areaId)
							});
				    	}
						else {
							self.areas.push({
								areaId : ko.observable(area.areaId),
								areaName : ko.observable(area.areaName),
							    delAreaTitle : ko.observable("Delete area " + area.areaId),
							    editAreaTitle : ko.observable("Edit area " + area.areaId)
							});
						}
						
						//add also in the copy
						self.areasCopy.push({
							areaId : ko.observable(area.areaId),
							areaName : ko.observable(area.areaName),
						    delAreaTitle : ko.observable("Delete area " + area.areaId),
						    editAreaTitle : ko.observable("Edit area " + area.areaId)
						});
						
						//Do paging
				        self.doPaging(self.pageSize(), self.currPage());
				        
						//notify that adding is successful
						$.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'Area successfully added' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
					},
					error: function(jqXHR, textStatus, errorThrown) {
						errorMessage = "Cannot add area. Please check if area " +
						"name already exists. Or try again later.";
						//Display error message
						$("#editAreaError").html(errorMessage);
					}
	    		});
	    	}
	    	//Edit area
	    	else {
	    		var url = 'update-area';
				$.ajax({
					type: 'GET',
					url: url,
					data: {areaId: areaId, areaName: areaName},
					success: function() {
							//loop through the items and update the value
							for(var i = 0; i<self.areas().length; i++) {
								if (self.areas()[i].areaId() == areaId) {
									self.areas()[i].areaName(areaName);
					                break;
					            }
							}
							//loop through the items copy and update the value
							for(var i = 0; i<self.areasCopy().length; i++) {
								if (self.areasCopy()[i].areaId() == areaId) {
									self.areasCopy()[i].areaName(areaName);
					                break;
					            }
							}
							//Do paging
					        self.doPaging(self.pageSize(), self.currPage());
					        
					        $.notify({
								// options
								icon: 'glyphicon glyphicon-ok',
								message: 'Area successfully updated' 
							},{
								// settings
								type: 'success',
								delay: 1000,
								offset: 55,
							});
						$('[data-dismiss=modal]').click();
						
					},
					error: function() {
						errorMessage = "Cannot edit area. Please check if area " +
								"name already exists. Or try again later.";
						//Display error message
						$("#editAreaError").html(errorMessage);
						return false;
					},
				});
			}
			return true;
	    };
	    
	    self.removeArea = function(area, event) {
	    	
	    	// get itemId of the row
			var areaId = event.currentTarget.id;
			
			bootbox.confirm({
				message: "You are about to delete area " + areaId + ".\nDo you want to proceed?",
				closeButton: false,
				size: "small",
			    callback: function(result){
			    	if(result) {
						var url = 'delete-' + areaId + '-area';
						$.ajax({
							url: url,
							success: function() {
								//remove the element from the table
								if(self.searchString() != '') {
									//remove from searchResultsArray
									for(var x in self.searchResultsArray()) {
										if(self.searchResultsArray()[x].areaId() == areaId) {
											self.searchResultsArray.remove(self.searchResultsArray()[x]);
											break;
										}
									}
						    	}
						    	else {
						    		self.areas.remove(area);
						    	}
								//remove also from the copy
								for(var x in self.areasCopy()) {
									if(self.areasCopy()[x].areaId() == areaId) {
										self.areasCopy.remove(self.areasCopy()[x]);
										break;
									}
								}
								//Do paging
						        self.doPaging(self.pageSize(), self.currPage());
						        
								$.notify({
									// options
									icon: 'glyphicon glyphicon-ok',
									message: 'Area successfully deleted' 
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
	    
	    self.searchAreas = function() {
	    	var searchString = self.searchString();
	    	self.searchResultsArray.removeAll();
	    	
	    	if(searchString != '') {
	    		for(var x in self.areasCopy()) {
	    			if ((self.areasCopy()[x].areaName().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)) {
	    				self.searchResultsArray.push(self.areasCopy()[x]);
	    			}
	    		}
	    	}
	    	else {
	    		self.searchResultsArray(self.areasCopy().slice());
	    	}
	    	
	    	//Do paging
	        self.doPaging(self.pageSize(), self.currPage());
	    };
	    
	    self.doPaging = function(pageSize, nextPage) {
	    	
	    	var areasArray = ko.observableArray([]);
	    	
	    	//make a copy of the results
	    	if(self.searchString() != '') {
	    		areasArray(self.searchResultsArray.slice());
	    	}
	    	else {
	    		areasArray(self.areasCopy().slice()); 
	    	}
	    	
	    	//clear areas
	    	self.areas.removeAll();
	    	
	    	//set current page as next page if nextPage is defined
	    	if(nextPage)
	    		self.currPage(nextPage);
	    	
	    	//set page size
	    	self.pageSize(pageSize);
	    	
	    	//calculate number of pages
	        self.NumberPages(Math.ceil(areasArray().length/self.pageSize()));
	        
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
	    		if(areasArray()[i]) {
	    			self.areas.push(areasArray()[i]);
	    		}
	    		else {
	    			break;
	    		}
	    		
	    	}
	    };
	}
	ko.applyBindings(new AreaViewModel());
});