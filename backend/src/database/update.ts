import { Connection } from "mysql";
import { dbConnect } from "./config";
import { User } from "../models/user";
import { Document } from "../models/document";
import { LevelWithSilentOrString } from "pino";

const Update = {

    userToken: async (token:string, reset_token:string, id:string) => {
        
      let connection:Connection;

      try {
        
        connection = await dbConnect();
        
        return new Promise((resolve, reject) => {
  
          connection.query('UPDATE users SET token = ?, reset_token= ? WHERE id = ?',[token,reset_token, id],
          (error, result) => {
              if (error) {
                  reject(error);
                } else {
                  resolve(result.affectedRows);
                }
          });
        });

      } catch (error) {
        throw error
      }finally {
        if (connection) {
          connection.end();
        }
      }
        
    },

    user:async (user:User, user_id:string) => {
      
      let connection:Connection;

      try {

        const {
          firstname,
          lastname,

          role
        } = user

        connection = await dbConnect();

        return new Promise((resolve, reject) => {
          connection.query("UPDATE users SET firstname = ?, lastname = ?, role = ? WHERE id = ?",
          [firstname, lastname, role,user_id],(error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.affectedRows);
            }
          });
        });
        
      } catch (error) {
        throw error
      } finally {
        if (connection) {
          connection.end();
        }
      }
    },

    comment:async (commentID:string, comment:string) => {
      
      let connection:Connection;

      try {
        
        connection = await dbConnect();

        return new Promise((resolve, reject) => {
          connection.query("UPDATE comment SET comment = ? WHERE id = ?", [comment, commentID], (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.affectedRows);
            }
          });
        });

      } catch (error) {
        throw error
      } finally {
        if (connection) {
          connection.end();
        }
      }
    },

    category: async (category:string, id:string) => {

      let connection:Connection;

      try {
        
        connection = await dbConnect();

        return new Promise((resolve, reject) => {
          connection.query(`UPDATE document SET category = ? WHERE id = ?`, [category,id], (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.affectedRows);
            }
          });
        });


      } catch (error) {
        throw error
      }finally {
        if (connection) {
          connection.end();
        }
      }
    },

    document:async (doc_name:string, category:string, doc_description:LevelWithSilentOrString, docID:string) => {

      let connection:Connection;

      try {
        
        connection = await dbConnect();

        return new Promise((resolve, reject) => {
          connection.query(`UPDATE document SET doc_name = ?, category = ?, doc_description = ? WHERE id = ?`, [doc_name,category,doc_description,docID], (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.affectedRows);
            }
          });
        });

      } catch (error) {
        throw error
      }finally {
        if (connection) {
          connection.end();
        }
      }
    }
      
  
}

export default Update