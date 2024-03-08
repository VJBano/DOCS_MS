import Create from '../database/create'
import express from 'express'
import { AccessLog } from '../models/access_log'
import IDgenerator from '../utils/idGenerator'
import Read from '../database/read'
import Delete from '../database/delete'
import logger from '../utils/logger'

const AccessLogControllers = {

    createAccessLogs:async (req:express.Request, res:express.Response) => {
        
        try {
            
            const {

                doc_id,
                user_id
            } = req.body

            const dataToDB:AccessLog = {
                id:IDgenerator.UUIDGenerator(),
                doc_id:doc_id,
                user_id:user_id,
                access_date: new Date().toISOString()
            }

            Create.accessLog(dataToDB).then((dbRes) => {

                if(dbRes !== 1){
                    return res.status(400).json("Error Adding Access Log")
                }
    
                return res.status(200).json("Access Log Successfully Added! ")
            })

            
        } catch (error) {
            logger.fatal(` controllers access-createAccessLogs: ${error}`);
            return res.sendStatus(400);
        }
    },
    getAccessLogs:async (req:express.Request, res:express.Response) => {
        try {

            const docID = req.query.docID;
            let logArray = [];

            if(res.locals.jwt.role == "Admin"){
                
                const logs = await Read.getLogByDocID(docID.toString());

                if(logs) {

                    for (const docLogs of logs) {

                        const users = await Read.getUserByID(docLogs.user_id);

                        if(users) {
                            
                            const logsObj = {
                                id:docLogs.id,
                                doc_id: docLogs.doc_id,
                                user: users.firstname + " " + users.lastname,
                                access_date:docLogs.access_date
                            }

                            logArray.push(logsObj);
                        } 
                    }
                }

                return res.status(200).json(logArray);

            } else {
                return res.status(401).json("Authorized Account only can Access!");
            }
            
        } catch (error) {
            logger.fatal(`from controllers access-getAccessLogs: ${error}`);
            return res.sendStatus(400);
        }
    },

    //! will work this if needed...
    getAllAccessLogs:async (req:express.Request, res:express.Response) => {
        try {
            
            if(res.locals.jwt.role == "Admin"){
                
            }
        } catch (error) {
            logger.fatal(`from controllers access-getAllAccessLogs: ${error}`);
            return res.sendStatus(400);
        }
    },

    //! will work this if needed...
    updateAccessLogs:async (req:express.Request, res:express.Response) => {
        
        try {

            if(res.locals.jwt.role == "Admin"){
                
            }

        } catch (error) {
            logger.fatal("from controllers access-updateAccessLogs: ", error);
            return res.sendStatus(400);
        }
    },


    deleteAccessLogs:async (req:express.Request, res:express.Response) => {
        
        try {

            const logID = req.query.logID;

            if(res.locals.jwt.role == "Admin"){

                Delete.logs(logID.toString()).then((dbRes) => {
                    if(dbRes !== 1){
                        return res.status(400).json("Error deleting Logs")
                    } 

                    return res.status(200).json("Delete log Sucessfully!");
                });

                
            } else {
                return res.status(401).json("Authorized Account only can Access!");
            }

        } catch (error) {
            logger.fatal(`from controllers access-deleteAccessLogs: ${error}`);
            return res.sendStatus(400);
        }
    },
    deleteAllAccessLogs:async (req:express.Request, res:express.Response) => {
        
        try {
            
            if(res.locals.jwt.role == "Admin"){
                
                Delete.allLogs().then((dbRes) => {
                    if(dbRes == 1) {
                        return res.status(200).json({message:`Sucessfully Deleting All Logs!`});
                    } else {
                        return res.status(400).json({message: "Error Deleting All Logs!"});
                    }
                })
            }else {
                return res.status(401).json("Authorized Account only can Access!");
            }

        } catch (error) {
            logger.fatal(`from controllers access-deleteAllAccessLogs: ${error}`);
            return res.sendStatus(400);
        }
    },
}

export default AccessLogControllers