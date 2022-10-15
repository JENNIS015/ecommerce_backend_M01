const mercadoPago=requiere("mercadopago")
const config =requiere("./config.js")

mercadoPago.configure({
    access_token : config.ML
})
module.exports={mercadoPago}
