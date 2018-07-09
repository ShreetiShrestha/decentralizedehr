// boot up
var express = require('express'),
    config = require('./server/configure'),
    mongoose = require('mongoose'),
    app = express();
require('./models')


app.set('port', process.env.PORT || 3300);
app.set('views', __dirname+'/views');
app = config(app);

mongoose.connect ('mongodb://localhost/decentralizedehr');
mongoose.connection.on('open',function(){
    console.log('Mongoose connected.');
});
// mongoose.connect('mongodb://decentralizedehr:Rabibhawan1@ds149874.mlab.com:49874/decentralizedehr');
// mongoose.connection.on('open', function () {
//     console.log('Mongoose connected');
// })
 
// app.get('/', function(req, res){
//     res.send('Hello World');
// });

app.listen(app.get('port'),function(){
    console.log('Server up: http://localhost:'+app.get('port'));
});