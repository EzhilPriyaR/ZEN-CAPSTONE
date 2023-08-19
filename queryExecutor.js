const mongo = require('mongodb');
const properties = require('./properties');


exports.executeQuery = async function (agg, callback) {
    const client = await mongo.MongoClient.connect(
        properties.mondoDBURL,{ useNewUrlParser: true, useUnifiedTopology: true }
    );
    const coll = client.db('capstoneProject').collection('studentsScore');
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();
    await client.close();
    callback(result);
}


