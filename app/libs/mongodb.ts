// import { MongoClient } from 'mongodb';

// const uri = process.env.DATABASE_URL!;
// const options = {};

// if (!uri) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// let mongoClient = new MongoClient(uri, options);
// mongoClient.connect()

// const watchCollections = () => {
//   const database = mongoClient.db("dev")
//   const familyCollection = database.collection('Family')

//   const familyChangeStream = familyCollection.watch()

//   familyChangeStream.on('change', (change) => {
    
//       //push chnge to frontend 
//   });
// }


// watchCollections()

import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL!;
const options = {};

let mongoClient = new MongoClient(uri, options)

export async function connectMongoClient() {
  await mongoClient.connect();
}

export default mongoClient;
