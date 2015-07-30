

// Db access
var monk = require('monk');
var wrap = require('co-monk'); //we are using co-monk, which acts a wrapper around monk, making it very easy for us to query MongoDB using generators in Koa
var db = monk('localhost/IonicDatabase');

var co = require('co');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var signUpModel = wrap(db.get('userCollection'));
var customerModel = wrap(db.get('customerCollection'));
var self = require('./api.js');

module.exports.allCustomers = function * (opts) {

  console.log("UserAPI getStoreUserInfo START userId" , opts.userId);

 try{
    var allCustomers = yield customerModel.find({"userId": opts.userId});
    if (!allCustomers) throw new Error(JSON.stringify({"message":"no_customer_found","err_code":400}));
     console.log("UserAPI All Customers:" , allCustomers);
     return allCustomers;
  }catch (err){
     console.error(err.message);
     throw err;
  }
 

}
module.exports.registerUser = function * (opts){
  console.log("registerUser post data:" + JSON.stringify(opts));
  try{
      if(!opts.email_id || !opts.password){
	    throw new Error(JSON.stringify({"message":"Username and password not entered,plz enter details","err_code":404}));
	  }
	  var userExists = {};
	  var userExists = yield signUpModel.findOne({"email_id":opts.email_id});
      console.log("user fields " + JSON.stringify(userExists));
	  if(!userExists){
	      var res = yield signUpModel.insert(opts);
	      console.log("this.body user registered:",res);
	      // this.throw(200,res);
	      return res;
	  }else{
	      //console.log("Post Response:" + JSON.stringify(this.body));
	      throw new Error(JSON.stringify({"message":"User Already Exists","err_code":404}));
      }
    }catch (err){
     console.error(err.message);
	 throw err;
    }
}

module.exports.loginUser = function * (opts){
  console.log("loginUser post data:" + JSON.stringify(opts));
  try{
      if(!opts.email_id || !opts.password){
	    //this.throw(404, 'Username and password not entered,plz enter details:');
	      throw new Error(JSON.stringify({"message":"Username and password not entered,plz enter details","err_code":404}));
	  }
	  var userExists = {};
	  var userExists = yield signUpModel.findOne({"email_id":opts.email_id});
    console.log("user fields " + JSON.stringify(userExists));
   /* if(!userExists){
       console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        throw new Error(JSON.stringify({"message":"User not registered please signup","err_code":401}));
    }*/
	  if(userExists.password == opts.password){
	      var res = userExists;
	      console.log("this.body user registered:",res);
	      // this.throw(200,res);
	      return res;
	  }else{
	      //console.log("Post Response:" + JSON.stringify(this.body));
	      //this.throw(401, 'User not registered please signup:');
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
	      throw new Error(JSON.stringify({"message":"User not registered please signup","err_code":401}));
      }
    }
    catch (err){
       console.error('catch me----',err.message);
	     throw err;
    }
}

module.exports.addCustomer = function * (opts){
	console.log("opts body add customer:" ,opts);
  
   try{
      if(!opts.body){
      	console.log("-------------");
	    //this.throw(404, 'Add customer does not containe data:');
	    throw new Error(JSON.stringify({"message":"Add customer does not containe data","err_code":400}));
	  }
    if(opts.body.name){
      var customerName = yield customerModel.findOne({"name":opts.body.name});
      console.log("customerNameExists:" +JSON.stringify(customerName));
      if(customerName){
          throw new Error(JSON.stringify({"message":"Customer Already Exists with this Name:","err_code":400}));
      }
    }
	  if(opts.body.email){
        var customerEmail = yield customerModel.findOne({"email":opts.body.email});
        console.log("customerEmailExists:" +JSON.stringify(customerEmail));
        if(customerEmail){
          throw new Error(JSON.stringify({"message":"Customer Already Exists with this Email Id:","err_code":400}));
        }else{
           var customerAddInfo={};
           customerAddInfo["userId"] =  opts.userId;
           customerAddInfo["name"] = opts.body.name;
           customerAddInfo["email"] = opts.body.email;
           customerAddInfo["address"] = opts.body.address;
           console.log("customerAddInfo:" ,customerAddInfo);

           var res = yield customerModel.insert(customerAddInfo);
           console.log("this.body user registered:",res);
           // this.throw(200,res);
           return res;
        }
	  	 
	  }else{
	      //console.log("Post Response:" + JSON.stringify(this.body));
	     // this.throw(401, 'Customer not addded');
	      throw new Error(JSON.stringify({"message":"Add customer does not containe data","err_code":401}));

      }
    } catch (err){
       console.error(err.message);
	   throw err;
    }

}


