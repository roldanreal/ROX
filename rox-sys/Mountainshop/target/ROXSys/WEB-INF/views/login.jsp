<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>R.O.X. - Recreational Outdoor eXchange System</title> 
    
    <!-- JQuery -->
    <script src="resources/js/jquery/jquery-2.1.4.min.js"></script>
    
    <!-- Bootstrap -->
    <link href="resources/css/bootstrap.min.css" rel="stylesheet">
    <script src="resources/js/plugin/bootstrap-3.3.6-dist/bootstrap.min.js"></script>
    
    <!-- Jquery Block UI -->
    <script src="resources/js/plugin/jquery.blockUI.js"></script>
    
    <!-- JS cookie -->
    <script src="resources/js/plugin/js.cookie.js"></script>
    
    <!-- Knockout.js -->
    <script src="resources/js/plugin/knockout-3.4.0.js"></script>
     
    <!-- custom resources -->
     <link href="resources/css/main.css" rel="stylesheet">
    <!-- <script src="resources/js/main.js"></script> -->
    
    <!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/login.js"></script>
	
	<link href="resources/css/login.css" rel="stylesheet">
    
    
</head>
 
<body>
  	<div class="container">
	  <div class="row" id="pwd-container">
	    <div class="col-md-4"></div>
	    
	    <div class="col-md-4">
	      <section class="login-form">
	        <form method="post" action="#" role="login">
	          <img src="resources/img/rox.png" class="img-responsive" alt="" />
	          <input type="text" data-bind="value: loginUserName, valueUpdate:'keyup'" placeholder="Username" required class="form-control input-lg" />
	          
	          <input data-bind="value: loginUserPassword, valueUpdate:'keyup'" type="password" class="form-control input-lg" id="password" placeholder="Password" required="" />
	          
	          
	          <div class="pwstrength_viewport_progress"></div>
	          
	          
	          <button data-bind="enable: loginUserName() && loginUserName().length>0 && loginUserPassword() && loginUserPassword().length>0, click: doLogin" type="submit" name="go" class="btn btn-lg btn-primary btn-block">Sign in</button>
	          <div class="error" id="loginError">
		      </div> 
	          
	        </form>
	      </section>  
	      </div>
	      
	      <div class="col-md-4"></div>
      

  </div>
</body>
</html> 