const mongodb = require('mongodb')

class MongoClient {
    constructor(host, port, uname, pwd, db, opt) {
        const dbhost = host ? host: process.env.MONGO_HOST
        const dbport = port ? port: process.env.MONGO_PORT
        const dbuname = uname ? encodeURIComponent(uname): encodeURIComponent(process.env.MONGO_USERNAME)
        const dbpwd = pwd ? encodeURIComponent(pwd): encodeURIComponent(process.env.MONGO_PASSWORD)
        const dbdb = db ? db: process.env.MONGO_DB || "admin"
        const dbopt = opt ? opt: process.env.MONGO_OPTION || '?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
        const auth = dbuname && dbpwd ? `${dbuname}:${dbpwd}@`: ''
        const uri = `mongodb://${auth}${dbhost}:${dbport}/${dbdb}${dbopt}`
        
        this.client = new mongodb.MongoClient(uri)
        this.host = dbhost
        this.port = dbport
        this.dbname = dbdb
        this.uri = uri
        this.db = null
    }

    async connect() {
        try {
            await this.client.connect();
            await this.client.db(this.db).command({ ping: 1 });
            this.db = this.client.db(this.dbname);
            console.log("Connected successfully to mongo :", `${this.host}:${this.port}/${this.dbname}`);
        } catch(err) {
            // Ensures that the client will close when you finish/error
            console.log(err)
            await this.db.close()
        }
    }

    async close() {
        await this.db.close();
        console.log("Disconnected from :", `${this.host}:${this.port}/${this.dbname}`);
    }

    async findOne(collection, data) {
        try {
            const res = await this.db.collection(collection).findOne(data).catch(err => {throw err})
            return res
        } catch (err) {
            throw err
        }
    }

    async findAll(collection, query={}, options={}, isCursor=false) {
        try {
            const res = await this.db.collection(collection).find(query, options)
            let result = isCursor ? res: await res.toArray()
            return result
        } catch (err) {
            throw err
        }
    }

    async insertOne(collection, doc) {
        try {
            const result = await this.db.collection(collection).insertOne(doc)
            return result
        } catch (err) {
            throw err
        }
    }

    async updateAll(collection, query, doc, options) {
        try {
            const updateDoc = { $set: {} }
            for(let key in doc) {
                updateDoc.$set[key] = doc[key]
            }
            const result = await this.db.collection(collection).updateMany(query, updateDoc, options)
            return result
        } catch (err) {
            throw err
        }
    }

    async deleteOne(collection, doc) {
        try {
            const result = await this.db.collection(collection).deleteOne(doc)
            return result
        } catch (err) {
            throw err
        }
    }

    async deleteMany(collection, doc) {
        try {
            const result = await this.db.collection(collection).deleteMany(doc)
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = {
    MongoClient
}