const bcrypt = require('bcrypt')
const saltRounds = 10
const password = 'azerty'

console.log('Clear password: ' + password)

bcrypt.hash(password, saltRounds, function(err, hash) {
  console.log('Hash password: ' + password)
});

bcrypt.compare(password, hash, function(err, res) {
  console.log(res)
});


/*
  console.log('Clear password: ' + password)

  bcrypt.hash(password, saltRounds, function(err, hash) {
    const result = hash
    console.log('Hash password: ' + hash)

    bcrypt.compare(password, result, function(err, res) {
      console.log(res)
    });
  });
  */
