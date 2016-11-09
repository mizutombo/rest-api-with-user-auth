const mongoose = require('mongoose');

// URI point to MongoDB for 'fleas'
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/fleas';

mongoose.Promise = Promise;
mongoose.connect(dbURI);

// CONNECTION EVENTS
// when connection is successful ...
mongoose.connection.on('connected', function() {
  console.log('mongoose default connection open to ' + dbURI);
});

// if connection throws an error ...
mongoose.connection.on('error', function(err) {
  console.log('mongoose default connection: ' + err);
});

// when connection is disconnected ...
mongoose.connection.on('disconnected',function() {
  console.log('mongoose default connection disconnected');
});

// if the Node process ends, then close the mongoose connection ...
process.on('SIGINT', function() {
  mongoose.connection.close(function(){
    console.log('mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose.connection;
