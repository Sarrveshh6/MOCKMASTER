const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/MockMaster');
  const dbs = await mongoose.connection.db.admin().listDatabases();
  console.log('Databases:', dbs.databases.map(d => d.name).join(', '));
  
  const mockMasterUsers = mongoose.connection.db.collection('users');
  const mmUsers = await mockMasterUsers.find({}).toArray();
  console.log('MockMaster Users:', mmUsers);
  
  await mongoose.disconnect();
  
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  const testUsers = mongoose.connection.db.collection('users');
  const tUsers = await testUsers.find({}).toArray();
  console.log('Test Users:', tUsers);
  
  await mongoose.disconnect();
}
check().catch(console.error);
