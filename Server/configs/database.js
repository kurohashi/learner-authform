var mongo = require('mongodb').MongoClient;
const { Pool } = require('pg');
var conf = require('../configs/app.conf');
let console = conf.console;

const route = {
  serviceMap: {
    mongodb: conMongo,
    postgres: conPostgres,
  },
  dbConf: {
    mongodb: {
      server: "localhost:27017",
      database: "test_db",
      reconn: { useNewUrlParser: true, useUnifiedTopology: true },
    },
    postgres: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "8520",
      database: "events"
    },
  }
};

function connect(conf, callback) {
  route.serviceMap[conf.service || "mongodb"](callback);
}

function conPostgres(callback) {
  let pool = new Pool(route.dbConf.postgres);
  conf.db = pool;
  console.log("database connected");
  callback();
}

function conMongo(callback) {
  mongo.connect(`mongodb://${route.dbConf.mongodb.server}/${route.dbConf.mongodb.database}`, route.dbConf.mongodb.reconn, function (err, d) {
    if (!err) {
      console.log("database connected");
      conf.db = d.db();
      callback();
    } else {
      console.log("Database connection error", err);
      callback(err);
    }
  });
}

module.exports = {
  connect: connect,
};