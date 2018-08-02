 // configure the server
 var path = require('path'),
     routes = require('./routes'),
     moment = require('moment'),
     exphbs = require('express-handlebars'),
     express = require('express'),
     bodyParser = require('body-parser'),
     Models = require('../models'),
     ipfsAPI = require('ipfs-api'),
     multer = require('multer');

    methodOverride = require('method-override'),
     errorHandler = require('errorhandler');


 module.exports = function (app) {
     // app.use(morgan('dev'));
     app.use(multer({
         dest: path.join(__dirname, 'public/upload/temp/')
     }).single('img'));

     app.use(bodyParser.urlencoded({
         'extended': true
     }));
     app.use(bodyParser.json());
     app.use(methodOverride());
     // app.use(cookieParser('some-secret-value-here'));
     // routes(app); // moving the routes to routes folder

     app.use('/public/', express.static(path.join(__dirname, '../public')));

     if ('development' === app.get('env')) {
         app.use(errorHandler());
     }


     // register handlebars as the default view rendering engine
     app.engine('handlebars', exphbs.create({
         defaultLayout: 'main',
         layoutsDir: app.get('views') + '/layouts',
         partialsDir: [app.get('views') + '/partials'],
         helpers: {
            // hbs.registerAsyncHelper('formatid', function(id, cb) {
            //     mOrders.formatOrderID(id, function(err, formatted_id){
            //       // err is always null, no need to handle
            //       console.log(formatted_id);
            //       cb(formatted_id);
            //     });
            //   });
             idtoName: function (id,string){
                
                Models.Doctor.findOne({
                    '_id': id
                },function(err,res){
                    if (err) {
                        console.log ("no id found");
                    }
                    else{
                        
                        string.data = res.personalDetail.firstName +" "+res.personalDetail.lastName;
                    }
                    
                });
               
                return string.data.root.dr.personalDetail.firstName +" "+string.data.root.dr.personalDetail.lastName;
             },
             yearago: function (timestamp) {
                 return Math.floor(moment(new Date()).diff(moment(timestamp,"MM/DD/YYYY"),'years',true));
             },

             ifCond: function (v1, v2, options) {
                 if (v1 === v2) {
                     return options.fn(this);
                 }
                 return options.inverse(this);
             },
             ifCondList: function (v1, v2, options) {
                 for (i = 0; i < v2.length; i++) {
                     console.log('v2 is', v2[i].acc);
                     console.log('v1 is ', v1);
                     if (v1 === v2[i].acc) {
                         console.log('vote found');
                         return options.fn(this);
                     }
                 }
                 console.log('vote not found');
                 return options.inverse(this);
             },
             ifNotCond: function (v1, v2, options) {
                 if (v1 !== v2) {
                     return options.fn(this);
                 }
                 return options.inverse(this);
             },

             //     timeago: function(timestamp){
             //         return moment(timestamp).startOf('minute').fromNow();
             //     }
         }
     }).engine);
     app.set('view engine', 'handlebars');

     // activate routes
     routes(app);
     return app;

 };