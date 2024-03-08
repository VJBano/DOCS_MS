import { Connection } from "mysql"
import { dbConnect } from "./config";

const Delete = {

    document:async (doc_id:string) => {

        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject)=> {
                connection.query("DELETE  FROM document WHERE id = ?", doc_id, (error, result) => {
                    if(error) {
                        reject(error)
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

    user:async (user_id:string) => {
        
        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM users WHERE id = ?", user_id,(error, result) => {

                    if(error) {
                        reject(error)
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

    allUser:async () => {
        
        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM users ",(error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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
    allDocument:async () => {
        
        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM document ",(error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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
     comment:async (commentID:string) => {
        
        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM comment WHERE id = ?", commentID,(error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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
     allComment:async () => {
        
        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM comment ",(error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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
    logs:async (log_id:string) => {
        
        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM access_logs WHERE id = ?", log_id,(error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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

    allLogs:async () => {
        
        let connection:Connection;

        try {

            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM access_logs ",(error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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

    allAccessVault:async () => {
        
        let connection:Connection;

        try {

            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM access_vault ",(error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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
    accessVaultdocAccessID:async (user_id:number) => {
        
        let connection:Connection;

        try {
            
            connection = await dbConnect();

            return new Promise<number | string>((resolve, reject) => {

                connection.query("DELETE FROM access_vault WHERE doc_access_id = ? ",user_id, (error, result) => {

                    if(error) {
                        reject(error)
                    } else {
                        resolve(1);
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
}

export default Delete