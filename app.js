var express = require('express');
var exphbs  = require('express-handlebars');
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

// Crea un objeto de preferencia
let preference = {
    items: [
      {
        title: 'Mi producto',
        unit_price: 50,
        quantity: 1,
      }
    ]
  };

mercadopago.preferences.create(preference)
  .then(function(response){
  // Este valor reemplazará el string "$$init_point$$" en tu HTML
    global.init_point = response.body.init_point;
  }).catch(function(error){
    console.log(error);
});




app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});



app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(process.env.PORT || 3000)