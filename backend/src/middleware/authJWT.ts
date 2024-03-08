
import  jwt from "jsonwebtoken"
import { jwtUser } from "../models/user"
import dotenv from 'dotenv'

dotenv.config()

const authJWT = (user:jwtUser, callback:(error:Error | null, token:string) => void) =>  {

    try {
        
        jwt.sign({
            id: user.id,
            email:user.email,
            role:user.role
        },process.env.SERVER_TOKEN_SECRET,
        {issuer:process.env.SERVER_TOKEN_ISSUER, algorithm:'HS256', expiresIn: process.env.SERVER_TOKEN_EXP_TIME},
        (error, token) => {
            if(error) {
                callback(error, null)
            } else if(token){
                callback(null, token)
            }
        }
        )
    } catch (error) {
        callback(error, null)
        throw error
    }

}

export default authJWT