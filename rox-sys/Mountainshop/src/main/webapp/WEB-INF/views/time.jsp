<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/plugin/moment.js"></script>
	<script src="resources/js/pages/time.js"></script>
	
</head>
<body class="container">
<div class="container-fluid">
	<div class="page-header">
      <h1>Time and Attendance</h1>
  	</div>
  	<div class="row">
  		<div>
  			<center><span data-bind="text: helloUser"></span></center>
  		</div>
  		<br />
        <div>
            <center>Today is &nbsp;<span data-bind="text: currentTime"></span></center>
        </div>
        <br />
        <div>
        	<center>
        		<button data-bind="click: doTimeIn, enable: timeIn() == 'N/A'" type="button" class="btn btn-primary btn-md" id="addItemButton">
  					Time in
  				</button>
  				<button data-bind="click: doTimeOut, enable: timeIn() != 'N/A' && timeOut() == 'N/A'" type="button" class="btn btn-primary btn-md" id="addItemButton">
  					Time out
  				</button>
        	</center>
  		</div>
  		<div class"table-responsive">
  			<table id="timeTable" class="table table-striped">
    		<thead>
	      		<tr>
	        		<th>Date</th>
	        		<th>Time in</th>
	        		<th>Time out</th>
	      		</tr>
    		</thead>
	    	<tbody>
	      		<td data-bind="text: dateToday"></td>
	            <td data-bind="text: timeIn"></td>
	            <td data-bind="text: timeOut"></td>
	    	</tbody>
  		</table>
  	</div>
  	</div>
</div>
</body>
</html>