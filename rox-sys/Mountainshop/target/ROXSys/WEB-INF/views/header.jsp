<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>R.O.X. - Recreational Outdoor eXchange System</title> 
    
    <!-- favicon -->
    <link rel="shortcut icon" type="image/x-icon" href="resources/images/favicon.ico"/>
    
    <!-- JQuery -->
    <script src="resources/js/jquery/jquery-2.1.4.min.js"></script>
    
     <!-- Moment -->
    <script src="resources/js/plugin/moment.js"></script>
    
     <!-- Timepicker -->
    <script src="resources/js/plugin/bootstrap-datetimepicker.js"></script>
    
    <!-- Bootstrap -->
    <link href="resources/css/bootstrap.min.css" rel="stylesheet">
    <script src="resources/js/plugin/bootstrap-3.3.6-dist/bootstrap.min.js"></script>
    
    <!-- Bootbox: Used for Alerts -->
    <script src="resources/js/plugin/bootbox.min.js"></script>
    
    <!-- Bootstrap notify: Used for Awesome notifications -->
    <script src="resources/js/plugin/bootstrap-notify.min.js"></script>
    
    <!-- Jquery Block UI -->
    <script src="resources/js/plugin/jquery.blockUI.js"></script>
    
    <!-- Knockout.js -->
    <script src="resources/js/plugin/knockout-3.4.0.js"></script>
    <script src="resources/js/plugin/knockstrap.min.js"></script>
    
    <!-- JS cookie -->
    <script src="resources/js/plugin/js.cookie.js"></script>
     
    <!-- Data table -->
    <script src="resources/js/plugin/jQuery.dataTables.min.js"></script>
    
    <!-- Date timepicker CSS -->
    <link href="resources/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
    
    <!-- custom resources -->
    <link href="resources/css/main.css" rel="stylesheet">
    <script src="resources/js/main.js"></script>
     
</head>
<body class="col-sm-12 col-md-12 col-lg-12">
	<nav class="navbar navbar-default">
    	<!-- Collect the nav links, forms, and other content for toggling -->
    	<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      		<ul class="nav navbar-nav">
        		<li><a href="<c:url value='/home' />"><img src='resources/img/rox.png'></img></a></li>
        		<li class="topmargin storesMenu"><a href="<c:url value='/stores' />">Stores</a></li>
        		<li class="dropdown topmargin reportsMenu">
          			<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Reports<span class="caret"></span></a>
          				<ul class="dropdown-menu">
            				<li class="topmargin"><a href="<c:url value='/rmc' />">Real-time Monitoring</a></li>
            				<li><a href="<c:url value='/reports' />">Reporting</a></li>
          				</ul>
        		</li>
         		<li class="dropdown topmargin posMenu">
          			<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Point of Sales<span class="caret"></span></a>
          				<ul class="dropdown-menu">
            				<li><a href="<c:url value='/checkout' />">Checkout</a></li>
            				<li><a href="<c:url value='/return' />">Return items</a></li>
          				</ul>
        		</li>
        		<li class="dropdown topmargin">
          			<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">ROX Items<span class="caret"></span></a>
          				<ul class="dropdown-menu">
            				<li class="itemsMenu"><a href="<c:url value='/items' />">Store items</a></li>
            				<li><a href="<c:url value='/inventory' />">Store Items inventory</a></li>
          				</ul>
        		</li>
        		<!-- <li class="dropdown topmargin">
          			<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Staff<span class="caret"></span></a>
          				<ul class="dropdown-menu">
            				<li><a href="<c:url value='/time' />">Time and attendance</a></li>
          				</ul>
        		</li> -->
        		<li class="dropdown topmargin usersMenu">
          			<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">System<span class="caret"></span></a>
          				<ul class="dropdown-menu">
            				<li><a href="<c:url value='/users' />">System users</a></li>
          				</ul>
        		</li>
      		</ul>
      		<ul class="nav navbar-nav navbar-right topmargin">
        		<li id="logoutLink"><a href="<c:url value='/logout' />">Logout</a></li>
      		</ul>
    	</div><!-- /.navbar-collapse -->
	</nav>
</body>
</html>