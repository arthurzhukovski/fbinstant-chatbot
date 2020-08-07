const mongoose = require('mongoose');
class DatabaseConnectionManager{
    constructor(uri){
        this.uri = uri;
        this.connection = null;
    }

    connect(){
        return this.connectToSource(this.uri).then(connection => {
            this.connection = connection;
            console.log(`Connected to the data source at ${this.uri}`)
        }).catch(error => {
            console.error(`Failed connecting to the data source at ${this.uri}: ${error}`);
        });
    }

    async connectToSource(uri){
        return mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
}

module.exports = DatabaseConnectionManager;