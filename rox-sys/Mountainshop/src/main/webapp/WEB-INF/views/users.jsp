<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<jsp:include page="header.jsp" />
	
	<!-- Javascript resource for this particular page -->
	<script src="resources/js/pages/users.js"></script>
</head>
<body class="container">
<div class="container-fluid">
	<div class="page-header">
      <h1>System users</h1>
  	</div>
  	<div class="row">
  		<div class="col-md-8 col-sm-8 col-lg-9 col-xs-6">
  			<button data-bind="click: displayAddUser" type="button" class="btn btn-primary btn-md" id="addItemButton">
  				<span class="glyphicon glyphicon-plus"></span> Add new user
  			</button>
  		</div>
        <div class="col-md-4 col-sm-4 col-lg-3 col-xs-6">
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input data-bind="value: searchString, valueUpdate:'keyup', event: { keyup: searchUsers }" type="text" class="form-control input-md" placeholder="User name, type, branch name, or email" />
                    <span class="input-group-btn">
                        <i class="glyphicon glyphicon-search"></i>
                    </span>
                </div>
            </div>
        </div>
  	</div>
  	<div class"table-responsive">
  	<table id="itemsTable" class="table table-striped">
    	<thead>
      	<tr>
        	<th>User ID</th>
        	<th>User Name</th>
        	<th>User Type</th>
        	<th>Branch Name</th>
        	<th>Email address</th>
        	<th>Contact No.</th>
        	<th>Action</th>
      	</tr>
    	</thead>
    	<tbody data-bind="foreach: users">
      		<td data-bind="text: userId"></td>
            <td data-bind="text: userName"></td>
            <td data-bind="text: usertype"></td>
            <td data-bind="text: branchName"></td>
            <td data-bind="text: email"></td>
            <td data-bind="text: contactNo"></td>
            <td>
            <a data-bind="tooltip: {title: editUserTitle, placement: 'left' }, attr: {id: userId}, click: $parent.displayUser" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
            <a data-bind="tooltip: {title: editPassTitle, placement: 'left' }, attr: {id: userId}, click: $parent.displayChangePassword" href="" data-toggle="tooltip" data-placement="top"><span class="glyphicon glyphicon-lock" aria-hidden="true"></span></a>
            <a data-bind="text: enableDisable, tooltip: {title:  enableDisableTitle, placement: 'left' }, attr: {id: userId, name: isActive}, click: $parent.enableDisableUser" href="" data-toggle="tooltip" data-placement="top"></a>
            </td>
    	</tbody>
  	</table>
  </div>
  <div class="text-center col-md-4 col-md-offset-4">
  	<ul class="pagination pagination-md">
		<li data-bind="css: { disabled: (currPage() === 1) }"><a data-bind="css: { disabled: (currPage() === 1) }, click: function() { if(currPage() != 1) { doPaging(pageSize(), currPage()-1)}}" href="">&laquo;</a></li>
	</ul>
    <ul data-bind="foreach: pagesArray" class="pagination pagination-md">
		<li data-bind="css: { active: $parent.currPage() === pageNumber()}"><a data-bind="text: pageNumber, click: function() { $parent.doPaging($parent.pageSize(), pageNumber())}" href=""></a></li>
	</ul>
	<ul class="pagination pagination-md">
		<li data-bind="css: { disabled: (currPage() === maxNumberPages() || maxNumberPages() === 0) }"><a data-bind="click: function() { if(currPage() != maxNumberPages()) { doPaging(pageSize(), currPage()+1)}}" href="">&raquo;</a></li>
	</ul>
  </div>
</div>

