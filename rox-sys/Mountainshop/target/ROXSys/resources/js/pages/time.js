/**
 * This is the Jquery file for the items.jsp page
 */

$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
    
	// Overall viewmodel for this screen, along with initial state
	function TimeViewModel() {
		var self = this;
		
		//for timeout
		self.gTimer = null;
	    
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUserId = ko.observable(Cookies.get('userId'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		
		//used in table
		self.dateToday = ko.observable(moment().format("MMMM Do, YYYY"));
		self.timeIn = ko.observable("N/A");
		self.timeOut = ko.observable("N/A");
		
		//Used in the page for display
		self.helloUser = ko.observable("Hello, " + self.loggedInUser() + "!");
		self.currentTime = ko.observable("");
		
		self.displayCurrentDateAndTime = function() {
			if (self.gTimer) {
				clearTimeout(self.gTimer);
			}
			self.currentTime(moment().format("dddd, MMMM Do, YYYY, h:mm:ss A"));
			
			//refresh every second
			self.gTimer = setTimeout(function() {self.displayCurrentDateAndTime();},1000);
		};
		
		self.getTimeInToday = function() {
			var url = 'getTimeInToday';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {userId: self.loggedInUserId()},
				success: function(time) {
					if(time!=null) {
						//get on the time part
						var timeStringArray = time.timestamp.split(' ');
						var timeString = timeStringArray[3] + " " + timeStringArray[4];
						self.timeIn(timeString);
					}
				}
			});
		};
		
		self.getTimeOutToday = function() {
			var url = 'getTimeOutToday';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {userId: self.loggedInUserId()},
				success: function(time) {
					if(time!=null) {
						//get on the time part
						var timeStringArray = time.timestamp.split(" ");
						var timeString = timeStringArray[3] + " " + timeStringArray[4];
						self.timeOut(timeString);
					}
				}
			});
		};
		
		//get current date and time
		self.displayCurrentDateAndTime();
		//get timein for today
		self.getTimeInToday();
		//get timeout for today
		self.getTimeOutToday();
		
		self.doTimeIn = function() {
			var url = 'save-timeInTimeOut';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {userId: self.loggedInUserId(), action: 'timein'},
				success: function(time) {
					//get on the time part
					var timeStringArray = time.timestamp.split(" ");
					var timeString = timeStringArray[3] + " " + timeStringArray[4];
					self.timeIn(timeString);
				}
			});
		};
		
		self.doTimeOut = function() {
			var url = 'save-timeInTimeOut';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {userId: self.loggedInUserId(), action: 'timeout'},
				success: function(time) {
					//get on the time part
					var timeStringArray = time.timestamp.split(" ");
					var timeString = timeStringArray[3] + " " + timeStringArray[4];
					self.timeOut(timeString);
				}
			});
		};
	    
	}
	ko.applyBindings(new TimeViewModel());
});