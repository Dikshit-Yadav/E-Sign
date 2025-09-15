// require("dotenv").config();
// const mongoose = require("mongoose");
// const User = require("./models/User");
// const Court = require("./models/Court");
// const Document = require("./models/Document");

// const { ObjectId } = mongoose.Types;

// const DocumentData = {
//   _id: new ObjectId("68c722d179cc4e39e19c208b"),
//   readers: [],
//   title: "OBC",
//   description: "request for obc certificate",
//   createdBy: new ObjectId("68c70247f3a68e34cba439ff"),
//   court: new ObjectId("68c6fdfcf3a68e34cba43962"),
//   signedBy: {
//     officer: null,
//     signature: null,
//     signedAt: new Date(1757881144514),
//   },
//   assignedOfficer: null,
//   status: "draft",
//   numberOfDocuments: 1,
//   rejectedDocuments: 0,
//   templates: [
//     {
//       _id: new ObjectId("68c7233879cc4e39e19c20a7"),
//       date: "2025-09-15",
//       customer: "Dikshit",
//       amount: "500",
//       dueDate: "2025-09-16",
//       address: "Riwasa",
//       court: "Hansi Teshil Court",
//       caseId: "C56",
//     },
//   ],
//   createdAt: new Date(1757881041050),
//   updatedAt: new Date(1757881144516),
//   __v: 1,
  
  
// };

// async function main() {
//   try {
//     await mongoose.connect(process.env.MongoDB_URl);
//     console.log("MongoDB connected");

//     const doc = await Document.findOneAndUpdate(
//       { _id: DocumentData._id },
//       DocumentData,
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     console.log("Document seeded successfully:", doc);
//   } catch (err) {
//     console.error("Error during seeding:", err);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// main();















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