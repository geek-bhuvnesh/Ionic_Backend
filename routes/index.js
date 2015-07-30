'use strict';

var router = require("koa-router");
var route = new router();

var API = require("../api.js");

exports = module.exports = route;


route.get('/allCustomers/:userId', function*() {
   console.log("Normal Request get request");
   console.log(" Request params userId ---  " ,this.params.userId);
   try {
    var allCustomer = yield API.allCustomers({
      "userId":this.params.userId,
    });
    console.log("All Customer:" ,allCustomer);
    this.body = allCustomer;
    this.status = 200;
  } catch (err) {
    var ERR = JSON.parse(err.message);
    this.body = ERR.err_code + "_" + ERR.message;
    this.status = ERR.err_code;
  }

});


route.post('/signup', function*() {
  console.log(" Request type ---  " + JSON.stringify(this.request.type));
  console.log(" Request body signup ---  " ,this.request.body);

  try {
    var user = yield API.registerUser({
      "username":this.request.body.name,
      "email_id":this.request.body.email,
      "password": this.request.body.password
    });
    console.log("user:" ,user);
    this.body = user;
  } catch (err) {
    console.log("Singup Error in Index.js:",err);

    var ERR = JSON.parse(err.message);
    this.body = ERR.err_code + "_" + ERR.message;
    this.status = ERR.err_code;
  }
});



route.post('/login', function*() {
  console.log(" Request type ---  "+JSON.stringify(this.request.type));
  console.log(" Request body login ---  " ,this.request.body);

  try {
    var user = yield API.loginUser({
      "email_id":this.request.body.email,
      "password":this.request.body.password
     });
      console.log("user:" ,user);
      this.body = user;
  } catch (err) {
  	 console.log("err login:" ,err);
     throw err;
  }
});



route.post('/addCustomer/:userId', function*() {
  console.log(" Request type ---  " + JSON.stringify(this.request.type));
  console.log(" Request params userId ---  " ,this.params.userId);
  console.log(" Request body Add Customer ---  " ,this.body);

  try {
    var addedCustomer = yield API.addCustomer({
      userId:this.params.userId,
      body:this.request.body
    });
    console.log("customer add:" ,addedCustomer);
    this.body = addedCustomer;
  } catch (err) {
  	console.log("err" ,err);
    var ERR = JSON.parse(err.message);
    this.body =  ERR.message;
    this.status = ERR.err_code;
  }
});

route.put('/updateCustomer/:customerId', function*() {
  console.log("Request type ---  " + JSON.stringify(this.request.type));
  console.log("Request params userId ---  ",this.params.customerId);
  console.log("Request Body ---  ",this.request.body);

  try {
    var updatedCustomer = yield API.updateCustomer({
      _id:this.params.customerId,
      name:this.request.body.name,
      email:this.request.body.email,
      address:this.request.body.address
    });
    console.log("updatedCustomer:" ,updatedCustomer);
    this.body = updatedCustomer;
  } catch (err) {
    console.log("err INDEX" ,err);
    var ERR = JSON.parse(err.message);
    this.body = ERR.err_code + "_" + ERR.message;
    this.status = ERR.err_code;
  }
});

route.put('/addCustomerDetails/:customerId', function*() {
  console.log("Request type ---  " + JSON.stringify(this.request.type));
  console.log("Request params userId ---  ",this.params.customerId);
  console.log("Request Body ---  ",this.request.body);

  try {
    var addCustomerDetails = yield API.addCustomerDetails({
      _id:this.params.customerId,
      name:this.request.body.name,
      relation:this.request.body.relation,
    });
    console.log("addCustomerDetails:" ,addCustomerDetails);
    this.body = addCustomerDetails;
  } catch (err) {
    console.log("err INDEX" ,err);
    var ERR = JSON.parse(err.message);
    this.body = ERR.err_code + "_" + ERR.message;
    this.status = ERR.err_code;
  }
});

/** Forgot Password
 *  @param <String> email : Primary email of user
 *  return a link to change password and send the link through email
 */

route.get('/forgotpassword/:emailid',function*() {
  console.log("GET /users/email" + this.params.emailid + "/forgotpassword handler start");

  if(!this.params.emailid) {
    this.body = ({emailid: 'Email is not valid'});
    this.status = 400;
    return;
  }
  
  try {
    var userExist = yield API.forgotPassword({
      email: this.params.emailid
    });
    this.body = userExist;
    this.status = 200;
    console.log("this.body:",JSON.stringify(this.body) + "," + "this.status:",this.status);
  } catch (err) {
    var ERR = JSON.parse(err.message);
    this.body = ERR.err_code + "_" + ERR.message;
    this.status = ERR.err_code;
  }
});


route.post('/resetpassword/:reset_pass_token/:emailid', function *() {
  console.log("POST /resetpassword/" + this.params.reset_pass_token + "/" + this.params.emailid + " handler start");
  var validation_errors = [];
 
  console.log("Reset Password body:" ,this.request.body);

  if (!this.request.body && !this.request.body.new_password) {
    this.body = {};
    this.body.errors = {password: "new_password is not valid"};
    this.status = 400;
    return;  
  }
  console.log("index resetpassword: params" + JSON.stringify(this.params.emailid));
  try {
    var user = yield API.resetPassword({
      email_id: this.params.emailid,
      new_password: this.request.body ? this.request.body.new_password : null,
      reset_pass_token: this.params.reset_pass_token
    });
    this.body = user;
    this.status = 200;
  } catch (err) {
    var ERR = JSON.parse(err.message);
    this.body = ERR.err_code + "_" + ERR.message;
    this.status = ERR.err_code;
  }
});

route.post('/changepassword/:userId', function *() {
  console.log("POST /users/" + this.params.userId + "/changepassword handler start");
  console.log("change password req.body:" ,this.request.body);
  
  var validation_errors = [];

  if (!this.request.body && !this.request.body.new_password) {
    this.body = {};
    this.body.errors = {password: "new_password is not valid"};
    this.status = 400;
    return;  
  }

  if (!this.request.body && !this.request.body.old_password) {
    this.body = {};
    this.body.errors = {password: "old_password is not valid"};
    this.status = 400;
    return;  
  }

  try {
    var user = yield API.changePassword({
      id: this.params.userId,
      old_password: this.request.body ? this.request.body.old_password : null,
      new_password: this.request.body ? this.request.body.new_password : null
    });
    this.body = user;
    this.status = 200;
  } catch (err) {
    var ERR = JSON.parse(err.message);
    this.body = ERR.err_code + "_" + ERR.message;
    this.status = ERR.err_code;
  }
});
