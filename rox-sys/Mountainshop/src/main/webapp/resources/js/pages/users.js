/**
 * This is the Jquery file for the users.jsp page
 */
if(Cookies.get('usertype') == 3) {
	//redirect to home page
	window.location.replace('home');
}
$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
	function User(user) {
	    this.userId = ko.observable(user.userID);
	    this.userName = ko.observable(user.userName);
	    this.branchName = ko.observable(user.store.branchName);
	    this.usertype = ko.observable(user.usertype.usertypeName);
	    this.email = ko.observable(user.email);
	    this.contactNo = ko.observable(user.contactNo);
	    this.isActive = ko.observable(user.active);
	    this.enableDisable = ko.observable(((user.active==0)?"Enable":"Disable"));
	    this.enableDisableTitle = ko.observable(((this.isActive()==0)?"Enable":"Disable") + " user " + user.userID);
	    this.editUserTitle = ko.observable("Edit user " + user.userID);
	    this.editPassTitle = ko.observable("Change user " + user.userID + "'s password");
	}
	
	function Usertype(usertype) {
		this.usertypeId = ko.observable(usertype.usertypeId);
		this.usertypeName = ko.observable(usertype.usertypeName);
	}
	
	function Area(area) {
		this.areaId = ko.observable(area.areaId);
		this.areaName = ko.observable(area.areaName);
	}
	
	function Store(store) {
	    this.storeId = ko.observable(store.storeId);
	    this.storeAreaId = ko.observable(store.area.areaId);
	    this.storeBranchName = ko.observable(store.branchName);
	}
	
	
	// Overall viewmodel for this screen, along with initial state
	function UsersViewModel() {
		var self = this;
		
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		self.loggedInUserAreaId = ko.observable(Cookies.get('userAreaId'));
		
		// list of users
		self.users = ko.observableArray([]);
		self.usersCopy = ko.observableArray([]);
		
		// list of usertypes
		self.usertypes = ko.observableArray([]);
		self.usertypesForDisplay = ko.observableArray([]);
		
		// list of areas
		self.areas = ko.observableArray([]);
		
		// list of stores
		self.stores = ko.observableArray([]);
		self.storesCopy = ko.observableArray([]);
		
		//for paging
	    self.pageSize = ko.observable(10);
	    self.NumberPages = ko.observable(1);
	    self.currPage = ko.observable(1);
	    self.pagesArray = ko.observableArray([]);
	    self.maxNumberPages = ko.observable(1);
	    
	    //These are used in search
		self.searchString = ko.observable("");
		self.searchResultsArray = ko.observableArray([]);
		
	    
		//used in form
		self.userid = ko.observable(0);
		self.username = ko.observable();
		self.userpassword1 = ko.observable();
		self.userpassword2 = ko.observable();
		self.usertypeid = ko.observable();
		self.areaid = ko.observable();
		self.storeid = ko.observable();
		self.passwordsEqual = ko.observable(false);
		self.emailAd = ko.observable();
		self.emailValid = ko.observable(false);
		self.contactNum = ko.observable();
		self.isactive = ko.observable();
		
		//used in change password form
		self.user_id = ko.observable(0);
		self.userpassword_1 = ko.observable();
		self.userpassword_2 = ko.observable();
		
		//get users based on user type and storeId
	    self.getUsers = function() {
	    	
	    	var url = 'get-users';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {usertypeId: self.loggedInUsertype(), storeId: self.loggedInUserStoreId()},
				success: function(allData) {
		 	        var mappedItems = $.map(allData, function(user) { return new User(user); });
		 	        
		 	        //make a copy of the users
		 	        self.usersCopy(mappedItems);
		 	        
		 	        //Do paging on first load
		 	        self.doPaging(self.pageSize());
		 	    }
			});
	    };
	    
		// get the list of users on first load from DB
		self.getUsers();
	    
	    // get the list of usertypes on first load from DB
	    $.getJSON("get-usertypes", function(allData) {
	        var mappedItems = $.map(allData, function(usertype) { return new Usertype(usertype); });
	        
	        //fill the usertypes array
	        self.usertypes(mappedItems);
	        
	        //display only applicable usertypes
	        self.processUsertypes(self.usertypes());
	    });
	    
	    //get the list of areas on first load from DB
	    $.getJSON("get-areas", function(allData) {
	        var mappedItems = $.map(allData, function(area) { return new Area(area); });
	        //fill areas array
	        self.areas(mappedItems);
	    });
	    
	    //get the list of stores on first load from DB
	    $.getJSON("get-stores", function(allData) {
	        var mappedItems = $.map(allData, function(store) { return new Store(store); });
	        //fill stores array
	        self.stores(mappedItems);
	        //have a copy
	        self.storesCopy(self.stores().slice());
	    });
	    
	    //process user types to be displayed
	    self.processUsertypes = function(usertypes) {
	    	//for Proprietors, display only Proprietor and Store Manager
	    	if(self.loggedInUsertype()==1) {
	    		for(var x in usertypes) {
	    			if ((usertypes[x].usertypeId() == 1) || (usertypes[x].usertypeId() == 2)) {
	    				self.usertypesForDisplay.push(usertypes[x]);
	    			}
	    		}
	    	}
	    	//for Store Managers, display only Store cashier and Store Staff
	    	else if(self.loggedInUsertype()==2) {
	    		for(var x in usertypes) {
	    			if ((usertypes[x].usertypeId() == 3) || (usertypes[x].usertypeId() == 4)) {
	    				self.usertypesForDisplay.push(usertypes[x]);
	    			}
	    		}
	    	}
	    };
	    
	    self.enableDisableUser = function(user, event) {
	    	// get userId of the row
			var userId = event.currentTarget.id;
			var isActive = event.currentTarget.name;
			
			bootbox.confirm({
				message: "Are you sure you want to " + (isActive==0?"enable":"disable") + " user " + userId + "?",
				closeButton: false,
				size: "small",
			    callback: function(result){
			    	if(result) {
						var url = 'enable-disable-user';
						$.ajax({
							url: url,
							data: {userId: userId, isActive: isActive},
							success: function(user) {
								
								//loop through the items and update the value
								for(var i = 0; i<self.users().length; i++) {
									if (self.users()[i].userId() == userId) {
										self.users()[i].isActive(isActive==0?1:0);
										self.users()[i].enableDisable(isActive==0?"Disable":"Enable");
										self.users()[i].enableDisableTitle(((isActive==0)?"Disable":"Enable") + " user " + userId);
						                break;
						            }
								}
								
								//loop through the items copy and update the value
								for(var i = 0; i<self.usersCopy().length; i++) {
									if (self.usersCopy()[i].userId() == userId) {
										self.users()[i].isActive(isActive==0?1:0);
										self.users()[i].enableDisable(isActive==0?"Disable":"Enable");
										self.users()[i].enableDisableTitle(((isActive==0)?"Disable":"Enable") + " user " + userId);
						                break;
						            }
								}
						        
								//Do paging
						        self.doPaging(self.pageSize(), self.currPage());
						        
								$.notify({
									// options
									icon: 'glyphicon glyphicon-ok',
									message: 'User successfully ' + (isActive==0?"enabled":"disabled") 
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
	    
	    self.cancelEdit = function() {
	    	//Clear the values of the form
	    	self.userid(0);
			self.username("");
			self.userpassword1("");
			self.userpassword2("");
			self.usertypeid("");
			self.areaid("");
			self.storeid("");
			self.emailAd("");
			self.isactive("");
			self.contactNum("");
			
			//change password form
			self.userpassword_1("");
			self.userpassword_2("");
			
			//empty error
			$("#editUserError").html("");
	    };
	    
	    self.displayAddUser = function() {
	    	//change the modal title and button text
	    	$(".modal-title").text("Add new user");
	    	$("#editUserSubmitButton").text("Add");
			
			//Clear the values inside the form
			self.userid(0);
			self.username("");
			self.userpassword1("");
			self.userpassword2("");
			self.usertypeid("");
			self.areaid(self.loggedInUserAreaId());
			self.storeid(self.loggedInUserStoreId());
			self.emailAd("");
			self.isactive("");
			self.contactNum("");
			
			//empty error
			$("#editUserError").html("");
			
			//show the Edit modal
			$('#editUserModal').modal('show');
	    };
	    
	    self.displayUser = function() {
	    	
	    	var userId = this.userId();
	    	$.ajax({
				url: 'get-'+userId+'-user',
				dataType: 'json',
				success: function(user) {
					//map the values to modal form
					self.userid(user.userID);
					self.username(user.userName);
					self.usertypeid(user.usertype.usertypeId);
					self.areaid(user.store.area.areaId);
					self.storeid(user.store.storeId);
					self.isactive(user.active);
					self.emailAd(user.email);
					self.contactNum(user.contactNo);
				}
	    	});
	    	//change the modal title and button text
	    	$(".modal-title").text("Edit user");
			$("#editUserSubmitButton").text("Update");
	    	
			//show the modal
			$('#editUserModal').modal('show');
	    };
	    
	    self.displayChangePassword = function() {
	    	self.user_id(this.userId());
	    	
	    	//empty error
			$("#changePasswordError").html("");
			
			//show the Edit modal
			$('#changePasswordModal').modal('show');
	    	
	    };
	    
	    self.areaid.subscribe(function(newAreaIdValue) {
	    	//clear stores array
    		self.stores.removeAll();
    		//update the selection in store branches
    		for(var x in self.storesCopy()) {
    			if ((self.storesCopy()[x].storeAreaId() == newAreaIdValue)) {
    				self.stores.push(self.storesCopy()[x]);
    			}
    		}
	    });
	    
	    self.emailAd.subscribe(function(newEmailAdValue) {
	    	var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	    	self.emailValid(pattern.test(newEmailAdValue));
	    	if(!self.emailValid()) {
	    		var errorMessage = "Invalid email address.";
				//Display error message
				$("#editUserError").html(errorMessage);
	    	}
	    	else {
	    		$("#editUserError").html("");
	    	}
	    		
	    });
	    
	    self.checkPasswords = function() {
	    	if(self.userpassword1() != self.userpassword2()) {
	    		var errorMessage = "Passwords do not match.";
				//Display error message
				$("#editUserError").html(errorMessage);
				self.passwordsEqual(false);
	    	}
	    	else {
	    		$("#editUserError").html("");
	    		self.passwordsEqual(true);
	    	}
	    };
	    
	    self.checkChangePasswords = function() {
	    	if(self.userpassword_1() != self.userpassword_2()) {
	    		return false;
	    	}
	    	return true;
	    };
	    
	    self.editUser = function() {
	    	var userId = this.userid();
	    	var userName = this.username();
	    	var userPassword = this.userpassword1();
	    	var usertype = this.usertypeid();
	    	var storeId = this.storeid();
	    	var email = this.emailAd();
	    	var contactNo = this.contactNum();
	    	var isActive = this.isactive();
	    	
	    	//Add new item
	    	if(userId==0) {
	    		var url = 'add-user';
				$.ajax({
					url: url,
					dataType: 'json',
					data: {userName: userName, userPassword: userPassword, usertype: usertype,
						storeId: storeId, email: email, contactNo: contactNo},
					success: function(user) {
						//close the modal
						$('[data-dismiss=modal]').click();
						
						var branchName = "";
						var usertypeName = "";
						
						//get branch name
						for(var x in self.storesCopy()) {
							if(self.storesCopy()[x].storeId() == user.store.storeId) {
								branchName = self.storesCopy()[x].storeBranchName();
								break;
							}
						}		
						//get usertype
						for(var x in self.usertypes()) {
							if(self.usertypes()[x].usertypeId() == user.usertype.usertypeId) {
								usertypeName = self.usertypes()[x].usertypeName();
								break;
							}
						}
						
						if(self.searchString() != '') {
							self.searchResultsArray.push({
								userId : ko.observable(user.userID),
							    userName : ko.observable(user.userName),
							    branchName : ko.observable(branchName),
							    usertype : ko.observable(usertypeName),
							    email : ko.observable(user.email),
							    contactNo : ko.observable(user.contactNo),
							    isActive: ko.observable(1),
							    enableDisable : ko.observable("Disable"),
							    enableDisableTitle : ko.observable("Disable user " + user.userID),
							    editUserTitle : ko.observable("Edit user " + user.userID),
							    editPassTitle : ko.observable("Change user " + user.userID + "'s password")
							});
				    	}
						else {
							self.searchResultsArray.push({
								userId : ko.observable(user.userID),
							    userName : ko.observable(user.userName),
							    branchName : ko.observable(branchName),
							    usertype : ko.observable(usertypeName),
							    email : ko.observable(user.email),
							    contactNo : ko.observable(user.contactNo),
							    isActive: ko.observable(1),
							    enableDisable : ko.observable("Disable"),
							    enableDisableTitle : ko.observable("Disable user " + user.userID),
							    editUserTitle : ko.observable("Edit user " + user.userID),
							    editPassTitle : ko.observable("Change user " + user.userID + "'s password")
							});
						}
						//add also in the copy
						self.usersCopy.push({
							userId : ko.observable(user.userID),
						    userName : ko.observable(user.userName),
						    branchName : ko.observable(branchName),
						    usertype : ko.observable(usertypeName),
						    email : ko.observable(user.email),
						    contactNo : ko.observable(user.contactNo),
						    isActive: ko.observable(1),
						    enableDisable : ko.observable("Disable"),
						    enableDisableTitle : ko.observable("Disable user " + user.userID),
						    delUserTitle : ko.observable("Delete user " + user.userID),
						    editUserTitle : ko.observable("Edit user " + user.userID),
						    editPassTitle : ko.observable("Change user " + user.userID + "'s password")
						});
						
						//Do paging
				        self.doPaging(self.pageSize(), self.currPage());
						
						//notify that adding is successful
						$.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'User successfully added' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
					},
					error: function(jqXHR, textStatus, errorThrown) {
						errorMessage = "Cannot add user. Please check if username " +
						"already exists. Or try again later.";
						//Display error message
						$("#editUserError").html(errorMessage);
					}
				});
	    	}
	    	else {
	    		var url = 'update-user';
				$.ajax({
					type: 'GET',
					url: url,
					data: {userId: userId, userName: userName, usertype: usertype, storeId: storeId, email: email, contactNo: contactNo, isActive: isActive},
					success: function() {
						
						var branchName = "";
						var usertypeName = "";
						
						//get branch name
						for(var x in self.storesCopy()) {
							if(self.storesCopy()[x].storeId() == storeId) {
								branchName = self.storesCopy()[x].storeBranchName();
								break;
							}
						}
						
						//get usertype
						for(var x in self.usertypes()) {
							if(self.usertypes()[x].usertypeId() == usertype) {
								usertypeName = self.usertypes()[x].usertypeName();
								break;
							}
						}
						

							//loop through the items and update the value
							for(var i = 0; i<self.users().length; i++) {
								if (self.users()[i].userId() == userId) {
									self.users()[i].userName(userName);
									self.users()[i].branchName(branchName);
									self.users()[i].usertype(usertypeName);
									self.users()[i].email(email);
									self.users()[i].contactNo(contactNo);
									self.users()[i].isActive(isActive);
					                break;
					            }
							}
							
							//loop through the items copy and update the value
							for(var i = 0; i<self.usersCopy().length; i++) {
								if (self.usersCopy()[i].userId() == userId) {
									self.usersCopy()[i].userName(userName);
									self.usersCopy()[i].branchName(branchName);
									self.usersCopy()[i].usertype(usertypeName);
									self.usersCopy()[i].email(email);
									self.usersCopy()[i].contactNo(contactNo);
									self.usersCopy()[i].isActive(isActive);
					                break;
					            }
							}
					        
							//Do paging
					        self.doPaging(self.pageSize(), self.currPage());
					        
					        $.notify({
								// options
								icon: 'glyphicon glyphicon-ok',
								message: 'User successfully updated' 
							},{
								// settings
								type: 'success',
								delay: 1000,
								offset: 55,
							});
						$('[data-dismiss=modal]').click();
						
					},
					error: function() {
						errorMessage = "Cannot edit user. Please try again later.";
						//Display error message
						$("#editItemError").html(errorMessage);
						return false;
					},
				});
	    	}
	    	return true;
	    };
	    
	    self.changePassword = function() {
	    	var userId = this.user_id();
		    var userPassword = this.userpassword_1();
		    var url = 'change-password';
			$.ajax({
				type: 'GET',
				url: url,
				data: {userId: userId, userPassword: userPassword},
				success: function() {
					
				        
				        $.notify({
							// options
							icon: 'glyphicon glyphicon-ok',
							message: 'Password successfully changed' 
						},{
							// settings
							type: 'success',
							delay: 1000,
							offset: 55,
						});
					$('[data-dismiss=modal]').click();
					
				},
				error: function() {
					errorMessage = "Cannot change password. Please try again later.";
					//Display error message
					$("#changePasswordError").html(errorMessage);
					return false;
				},
			});
		    //alert('user id: ' + userId + '\nuser password: ' + userPassword);
	    };
	    
	    self.removeUser = function(user, event) {
	    	
	    	// get userId of the row
			var userId = event.currentTarget.id;
			
			bootbox.confirm({
				message: "You are about to delete user " + userId + ".\nDo you want to proceed?",
				closeButton: false,
				size: "small",
			    callback: function(result){
			    	if(result) {
						var url = 'delete-' + userId + '-user';
						$.ajax({
							url: url,
							success: function() {
								//remove the element from the table
								if(self.searchString() != '') {
									//remove from searchResultsArray
									for(var x in self.searchResultsArray()) {
										if(self.searchResultsArray()[x].userId() == userId) {
											self.searchResultsArray.remove(self.searchResultsArray()[x]);
											break;
										}
									}
						    	}
						    	else {
						    		self.users.remove(user); 
						    	}
								
								//remove also from the copy
								for(var x in self.usersCopy()) {
									if(self.usersCopy()[x].userId() == userId) {
										self.usersCopy.remove(self.usersCopy()[x]);
										break;
									}
								}
								
								//Do paging
						        self.doPaging(self.pageSize(), self.currPage());
								
						        
								$.notify({
									// options
									icon: 'glyphicon glyphicon-ok',
									message: 'User successfully deleted' 
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
	    
	    self.searchUsers = function() {
	    	var searchString = self.searchString();
	    	self.searchResultsArray.removeAll();
	    	
	    	if(searchString != '') {
	    		for(var x in self.usersCopy()) {
	    			if ((self.usersCopy()[x].userName().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.usersCopy()[x].branchName().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.usersCopy()[x].usertype().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    					|| (self.usersCopy()[x].email().toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
	    				) {
	    				self.searchResultsArray.push(self.usersCopy()[x]);
	    			}
	    		}
	    	}
	    	else {
	    		self.searchResultsArray(self.usersCopy().slice());
	    	}
	    	
	    	//Do paging
	        self.doPaging(self.pageSize(), self.currPage());
	    };
	    self.doPaging = function(pageSize, nextPage) {
	    	
	    	var usersArray = ko.observableArray([]);
	    	//make a copy of the results
	    	if(self.searchString() != '') {
	    		usersArray(self.searchResultsArray.slice());
	    	}
	    	else {
	    		usersArray(self.usersCopy().slice()); 
	    	}
	    	
	    	//clear users
	    	self.users.removeAll();
	    	
	    	//set current page as next page if nextPage is defined
	    	if(nextPage)
	    		self.currPage(nextPage);
	    	
	    	//set page size
	    	self.pageSize(pageSize);
	    	
	    	//calculate number of pages
	        self.NumberPages(Math.ceil(usersArray().length/self.pageSize()));
	        
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
	    		if(usersArray()[i]) {
	    			self.users.push(usersArray()[i]);
	    		}
	    		else {
	    			break;
	    		}
	    		
	    	}
	    };
		
	}
	ko.applyBindings(new UsersViewModel());
});