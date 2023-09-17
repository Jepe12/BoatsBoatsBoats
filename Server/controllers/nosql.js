const { MongoClient } = require('mongodb');

class NosqlController {

    client = null;
    database = null;
    collection = null;

    constructor(uri) {
        this.client = new MongoClient(uri);
        this.database = this.client.db('site');
        this.collection = this.database.collection('products');
    }

    async getData(id) {
        return await this.collection.findOne({id: parseInt(id)})
    }

    async insertData(data) {
        await this.collection.insertOne(data);
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

    async deleteData(id) {
        return (await this.collection.deleteOne({id: parseInt(id)})).deletedCount >= 1;
    }
}

module.exports = NosqlController;