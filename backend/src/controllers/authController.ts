
import Read from "../database/read"
import  express  from "express"
import { User } from "models/user"
import Argon from "../utils/argon"
import authJWT from "../middleware/authJWT"
import Update from "../database/update"
import {validationResult} from 'express-validator'
import logger from "../utils/logger"

const AuthControllers = {

    loginUser: async (req:express.Request, res: express.Response) => {
        try {

            const errors = validationResult(req)
            
            if (!errors.isEmpty()) {
                
              return res.status(422).json(errors.array().map((i) =>  i.msg))
              }

            const {
                email,
                password,
            } = req.body
    
            
            // if (!email || !password) {
            //     return res.status(400).json({"message" : "Please provide All inputs!"})
            // }
    
            const userData:User = await Read.email(email);
    
            if(userData == null) {
                return res.status(400).json({"message" : "Incorrect Email or Password "})
            }
    
            const isPassValid =  await Argon.verifyHash(userData.password, password)
    
            if(isPassValid !== true ) {
                return res.status(400).json({"message" : "Incorrect Email or Password "})
            }
    
    
            authJWT(userData,(_error, token) => {
                if(_error){
                    res.status(400).json({message: "There is a problem signing JWT!", error:_error})
                } else if(token) {
    
                    Update.userToken(token, token, userData.id).then((res) => {
                        logger.info(`token update: ${res}`);
                    })
                    
                    Read.getUserByID(userData.id).then((userRole) => {
                        
                        if(userRole !== null || userRole !== undefined){
                            return res.status(200).json({
                                message : "Correct Email and Password",
                                id:userData.id,
                                role:userRole.role,
                                token:token,
            
                            })
                        }
                    });
                    
                }
            })
    
        } catch (error) {
            
            logger.fatal("login Error: ", error)
            return
        }
    
    } 
}      

export default AuthControllers