<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Highcharts -->
	<script src="resources/js/plugin/highcharts.js"></script>
	<script src="resources/js/plugin/highcharts-more.js"></script>
	<script src="resources/js/plugin/solid-gauge.js"></script>
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/reports.js"></script>
</head>
<body class="container">
<div class="container-fluid">
	<div class="page-header">
      <h1>Reporting</h1>
  	</div>
  	<div class="row">
  		<div class="form-inline col-md-4 col-sm-6 col-lg-12 col-xs-12">
  			<div class="form-group input-group">
		      	<span class="input-group-addon">Store Area</span>
		      	<select class="form-control" data-bind="options: areas,
	            	optionsText: 'areaName',
	            	optionsValue: 'areaId',
	            	value: areaid,
	            	optionsCaption: 'All areas'
	            "></select>
            </div>
  			<div class="form-group input-group">
		      		<span class="input-group-addon">Store Branch</span>
		      		<select class="form-control" data-bind="options: stores,
	                       optionsText: 'branchName',
	                       optionsValue: 'storeId',
	                       value: storeid,
	                       optionsCaption: 'All branches'
	                       ">
	                </select>
	      	</div>
	      	<div class='input-group date' id='datetimepicker1'>
	      			<span class="input-group-addon">Date From</span>
                    <input type='text' data-bind="datepicker: dateFrom" class="form-control" />
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-calendar"></span>
                    </span>
            </div>
            <div class='input-group date' id='datetimepicker2'>
	      			<span class="input-group-addon">Date To</span>
                    <input type='text'data-bind="datepicker: dateTo" class="form-control" />
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-calendar"></span>
                    </span>
            </div>
  			<div class="form-group input-group">
		  			<button type="button" data-bind="enable: dateFrom() && dateFrom().length > 0 > 0 && dateTo() && dateTo().length > 0 > 0, click: getReports"  class="btn btn-primary btn-md" id="runReportsButton">
		  				Run Report
		  			</button>
  			</div>
	      	
  		</div>
  	</div>
  	<div class="row" style="width: 100%;">
  		<div class="one-line" id="chartsContainer"></div>
  		<div class="one-line" id="timeseriesContainer"></div>
		<div class="one-line" id="purchases"></div>
		<div class="one-line" id="sales"></div>
		<div class="one-line" id="barGraph1"></div>
  	  	<div class="one-line" id="barGraph2"></div>
    </div>
</div>
</body>
</html>