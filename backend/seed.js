require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./models/User');

const { ObjectId } = mongoose.Types;


const Users = [
    {createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
        name: "Dikshit Yadav",
        email: "2004dikshityadav@gmail.com",
        password: "Dikshit@123",
        role: "admin"
    }
]
async function main() {
  try {
    await mongoose.connect(process.env.MongoDB_URl);
    console.log('MongoDB connected');

    await User.insertMany(Users);
    console.log('user seeded successfully');

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();