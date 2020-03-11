var express = require('express');
var exphbs  = require('express-handlebars');
const mercadopago = require ('mercadopago'); // SDK de Mercado Pago

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Agrega credenciales
mercadopago.configure({
    sandbox: true,
    access_token: 'TEST-8647754926493-031119-7e542abc4c800e76f40a2d5774bba08a-535129128'
});

// Crea un objeto de preferencia


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    const {img, title, price, unit} = req.query
    let preference = {
        items: [
          {
            "picture_url": img,
            "title": title,
            "unit_price": Number(price),
            "quantity": Number(unit),
          }
        ]
    }

    mercadopago.preferences.create(preference)
      .then(function(response){
      // Este valor reemplazará el string "$$init_point$$" en tu HTML
        global.init_point = response.body.init_point;
        res.render('detail', {img, title, price, unit, id: response.body.id});
      }).catch(function(error){
        console.log(error)
    });
});


app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 3000)