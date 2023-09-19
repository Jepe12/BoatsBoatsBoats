const fs = require('fs');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb'); // Corrected import

class ProductController {

    client = null;
    database = null;
    collection = null;

    constructor(uri,collectionName) {
        this.client = new MongoClient(uri);
        this.database = this.client.db('shop');
        this.collection = this.database.collection(collectionName);
    }

    async getData(id) {
        const query = { _id: new ObjectId(id) };
        return await this.collection.findOne(query);
    }

    async getDataUser(user) {
        return await this.collection.find({username: user}).toArray()
    }

    async getDataToken(token) {
        return await this.collection.findOne({refreshToken: token})
    }

    async getAllData() {
        return await this.collection.find().toArray();
    }

    async insertData(data) {
        const result = await this.collection.insertOne(data);
        return result.insertedId;
    }

    async replaceData(id, data) {
        delete data.id;
        await this.collection.updateOne(
            {id: parseInt(id)},
            {
                $set: data
            },
        );
    }

    async updateRefreshToken(username, refreshToken) {
        // Find the user by username and update their refreshToken field
        await this.collection.updateOne({ username }, { $set: { refreshToken } });
      }

    async deleteData(id) {
        return (await this.collection.deleteOne({id: parseInt(id)})).deletedCount >= 1;
    }

    async deleteToken(username) {
        await this.collection.updateOne({ username }, { $set: { refreshToken: '' } });
    }
}

module.exports = ProductController;