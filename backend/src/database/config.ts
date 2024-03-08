import mysql from 'mysql';
import dotenv from 'dotenv'

dotenv.config()

const connectionParams = {
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  }

  const dbConnect = async () => new Promise<mysql.Connection>((resolve, reject) => {
        const connection = mysql.createConnection(connectionParams)

        connection.connect((error) => {
            if(error){
                reject(error);
                return;
            }

            resolve(connection)
        })
  })

  export {
    dbConnect
  }