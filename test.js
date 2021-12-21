const mongo = require('./index')

const client = new mongo.init('0.0.0.0','27017','admin','admin','test')
client.cek()