<!-- Add/Edit item modal -->
<div id="editUserModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Add new user</h4>
      </div>
      <div class="modal-body">
        <form>
        	<input data-bind="value: userid" type="hidden"/>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">User name*</span>
	      		<input data-bind="value: username, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="User name" required="" maxlength="20"/>
	      	</div>
	      	<div class="form-group input-group" data-bind="visible: !(userid() && userid() > 0)">
	      		<span class="input-group-addon">Password*</span>
	      		<input data-bind="value: userpassword1, valueUpdate:'afterkeydown'" type="password" class="form-control" placeholder="Password" maxlength="20"/>
	      	</div>
	      	<div class="form-group input-group" data-bind="visible: !(userid() && userid() > 0)">
	      		<span class="input-group-addon">Re-type password*</span>
	      		<input data-bind="value: userpassword2, valueUpdate:'afterkeydown', event: { blur: checkPasswords}" type="password" class="form-control" placeholder="Password" maxlength="20"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">User type*</span>
	      		<select class="form-control" data-bind="options: usertypesForDisplay,
                       optionsText: 'usertypeName',
                       optionsValue: 'usertypeId',
                       value: usertypeid,
                       optionsCaption: 'User type...',
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Area*</span>
	      		<select class="form-control" data-bind="options: areas,
                       optionsText: 'areaName',
                       optionsValue: 'areaId',
                       value: areaid,
                       optionsCaption: 'Area...',
                       disable: (loggedInUsertype()==2) || !(usertypeid() > 0)
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Branch name*</span>
	      		<select class="form-control" data-bind="options: stores,
                       optionsText: 'storeBranchName',
                       optionsValue: 'storeId',
                       value: storeid,
                       optionsCaption: 'Branch...',
                       disable: (loggedInUsertype()==2) || !(areaid() > 0) || !(usertypeid() > 0)
                       ">
                </select>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Email*</span>
	      		<input data-bind="value: emailAd, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Email address" required="" maxlength="90"/>
	      	</div>
	      	<div class="form-group input-group">
	      		<span class="input-group-addon">Contact number*</span>
	      		<input data-bind="value: contactNum, valueUpdate:'afterkeydown'" type="text" class="form-control" placeholder="Contact number" required="" maxlength="13"/>
	      	</div>
	      	<input data-bind="value: isactive" type="hidden"/>
	      	<div class="error" id="editUserError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal" data-bind="click: cancelEdit">Cancel</button>
                <button type="button" id="editUserSubmitButton" data-bind="enable: (username() && username().length > 0 && usertypeid() > 0 && storeid() > 0 && emailValid() && contactNum() > 0 && (passwordsEqual() || (userid() && userid() > 0))), click: editUser" class="btn btn-primary">Add</button>
      		</div> 
	    </form>
      </div>
      
    </div>
  </div>
</div>
<!-- Change password modal -->
<div id="changePasswordModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
      	<h4 class="modal-title">Change password</h4>
      </div>
      <div class="modal-body">
        <form>
        	<input data-bind="value: user_id" type="hidden"/>
	      	<div class="form-group input-group" data-bind="visible: !(userid() && userid() > 0)">
	      		<span class="input-group-addon">New Password*</span>
	      		<input data-bind="value: userpassword_1, valueUpdate:'afterkeydown', event: { keyup: checkChangePasswords}" type="password" class="form-control" placeholder="Password" maxlength="20"/>
	      	</div>
	      	<div class="form-group input-group" data-bind="visible: !(userid() && userid() > 0)">
	      		<span class="input-group-addon">Re-type password*</span>
	      		<input data-bind="value: userpassword_2, valueUpdate:'afterkeydown', event: { keyup: checkChangePasswords}" type="password" class="form-control" placeholder="Password" maxlength="20"/>
	      	</div>
	      	<div class="error" id="changePasswordError">
	      	</div> 
	      	<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal" data-bind="click: cancelEdit">Cancel</button>
                <button type="button" id="changePasswordSubmitButton" data-bind="enable: (userpassword_1() && userpassword_2() && checkChangePasswords()), click: changePassword" class="btn btn-primary">Change</button>
      		</div> 
	    </form>
      </div>
      
    </div>
  </div>
</div>
</body>
</html>