module.exports.updateCustomer = function * (opts){
    console.log("API updateCustomer START ",opts);
    console.log("API updateCustomer opts._id ",opts._id);
    try {
        var customer = {};
    	var customer = yield customerModel.findOne({"_id":opts._id});

    	if(!customer) {
          throw new Error(JSON.stringify({"message":"customer_not_fount","err_code":404}));
    	}
    	var customerUpdateInfo = {};
    	customerUpdateInfo.name = opts.name,
    	customerUpdateInfo.email = opts.email,
    	customerUpdateInfo.address = opts.address
     
    	console.log("before updateCustomer")
    	//console.log("type of _id:" ,typeof(opts._id));
    	//var id = mongoose.Types.ObjectId(opts._id);
    	//console.log("id type:" ,typeof(id));
      var response = yield customerModel.update({"_id":opts._id},{"$set":{"name":opts.name,"email":opts.email,"address":opts.address}});
    	var updatedCustomerData = {};
    	if (response) {
           updatedCustomerData = customer;
           for (key in customerUpdateInfo) {
         	if (customerUpdateInfo[key]) {
      	        updatedCustomerData[key] = customerUpdateInfo[key];
      	     }
      	   }  
      	  return updatedCustomerData;
      	} else{
      		 throw new Error(JSON.stringify({"message":"Customer Not Updated","err_code":404}));
      	}  

    } catch (err){
       console.error("err API Update Customer:",err.message);
	   throw err;

    }

}

// findOneAndupdatereturn entire object with added nested object

module.exports.addCustomerDetails = function * (opts){
	console.log("opts body add customer details:" ,opts);

    var relarive_id = "ABC";
    var text = "0123456789";
    for (var i = 0; i < 3; i++) {
        relarive_id = relarive_id + text.charAt(Math.floor(Math.random() * text.length));
     }
     console.log("relarive_id before:",relarive_id);
    /* relarive_id = "ABC835";
     console.log("relarive_id after:",relarive_id);*/
     try {
       var Id =[];
       var Id = yield customerModel.find({"_id":opts._id,"relationship.Id":relarive_id});
       console.log("id exist:" ,Id);
        if(Id.length>0){
         	throw new Error(JSON.stringify({"message":"Relative already exists","err_code":404}));
        }
        var response = yield customerModel.update({"_id":opts._id},{$push:{'relationship':{"name":opts.name,"relation":opts.relation,"Id":relarive_id}}});
        console.log("response:",response);
        return response;
      /*  if(response){

        }
*/
        //console.log("addCustomerDetailsData:" ,addCustomerDetailsData);
       //return addCustomerDetailsData;

     } catch(err){
        console.error("err API Add Customer Details:",err.message);
	    throw err;
     }

}



/**
 *  Forgot password
 */
exports.forgotPassword = function*(opts) {
  console.log("User API forgotPassword: START OPTS:",opts);
  //console.log("user API verifyUser: email: "+ opts.email);
  if (opts.email){
     opts.email = opts.email.toLowerCase();
     console.log("opts.email>>>>>>>>:",opts.email);
  }else{
    throw new Error('400_email_can_not_be_blank');
  }
  try{
    var userForgotPassword = {};
    userForgotPassword = yield signUpModel.findOne({"email_id": opts.email});
    if(userForgotPassword){
      var resetPasswordToken = "";
      var text = "abcdefghijklmnopqrstuvwxyz0123456789";
      for (var i=0; i < 8; i++) {
        resetPasswordToken = resetPasswordToken + text.charAt(Math.floor(Math.random() * text.length));
       }
      var passwordUpdate = yield signUpModel.update({"email_id": opts.email},{"$set":{"reset_pass_token":resetPasswordToken}});
      console.log("passwordUpdate:",passwordUpdate);
      if(passwordUpdate){
          var transporter = nodemailer.createTransport();
          var mailOptions = {
                 from: 'bhuvnesh.kumar@daffodilsw.com', // sender address
                 to: opts.email, // list of receivers
                 text: "http://192.168.100.98:8100/#/resetPassword/"+ resetPasswordToken+ "/" + opts.email   // plaintext body
                        //text: resetPassInfo.password, // plaintext body
               };
              transporter.sendMail(mailOptions, function(error, info) {
                    //console.log("error:",error);
                    //console.log("info:",info);
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
              });
             console.log("userForgotPassword:",userForgotPassword); 
             return userForgotPassword["resetPasswordToken"] = resetPasswordToken;
                  
      }
    } 
    if (!userForgotPassword)  throw new Error(JSON.stringify({"message":"there_is_no_user_with_this_email'","err_code":400}));
  } catch(err){
     console.log("err:",err);
  }
}

