// init connection to db and communicate
import { MongoClient } from "mongodb";
let connection;
const DataBase = {
    connect: (endpoint, callBack) => {
        MongoClient
            .connect(`mongodb://127.0.0.1/${endpoint}`)
            .then(client => {
                connection = client.db();
                return callBack();
            })
            .catch(err => {
                console.error(err);
                return callBack(err);
            });
    },
    get: () => connection
}

export default DataBase;