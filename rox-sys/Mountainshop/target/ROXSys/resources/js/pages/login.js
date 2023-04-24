/**
 * This is the Jquery file for the login.jsp page
 */
//Check if user is logged in
if(Cookies.get('username') && Cookies.get('username') != '') {
			//redirect to home page if someone is logged in
			window.location.replace('home');
}

$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
	
	function LoginViewModel() {
		
		var self = this;
		
		//for the form
		self.loginUserName = ko.observable("");
		self.loginUserPassword = ko.observable("");
		
		self.doLogin = function() {
			var userName = this.loginUserName();
			var userPassword = this.loginUserPassword();
			
			var url = 'login-user';
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				data: {userName: userName, userPassword: userPassword},
				success: function(user) {
					if(user.active != 0) {
						//create cookie session
						Cookies.set('username', user.userName);
						Cookies.set('usertype', user.usertype.usertypeId);
						Cookies.set('userStoreId', user.store.storeId);
						Cookies.set('userAreaId', user.store.area.areaId);
						Cookies.set('userId', user.userID);
						
						//redirect to home page
						window.location.replace('home');
						
					}
					else{
						errorMessage = "User is not allowed to use the system. Please contact administrator.";
						//Display error message
						$("#loginError").html(errorMessage);
					}	
				},
				error: function() {
					errorMessage = "Username and password do not match.";
					//Display error message
					$("#loginError").html(errorMessage);
					return false;
				},
			});
		};
		
	};
	ko.applyBindings(new LoginViewModel());
});