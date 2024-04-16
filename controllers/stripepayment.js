const stripe = require("stripe")("sk_test_51Hp6GKHx52WIbetH8Slo2fcvb85BRdHGwmd8aSjHW4gTXFClJ1EouCZ7g0NS0lTV7WuNV87xVR5torP6Rj3zadgW00WbAdpD9J");
const { v1: uuidv1 } = require('uuid');


exports.makePayment = (req, res) => {
    const {products, token} = req.body

    console.log("PRODUCTS", products)

    let amount = 0;
    products.map(p => {
        amount = amount + p.price
    });

    const idempotencyKey = uuidv1()

    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
     .then(customer => {
         stripe.charges.create({
             amount: amount * 100,
             currency: 'usd',
             customer: customer.id,
             receipt_email: token.email,
             description: "a test account",
             shipping: {
                 name: token.card.name,
                 address: {
                     line1: token.card.address_line1,
                     line2: token.card.address_line2,
                     city: token.card.address_city,
                     country: token.card.address_country,
                     postal_code: token.card.address_zip
                 }
             }
         }, {idempotencyKey})
          .then(result => res.status(200).json(result))
          .catch(err => console.log(err))
     })
      .catch(console.log("Failed"))
}