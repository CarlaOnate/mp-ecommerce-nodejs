var express = require('express');
var exphbs  = require('express-handlebars');
const mercadopago = require ('mercadopago'); // SDK de Mercado Pago

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Agrega credenciales
mercadopago.configure({
    sandbox: true,
    access_token: 'APP_USR-6718728269189792-112017-dc8b338195215145a4ec035fdde5cedf-491494389'
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
        ],
        payer: {
            name: 'Lalo',
            surname: 'Landa',
            email: 'test_user_98623993@testuser.com',
            phone: {
              area_code: '55',
              number: 49737300
            },
            address: {
              street_name: 'Insurgentes Sur',
              street_number: 1602,
              zip_code: '03940'
            }
          },
          payment_methods: {
            excluded_payment_methods: [
                {
                    "id":"amex"
                }
            ],
            excluded_payment_types: [
                {
                    "id": "atm"
                }
            ],
            installments: 6
        },
        external_reference: 'ABCD1234',
        back_urls: {
            "success": "https://carlaonate-mp-commerce-nodejs.herokuapp.com/success"
        }
    }


    mercadopago.preferences.create(preference)
      .then(function(response){
        global.init_point = response.body.init_point;
        res.render('detail', {img, title, price, unit, id: response.body.id});
      }).catch(function(error){
        console.log(error)
    });
});

app.post('/success', (req, res) => {
    if(!req.body) return res.status(404)
    res.status(200)
})

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 3000)