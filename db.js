
//require('./app.js')();

 //Schemas define the structure of documents within a collection and models are used to create instances of data that will be stored in documents

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/IonicDatabase');

// Mongoose connection to MongoDB 
mongoose.connect('mongodb://localhost/IonicDatabase', function (error) {
    if (error) {
        console.log(error);
    }
});

var db = mongoose.connection;
db.on('error', function callback(err) {
    console.log("Database connection failed. Error: " + err);
});
db.once('open', function callback() {
   console.log("Database connection successful.");
});



var Schema = mongoose.Schema,Objectid = Schema.ObjectId;

var userSchema = new Schema({
  username : String,
  email_id: String
  password : String,
  reset_pass_token:{type: String,default: ""}
},{"collection":"userCollection"});

module.exports.userCollection  = mongoose.model('user', userSchema);

var customerSchema = new Schema({
  userId: {type:String, required:true},
  name : {type:String},
  email : {type:String},
  address: {type: String},
  relationship :[{name:,String,relation:String,Id:String}]
},{"collection":"customerCollection"});

//customerSchema.add({ name: 'string', color: 'string', price: 'number' });
customerSchema.index({userId: 1, email: 1}, {unique: true});

module.exports.customerCollection = mongoose.model('customer',customerSchema);

//var 
/*var mySecondSchema = new Schema({
  email_id : String ,
  phone_number : String
},{"collection":"user2"});

module.exports.user2  = mongoose.model('UserModel_2', mySecondSchema);

*/
/*var  mappingSchema = new Schema({
   identifier : String,
   title : String,
   location :String,
   city :String,
   state : String,
   country : String,
   zip : Number,
   url : String,
   makerdescription : String,
   groupBy : String,
   latitude : String,
   longitude : String,
   columns : [String]
 },{"collection":"mapping"});

module.exports.mapping = mongoose.model('MappingModel',mappingSchema); 
 
 
 var locationSchema =  new Schema({
     identifier : String,
	 data : { 
				title : String,
				location :String,
				city :String,
				state : String,
				country : String,
				zip : Number,
				url : String,
				makerdescription : String,
				groupBy : String,
				latitude : String,
				longitude : String,
				columns : [String]
	        }
   },{"collection":"location"}

module.exports.location = mongoose.model('LocationModel',locationSchema); 
 
 var userSchema = new Schema({
    identifier : String,
	password   : String,
	emailid  : String,
	location : String
 },{"collection":"signUp"}
 
 module.exports.signUp = mongoose.model('SignUpModel',userSchema); 
*/