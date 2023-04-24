/**
 * This Javascript file will be used in all pages
 */
if(!(Cookies.get('username') && Cookies.get('username') != '')) {
			//redirect to login page is someone is not logged in
			window.location.replace('login');
}
$(function() {
	"use strict";
	
	// initialize tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
	//bind showing loading gif on ajax start
	$(document).ajaxStart(function() {
		var href = document.location.href;
		var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
		//exclude rmc
		if (lastPathSegment!='rmc' && lastPathSegment!='rmc#') {
			$.blockUI({ 
				message: "<img src='resources/img/circular-load.GIF'>",
				baseZ: 2000,
				css: {
			        border: 'none',
			        backgroundColor: 'transparent'
			    }
			});
		}
		
	});
	$(document).ajaxStop(function() {
		$.unblockUI();
	});
	
	//reset modal form data on data-dismiss
	$('[data-dismiss=modal]').click(function (e) {
	    var $t = $(this),
	        target = $t[0].href || $t.data("target") || $t.parents('.modal') || [];

	  $(target)
	    .find("input,textarea,select")
	       .val('')
	       .end()
	    .find("input[type=checkbox], input[type=radio]")
	       .prop("checked", "")
	       .end()
	     .find("div")
	     	.removeClass("has-error")
	     	.end()
	     .find(".error")
	     	.empty()
	     	.end();
	});
	
	//listen when the link is clicked, clear all the cookies
	$("#logoutLink").click(function() {
		//alert('im clicked');
		Cookies.set('username', '');
		Cookies.set('usertype', '');
		//Cookies.set('username', '');
		//redirect to login page
		window.location.replace('login');
	});
	
	var usertype = Cookies.get('usertype');
	if(usertype==1) {
		$(".storesMenu").css('display', 'inline');
		$(".reportsMenu").css('display', 'inline');
	} else {
		$(".storesMenu").css('display', 'none');
		$(".reportsMenu").css('display', 'none');
	}
	if(usertype==2 || usertype==3) {
		$(".posMenu").css('display', 'inline');
	} else {
		$(".posMenu").css('display', 'none');
	}
	if(usertype==1) {
		$(".itemsMenu").css('display', 'inline');
	} else {
		$(".itemsMenu").css('display', 'none');
	}
	if(usertype==1 || usertype==2) {
		$(".usersMenu").css('display', 'inline');
	} else {
		$(".usersMenu").css('display', 'none');
	}
});