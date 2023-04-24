<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<div id="addItemModal">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Add new item</h4>
      </div>
      <div class="modal-body">
        <form:form method="POST" action="add-item" modelAttribute="item">       
	      	<div class="form-group input-group" id="iCode">
	      		<span class="input-group-addon">Code*</span>
	      		<form:input type="text" class="form-control" path="itemcode" placeholder="Item code" required="" autofocus="" maxlength="10"/>
	      	</div>
	      	<div class="form-group input-group" id="iName">
	      		<span class="input-group-addon">Name*</span>
	      		<form:input type="text" class="form-control" path="itemname" placeholder="Item name" required="" maxlength="30"/>
	      	</div>
	      	<div class="form-group input-group" id="iDesc">
	      		<span class="input-group-addon">Description</span>
	      		<form:input type="text" class="form-control" path="itemdesc" placeholder="Description" maxlength="160"/>
	      	</div>
	      	<div class="error" id="addItemError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        		<c:choose>
                	<c:when test="${edit}">
                		<button type="button" id="editItemSumbitButton" class="btn btn-primary">Update</button>
                	</c:when>
                	<c:otherwise>
                		<button type="button" id="addItemSumbitButton" class="btn btn-primary">Save</button>
                	</c:otherwise>
                </c:choose>
      		</div> 
	    </form:form>
      </div>
      
    </div>
  </div>
</div>
</body>
</html>