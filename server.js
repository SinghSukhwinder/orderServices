var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();

var ItemsProvider = require('./model/mongo').ItemsProvider;
var ItemsProvider= new ItemsProvider();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));



router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Welcome to Order services"});
});

router.route("/items")
    .get(function(req,res){
        var response = {};
        var httpStatus=200;
        ItemsProvider.findAll(function(err,items){
            if(err) {
                response = {"message" : "Error fetching data"};
                httpStatus=500;
            } else {
                response = {items};
            }
            res.status(httpStatus).json(response);
        });
    })
    .post(function(req,res){
        var response = {};
        var httpStatus=201;
        ItemsProvider.save({name : req.body.name, description :req.body.description,
                            price: req.body.price, priceUnit : req.body.priceUnit}, function(err, item){
            if(err) {
                response = {"message" : "Error adding data"};
                httpStatus=500;
            } else {
                response = {item};
            }
            res.status(httpStatus).json(response);
        });

    });

router.route("/items/:id")
    .get(function(req,res){
        var response = {};
        var httpStatus=200;
        ItemsProvider.findById(req.params.id,function(err,item){
            if(err) {
                response = {"message" : "No Data found"};
                httpStatus=404;
            } else {
                response = {item};

            }
            res.status(httpStatus).json(response);
        });
    })
    .put(function(req,res){
        var response = {};
        var httpStatus=200;
        ItemsProvider.update(req.params.id,req.body,function(err,item){
            if(err) {
                response = {"message" : err};
                httpStatus=500;
            } else {
                response = {item};
            }
            res.status(httpStatus).json(response);

        });

    })
    .delete(function(req,res){
        var response = {};
        var httpStatus= 200;
        ItemsProvider.remove(req.params.id,function(err,data){
            if(err) {
                response = {"message" : err};
                httpStatus=500;
            } else {
                response = {"message" : "Data associated with "+req.params.id+"is deleted"};
            }

            res.status(httpStatus).json(response);

        });
    })


app.use('/',router);

app.listen(8080);
console.log("Listening to PORT 8080");

