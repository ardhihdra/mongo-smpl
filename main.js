const mongodb = require('mongodb')

class MongoClient {
    constructor(host, port, uname, pwd, db, opt) {
        const dbhost = host ? host: process.env.MONGO_HOST
        const dbport = port ? port: process.env.MONGO_PORT
        const dbuname = uname ? uname: process.env.MONGO_USERNAME
        const dbpwd = pwd ? pwd: process.env.MONGO_PASSWORD
        const dbdb = db ? db: process.env.MONGO_DB || "admin"
        const dbopt = opt ? opt: process.env.MONGO_OPTION || '?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
        const auth = dbuname && dbpwd ? `${dbuname}:${dbpwd}@`: ''
        const uri = `mongodb://${auth}${dbhost}:${dbport}/${dbdb}${dbopt}`
        
        this.client = new mongodb.MongoClient(uri)
        this.db = dbdb
    }

    cek() {
        console.log("URL", this.client)
    }

    async connect() {
        try {
            await this.client.connect();
            await this.client.db(this.db).command({ ping: 1 });
            console.log("Connected successfully to :", uri);
        } catch {
            // Ensures that the client will close when you finish/error
            await this.close()
        }
    }

    async close() {
        console.log("Disconnected from :", uri);
        await this.client.close();
    }

    async findOne(collection, data) {
        const connection = this.client.serverConfig.isConnected()
        if(!connection) throw new Error("Not connected to mongo server")
        try {
            const res = await this.client.collection(collection).findOne(data).catch(err => {throw err})
            return res
        } catch (err) {
            throw err
        }
    }

    async findAll(collection, query={}, options={}, isCursor=false) {
        const connection = this.client.serverConfig.isConnected()
        if(!connection) throw new Error("Not connected to mongo server")
        try {
            const res = await this.client.collection(collection).find(query, options)
                .catch(err => {throw err})
            let result = isCursor ? res: await res.toArray()
            return res
        } catch (err) {
            throw err
        }
    }

    async insertOne(collection, doc) {
        const connection = this.client.serverConfig.isConnected()
        if(!connection) throw new Error("Not connected to mongo server")
        try {
            const result = await this.client.collection(collection).insertOne(doc)
            return result
        } catch (err) {
            throw err
        }
    }

    async updateAll(collection, updateDoc, options) {
        const connection = this.client.serverConfig.isConnected()
        if(!connection) throw new Error("Not connected to mongo server")
        try {
            const result = await this.client.collection(collection).updateMany(query, updateDoc, options)
            return result
        } catch (err) {
            throw err
        }
    }

    async deleteOne(collection, doc) {
        const connection = this.client.serverConfig.isConnected()
        if(!connection) throw new Error("Not connected to mongo server")
        try {
            const result = await this.client.collection(collection).deleteOne(doc)
            return result
        } catch (err) {
            throw err
        }
    }

    async deleteMany(collection, doc) {
        const connection = this.client.serverConfig.isConnected()
        if(!connection) throw new Error("Not connected to mongo server")
        try {
            const result = await this.client.collection(collection).deleteMany(doc)
            return result
        } catch (err) {
            throw err
        }
    }

    async deleteMany(collection, doc) {
        const connection = this.client.serverConfig.isConnected()
        if(!connection) throw new Error("Not connected to mongo server")
        try {
            const result = await this.client.collection(collection).deleteMany(doc)
            return result
        } catch (err) {
            throw err
        }
    }
}

exports.MongoClient = MongoClient