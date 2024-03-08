import express from 'express'
import IDgenerator from '../utils/idGenerator'
import { Comment } from '../models/comment';
import Create from '../database/create';
import Read from '../database/read';
import Update from '../database/update';
import Delete from '../database/delete';
import logger from '../utils/logger';

const CommentControllers = {
    createComment: async (req:express.Request, res:express.Response) => {
        try {
            
            const {
                document_id,
                user_id,
                comment
            } = req.body;

            const dataToDB:Comment = {
                id:IDgenerator.UUIDGenerator(),
                document_id:document_id,
                user_id:user_id,
                comment:comment,
                created_at:new Date().toISOString()
            }

            Create.comment(dataToDB).then((dbRes) => {

                if(dbRes !== 1){
                    return res.status(400).json("Error Adding Comment")
                } else {
                    return res.status(200).json("Comment Successfully Added! ")
                }
            })

        } catch (error) {
            logger.fatal(`From CommentControllers-createComment: ${error}`);
            return;
        }
    },

    getComment: async (req:express.Request, res:express.Response) => {
        
        try {
            
            const docId = req.query.docID;
            let commentArray = []
            const comment = await Read.getCommentByDocID(docId.toString());

            for (const user of comment) {


                const users = await Read.getUserByID(user.user_id);

                if(users){

                const commentObj = {
                    id:user.id,
                    document_id: user.document_id,
                    user_id:users.id,
                    user_name: users.firstname + " "+users.lastname,
                    comment:user.comment,
                    created_at: user.created_at
                }

                commentArray.push(commentObj);
                }
            }

           return res.status(200).json(commentArray);
            

        } catch (error) {
            logger.fatal(`from CommentControllers-getComment: ${error}`);
            return ;
        }
    },

    //! will work this if needed...
    getAllComment: async (req:express.Request, res:express.Response) => {
        
    },

    updateComment:async (req:express.Request, res:express.Response) => {
        
        try {
            
            const commentID = req.query.commentID;

            const {
                comment,
            } = req.body

            const userID = await Read.getCommentByID(commentID.toString());

            if(userID.user_id === res.locals.jwt.id) {

                //! logic here...
                Update.comment(commentID.toString(), comment).then((dbRes) => {
                    if(dbRes !== 1){
                        return res.status(400).json("Error Updating Comment")
                    } 

                    return res.status(200).json("Update Comment Sucessfully!");
                });

                
            } else {
                return res.status(400).json("di ikaw ang ni comment!")
            }
             

        } catch (error) {
            logger.fatal(`from CommentControllers-updateComment: ${error}`);
            return;
        }
    },

    deleteComment:async (req:express.Request, res:express.Response) => {
        
        try {
            
            const commentID = req.query.commentID;

            const userID = await Read.getCommentByID(commentID.toString());

            if(userID.user_id === res.locals.jwt.id) {

                //! logic here...
                Delete.comment(commentID.toString()).then((dbRes) => {
                    if(dbRes !== 1){
                        return res.status(400).json("Error Deleting Comment")
                    } 

                    return res.status(200).json("Delete Comment Sucessfully!");
                });

                
            } else {

                return res.status(400).json("di ikaw ang ni comment!")
            }

        } catch (error) {
            logger.fatal(`from CommentControllers-deleteComment: ${error}`);
            return;
        }
    },

    deleteAllComment:async (req:express.Request, res:express.Response) => {
        
        try {
            
            if(res.locals.jwt.role == "Admin"){

                Delete.allComment().then((dbRes) => {
                    if(dbRes == 1) {
                        return res.status(200).json({message:`Sucessfully Deleting All Comments!`});
                    } else {
                        return res.status(400).json({message: "Error Deleting All Comments!"});
                    }
                });

            } else {
                return res.status(401).json("Authorized Account only can Access!");
            }
        } catch (error) {
            logger.fatal(`from CommentControllers-deleteAllComment: ${error}`);
            return;
        }
    }

}

export default CommentControllers