const mongoose = require('mongoose');

main().then(res => console.log('db connected successfully...!!!!'));
main().catch(err => console.log('db not connected...',err));

async function main() {
  await mongoose.connect(process.env.DB);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}