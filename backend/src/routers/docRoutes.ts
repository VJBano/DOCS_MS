import { User } from 'models/user';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware'
import DocumentControllers from '../controllers/documentsController';
import { upload } from '../utils/file_multer';
import UserControllers from '../controllers/usersController';
import CommentControllers from '../controllers/commentsController';
import AccessLogControllers from '../controllers/accessLogController';
import Validator from '../utils/validator';

const docRoutes = express.Router();

docRoutes.use(authMiddleware);

//!document endpoints
docRoutes.post("/doc/create",Validator.documentValidator,upload.single('file'), DocumentControllers.createDocument); 
docRoutes.get("/doc/get", DocumentControllers.getDocument); //?with query params docID(?docID=uuid) 
docRoutes.get("/doc/getAll", DocumentControllers.getAllDocument);
docRoutes.post("/doc/update",Validator.documentValidator, DocumentControllers.updateDocument); //?with query params docID(?docID=uuid)
docRoutes.delete("/doc/delete", DocumentControllers.deleteDocument); //?with query params docID(?docID=uuid)
docRoutes.post("/doc/deleteAll", DocumentControllers.deleteAllDocument);
docRoutes.get("/doc/userDocs", DocumentControllers.getUserAllDocument) //?with query params userID(?userID=uuid)
docRoutes.get("/doc/getFile", DocumentControllers.getFile); //?with query params filename(?filename=string)
docRoutes.get("/doc/category", DocumentControllers.getDocumentCategory); //?with query params category(?category=string)
docRoutes.post("/doc/category/update", DocumentControllers.updateDocumentCategory); 
docRoutes.get("/doc/archived/year", DocumentControllers.getArchivedDocumentYear);
docRoutes.get("/doc/archived/docs", DocumentControllers.getArchivedDocument);
docRoutes.post("/doc/createStatus", DocumentControllers.createDocStatus);
docRoutes.get("/doc/checkDocumentStatus", DocumentControllers.checkUserDocStatus);
docRoutes.get("/doc/getDocsStatus", DocumentControllers.getDocumentStatus);
docRoutes.post("/doc/add-user", DocumentControllers.AddUserDocs);

//!users endpoints
docRoutes.post("/user/register", UserControllers.registerUser);
docRoutes.get("/user/getAll", UserControllers.getAllUser);
docRoutes.get("/user/get", UserControllers.getUser); //?with query params userID(?userID=uuid)
docRoutes.post("/user/update", UserControllers.updateUser); //?with query params userID(userID=uuid)
docRoutes.delete("/user/delete", UserControllers.deleteUser); //?with query params userID(userID=uuid)
docRoutes.post("/user/deleteAll", UserControllers.deleteAllUser);
docRoutes.get("/user/pagination", UserControllers.getAllUserPagination); //?with query params page(page=number)
docRoutes.get("/user/free-user", UserControllers.freeUser);

//!access_logs endpoints
docRoutes.post("/logs/create", AccessLogControllers.createAccessLogs);
docRoutes.get("/logs/get", AccessLogControllers.getAccessLogs); //?with query params docID(docID=uuid)
docRoutes.get("/log/getAll", AccessLogControllers.getAllAccessLogs);
docRoutes.post("/log/update", AccessLogControllers.updateAccessLogs); //?with query params logID(logID=uuid)
docRoutes.post("/log/delete", AccessLogControllers.deleteAccessLogs); //?with query params logID(logID=uuid)
docRoutes.post("/log/deleteAll", AccessLogControllers.deleteAllAccessLogs);

//!comments endpoints
docRoutes.post("/comment/create", CommentControllers.createComment);
docRoutes.get("/comment/get", CommentControllers.getComment); //?with query params docID(?docID=uuid)
docRoutes.get("/comment/getAll", CommentControllers.getAllComment);
docRoutes.post("/comment/update", CommentControllers.updateComment); //?with query params commentID(?commentID=uuid)
docRoutes.delete("/comment/delete", CommentControllers.deleteComment); //?with query params commentID(?commentID=uuid)
docRoutes.post("/comment/deleteAll", CommentControllers.deleteAllComment); 

//!access endpoints



//add routes here

export default docRoutes;