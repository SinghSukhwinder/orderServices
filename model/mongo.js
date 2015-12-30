var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/ordersData');
var mongoSchema =   mongoose.Schema;
var itemSchema  = {
    "name" : String,
    "description" : String,
    "price" :Number,
    "priceUnit": String
};

var customerSchema  = {
    "firstName" : String,
    "lastName" : String,
    "address" :{
        "street" : String,
        "ciy":String,
        "state" :String,
        "postalCode" : String
    },
    "email": String,
    "phone" : String
};

mongoose.model('items', itemSchema);
mongoose.model('customers', customerSchema);

var Items = mongoose.model('items');
var Customers = mongoose.model('customers');

ItemsProvider = function(){};
CustomersProvider= function(){};

/** Find all items **/
ItemsProvider.prototype.findAll = function(callback) {
  Items.find({}, function (err, items) {
    callback( null, items )
  });  
};

/** Find Item by ID **/
ItemsProvider.prototype.findById = function(id, callback) {
  Items.findById(id, function (err, item) {
    if (!err) {
        callback(null, item);
    }else {
        callback("Error in finding the item", null);
    }


  });
};

/** Create an Item **/
ItemsProvider.prototype.save = function(params, callback) {
    var item = new Items({name: params['name'], description: params['description'],price: params['price'], priceUnit: params['priceUnit'] });
    item.save(function (err) {
        callback(err,item);
    });
};

/** Update an Item **/
ItemsProvider.prototype.update = function(id, body, callback) {
    Items.findById(id, function (err, item) {
        if (!err) {
            item.name = body.name;
            item.description = body.description;
            item.price = body.price;
            item.priceUnit = item.priceUnit;
            item.save(function (err) {
                callback(null, item);
            });
        }else {
            callback("Error finding the item", null);
        }
    });
};


/** Delete an Item **/

ItemsProvider.prototype.remove = function(id, callback) {
    Items.findById(id, function (err, item) {
        if (err || item == null) {
            callback("Error finding the item", null)
        }else{
            item.remove({_id : id},function(err){
                if(err){
                    callback( "Error in deleting item", null)
                }else{
                    callback()
                }

            });

        }
    });
}



exports.ItemsProvider = ItemsProvider;
