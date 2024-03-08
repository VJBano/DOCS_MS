
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'

dotenv.config()

const authMiddleware = (req:Request, res:Response, next:NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];

    if(token) {

        jwt.verify(token,process.env.SERVER_TOKEN_SECRET, (error, decode) => {

            if(error) {

                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                      message: 'Token has expired',
                    });
                  } else {
                    return res.status(401).json({
                      message: 'Token is invalid',
                    });
                  }

            } else {
                res.locals.jwt = decode;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: "UnAuthorized Access"
        });
    }
}   

export default authMiddleware