/**
 * Reset Password and return User
 *
 * @param {string} id - Global user id
 * @param {object} auth_user - user handle of authenticated user
 * @param {string} old_password - old_password of User
 * @param {string} fpcode - forget password code
 * @param {string} new_password - new_password of User
 *
 * @return {object} Reset - User
 */


exports.resetPassword = function*(opts) {

  console.log("UserAPI resetPassword START:" ,opts);

  if (!opts.new_password) {
    console.log("API resetPassword: New password not given");
    throw new Error(JSON.stringify({"message":"new_password_cannot_be_blank","err_code":400}));
  }
  if (!opts.reset_pass_token) { //fpcode is mandatory for resetting own password.
    console.log("API resetPassword: reset_pass_token is not given");
    throw new Error(JSON.stringify({"message":"reset_pass_token_is_not_given","err_code":400}));
  }

  var user;
  var filter = {};
  filter.reset_pass_token = opts.reset_pass_token;
  filter.email_id = opts.email_id;
  user = yield signUpModel.findOne(filter);

  console.log("user in API:" ,user);

  // console.log("UserAPI resetPassword user:" +JSON.stringify(user));
  if (!user) {
    throw new Error(JSON.stringify({"message":"user_doesnot_exist_for_this_emailid","err_code":400}));
  }
  if(user){
     var res = yield signUpModel.update({"email_id": opts.email_id},{"$set":{"password":opts.new_password}});
     console.log("resetPassword res:",res);
        // this.throw(200,res);
     if(res){
      var resetPassResult = {};
      resetPassResult = user;
      console.log("resetPassResult Before Password:",resetPassResult);
      resetPassResult["password"] = opts.new_password;
      console.log("resetPassResult After Password:",resetPassResult);
      return resetPassResult;

     }else{
        throw new Error(JSON.stringify({"message":"Error in Password Set","err_code":400}));
     }

  }

}



/**
 * changePassword Password and return User
 *
 * @param {string} id - Global user id
 * @param {object} auth_user - user handle of authenticated user
 * @param {string} old_password - old_password of User
 * @param {string} new_password - new_password of User
 *
 * @return {object} Reset - User
 */

exports.changePassword = function*(opts) {
  console.log("UserAPI changePassword START");

  console.log("changePassword password Api.js:" ,opts);
   console.log("changePassword password opts.id:" ,opts.id);
  //if (opts.id === 'me') {
    opts.id = opts.id;
  //}
  if (!opts.new_password) {
    console.log("UserAPI changePassword: New password not given");
    throw new Error(JSON.stringify({"message":"new_password_cannot_be_blank","err_code":400}));
  }

  // if (opts.auth_user && opts.auth_user.id != opts.id && opts.auth_user.account_id != opts.id) { //check if admin is resetting the password
    // yield exports.authorizeActions({
    //   in_role: opts.auth_user.role || null,
    //   actions: "user:reset_pw_without_old"
    // });
  // } else 
  if (!opts.old_password) { //old password is mandatory for Changing own password.
    console.log("UserAPI changePassword: Old password not given");
    throw new Error(JSON.stringify({"message":"old_password_cannot_be_blank","err_code":400}));
  }

  var user;
  var filter = {};
  filter.email_id = opts.id;
  user = yield signUpModel.findOne(filter);
  
  console.log("user in API:",user);
  if (!user) {
    throw new Error('User does not exists for id: '+ opts.id);
  }

  if(user){
     var res = yield signUpModel.update({"email_id":opts.id},{"$set":{"password":opts.new_password}});
     console.log("changed Password res:",res);
        // this.throw(200,res);
     if(res){
      var changePassResult = {};
      changePassResult = user;
      console.log("changePassResult Before Password:",changePassResult);
      changePassResult["password"] = opts.new_password;
      console.log("changePassResult After Password:",changePassResult);
      return changePassResult;

     }else{
        throw new Error(JSON.stringify({"message":"Error in Password changed:","err_code":400}));
     }

  }

  /*else if (!opts.accountpasschange && opts.old_password) {
    if (!bcrypt.compareSync(opts.old_password, user.password)) {
      throw new Error(JSON.stringify({"message":"old_password_do_not_match","err_code":400}));
    }
  }*/

  /*var passwordSuccessfullyChanged;
  var password = bcrypt.hashSync(opts.new_password, bcrypt.genSaltSync(8), null);
  if(opts.app =='admin-app'){
    passwordSuccessfullyChanged = yield adminDB.userCollection.update(filter,{"$set":{"password":password,"password_reset":true}}).exec();
    //console.log("password changed successfully:" ,passwordSuccessfullyChanged);
  }else{
     passwordSuccessfullyChanged = yield userDB.userCollection.update(filter,{"$set":{"password":password}}).exec();
  }
  if (passwordSuccessfullyChanged) {
    user.event("change_password");
    return user.toObject();
  }*/
}
