<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Leaflet -->
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"/>
  	<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
  	
	
	<meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
	<!-- Mapbox JS and CSS -->
	<script src='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js'></script>
	<link href='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css' rel='stylesheet' />
	
	<!-- Leaflet AJAX -->
  	<script src="resources/js/plugin/leaflet.ajax.min.js"></script>
	
	<!-- Ionicons CSS -->
	<link href='resources/css/ionicons.min.css' rel='stylesheet' />
	
	<!-- Awesome Markers -->
	<script src="resources/js/plugin/leaflet.awesome-markers.min.js"></script>
	<link rel="stylesheet" href="resources/css/leaflet.awesome-markers.css">
	
	<!-- Highcharts -->
	<script src="resources/js/plugin/highcharts.js"></script>
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/rmc.js"></script>
	
</head>
<body class="container">
<div class="container-fluid">
	<div class="page-header rmc-header">
      <h1>Real-time Monitoring Center</h1>
  	</div>
  	<div>
  		<div id="graphContainer"></div>
  		<div id="rmcMap"></div>
  		<div id="graphContainer"></div>
  			<div class="blocks wrapper">
			  <div class="block green">
			    <div class="heading">
			      Sales Invoice
			    </div>
			    <div class="num" data-bind="text: transactionCount"></div>
			    <div class="currentView"><h4 data-bind="text: currentView"></h4></div>
			  </div>
			 </div>
			 <div class="blocks wrapper">
			  <div class="block blue">
			    <div class="heading">
			      Total Sales (PhP)
			    </div>
			    <div class="num" data-bind="text: totalSales"></div>
			    <div class="currentView"><h4 data-bind="text: currentView"></h4></div>
			  </div>
		  	</div>
  	  <div id="barGraphContainer1"></div>
  	  <div id="barGraphContainer2"></div>
  	</div>
  	 
</div>
</body>
</html>