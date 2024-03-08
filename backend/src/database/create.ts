import { Connection } from "mysql";
import { AccessLog } from "../models/access_log";
import { User } from "../models/user";
import { Document, DocumentStatus } from "../models/document";
import { Comment } from "../models/comment";
import { AccessVault } from "../models/access_vault";
import { dbConnect } from "./config";

const Create = {
  user: async (user: User): Promise<string | number> => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<string | number>((resolve, reject) => {
        connection.query("INSERT INTO users SET ?", user, (error, results) => {
          if (error) {
            reject(error.code);
          } else {
            resolve(results.affectedRows);
          }
        });
      });
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.end();
      }
    }
  },

  comment: async (comment: Comment) => {

    let connection:Connection;

    try {

      connection = await dbConnect();

      return new Promise<string | number>((resolve, reject) => {
        connection.query("INSERT INTO comment SET ?", comment,(error, results) => {
            if(error) {
              reject(error.code);
            } else {
              resolve(results.affectedRows);
            }
        });
      });
      
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.end();
      }
    }
  },

  document: async (document: Document): Promise<string | number> => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<string | number>((resolve, reject) => {
        connection.query(
          "INSERT INTO document SET ? ",
          document,
          (error, results) => {
            if (error) {
              reject(error.code);
            } else {
              resolve(results.affectedRows);
            }
          });
      });
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.end();
      }
    }
  },

  accessLog: async (accessLog: AccessLog) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<string | number>((resolve, reject) => {
        connection.query(
          "INSERT INTO access_logs SET ?",
          accessLog,
          (error, results) => {
            if (error) {
              reject(error.code);
            } else {
              resolve(results.affectedRows);
            }
          }
        );
      });
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.end();
      }
    }
  },

  accessVault: async (accessVault: AccessVault) => {

    let connection: Connection;

    try {
      
      connection = await dbConnect();

      return new Promise<string | number>((resolve, reject) => {

        connection.query("INSERT INTO access_vault SET ?", accessVault, (error, result) => {
          if (error) {
            reject(error.code);
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

  DocumentStatus:async (data: DocumentStatus) => {
    
    let connection: Connection;
    try {

      connection = await dbConnect();

      return new Promise<string | number>((resolve, reject) => {

        connection.query("INSERT INTO doc_status SET ?", data, (error, result) => {
          if (error) {
            reject(error.code);
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

  
};

export default Create;
