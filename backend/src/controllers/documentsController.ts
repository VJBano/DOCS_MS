import express, { query } from "express";
import { Document, initDocument } from "../models/document";
import IDgenerator from "../utils/idGenerator";
import Create from "../database/create";
import Read from "../database/read";
import Delete from "../database/delete";
import { AccessVault } from "models/access_vault";
import Update from "../database/update";
import logger from "../utils/logger";
import { staticFilesPath } from "../index";
import path from "path";
import { raw } from "body-parser";

const DocumentControllers = {
  createDocument: async (req: express.Request, res: express.Response) => {
    try {
      //!from multer
      const filePath = req.file.path;

      //!from api request
      const { doc_name, doc_description, permitted_user, category } = req.body;

      const fileType = req.file.mimetype;
      let fileTypeName = "";
      const permittedUserArray = JSON.parse(permitted_user);
      const docAccessID = IDgenerator.IdGenerator();
      const grantedArray = [];
      const AllUserID = IDgenerator.IdGenerator();

      if (
        fileType ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        fileTypeName = "docx";
      } else if (fileType == "application/pdf") {
        fileTypeName = "pdf";
      } else if (
        fileType ==
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        fileTypeName = "pptx";
      } else if (fileType == "image/png" || fileType == "image/jpeg") {
        fileTypeName = "image";
      } else {
        fileTypeName = "unknown";
      }

      let dataToDB: Document = initDocument;

      if (permittedUserArray == "ALL-USER") {
        dataToDB = {
          id: IDgenerator.UUIDGenerator(),
          doc_name: doc_name,
          doc_type: fileTypeName,
          doc_description: doc_description,
          category: category,
          path: filePath,
          created_at: new Date().toISOString(),
          created_by: res.locals.jwt.email,
          doc_access_id: AllUserID,
          is_deleted: false,
        };
      } else {
        dataToDB = {
          id: IDgenerator.UUIDGenerator(),
          doc_name: doc_name,
          doc_type: fileTypeName,
          doc_description: doc_description,
          category: category,
          path: filePath,
          created_at: new Date().toISOString(),
          created_by: res.locals.jwt.email,
          doc_access_id: docAccessID,
          is_deleted: false,
        };
      }

      const documentResult = await Create.document(dataToDB);

      if (documentResult !== 1) {
        return res.status(400).json("Error Adding Document");
      }

      for (const grantedUser of permittedUserArray) {
        let accessVaultToDB: AccessVault;

        if (grantedUser == "ALL-USER") {
          // 1111111111
          accessVaultToDB = {
            id: IDgenerator.UUIDGenerator(),
            doc_access_id: AllUserID,
            user_id: grantedUser,
            created_at: new Date().toISOString(),
            created_by: res.locals.jwt.email,
            updated_by: res.locals.jwt.email,
          };
        } else {
          accessVaultToDB = {
            id: IDgenerator.UUIDGenerator(),
            doc_access_id: docAccessID,
            user_id: grantedUser,
            created_at: new Date().toISOString(),
            created_by: res.locals.jwt.email,
            updated_by: res.locals.jwt.email,
          };
        }

        const accessRes = await Create.accessVault(accessVaultToDB);

        if (accessRes !== 1) {
          grantedArray.push({
            status: 400,
            message: "Error Adding User Access",
          });
        } else {
          grantedArray.push({
            status: 200,
            message: "Granted User Successfully Added!",
          });
        }
      }

      return res.status(200).json({
        document: "Document Successfully Added! ",
        granted_user: grantedArray,
      });
    } catch (error) {
      logger.fatal(`from DocumentControllers-createDocument: ${error}`);
      return;
    }
  },

  getDocument: async (req: express.Request, res: express.Response) => {
    try {
      const docID = req.query.docID;

      if (res.locals.jwt.role == "Admin" || res.locals.jwt.role == "User") {
        Read.document(docID.toString()).then((dbRes) => {
          if (dbRes.length > 0) {
            return res.status(200).json(dbRes);
          } else {
            return res.status(400).json({ message: "Document Doesn't Exist!" });
          }
        });
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from DocumentControllers-getDocument: ${error}`);
      return;
    }
  },

  getAllDocument: async (req: express.Request, res: express.Response) => {
    try {
      const userID = res.locals.jwt.id;
      const category = req.query.category;
      let page = parseInt(String(req.query.page), 10);
      let Documents: Document[] = [];
      const offset = (page - 1) * 10;

      //!user document access logic
      if (res.locals.jwt.role == "Admin" || res.locals.jwt.role == "User") {
        const documentCount = await Read.dataCounter(
          "document",
          category.toString()
        );

        console.log("count: ", documentCount);

        Read.allDocument(offset, category.toString()).then((dbRes) => {
          let totalPages = Math.ceil(documentCount / 10);

          if (page >= totalPages) {
            page = totalPages;
          }
          if (page < 1) {
            page = 1;
          }

          if (dbRes.length !== 0) {
            return res.status(200).json({
              data: dbRes,
              total_data: documentCount,
              total_page: totalPages,
              current_page: page,
              data_count: offset + dbRes.length,
            });
          } else {
            return res.status(400).json({ error: "something went wrong!" });
          }
        });
      } else {
        const userAccesVault = await Read.getAccessVault(userID);

        for (const access_id of userAccesVault) {
          const documentData = await Read.getDocumentByAccesID(
            access_id.doc_access_id
          );

          Documents.push(documentData);
        }

        return res.status(200).json(Documents);
      }
    } catch (error) {
      logger.fatal(`from DocumentControllers-getAllDocument: ${error}`);
      return;
    }
  },

  getUserAllDocument: async (req: express.Request, res: express.Response) => {
    try {
      const userID = req.query.userID;
      const userDocsArray = [];

      if (
        userID.toString() === res.locals.jwt.id ||
        res.locals.jwt.role == "Admin"
      ) {
        const userDocs = await Read.getAccessVault(userID.toString());

        if (userDocs) {
          for (const docs of userDocs) {
            const document = await Read.getDocumentByAccesID(
              docs.doc_access_id
            );

            if (document) {
              userDocsArray.push(document);
            }
          }
        }

        return res.status(200).json(userDocsArray);
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from controllers document-updateDocument: ${error}`);
      return;
    }
  },

  updateDocument: async (req: express.Request, res: express.Response) => {
    try {
      const docID = req.query.docID;

      const { doc_name, doc_description, category } = req.body;

      if (res.locals.jwt.role == "Admin") {
        Update.document(
          doc_name,
          category,
          doc_description,
          docID.toString()
        ).then((dbRes) => {
          if (dbRes == 1) {
            return res
              .status(200)
              .json({ message: `Updating doc_ id ${docID} successfully!` });
          } else {
            return res.status(400).json({ error: "Error Updating Document!" });
          }
        });
      } else {
        return res
          .status(401)
          .json("Can't Update Document, Authorized User Only!");
      }
    } catch (error) {
      logger.fatal(`from controllers document-updateDocument: ${error}`);
      return;
    }
  },

  deleteDocument: async (req: express.Request, res: express.Response) => {
    try {
      const docID = req.query.docID;
      const usersArray = [];

      if (res.locals.jwt.role == "Admin") {
        //!check document id first
        const document = await Read.document(docID.toString());

        if (document.length !== 0) {
          //!delete users in access_vault
          const userAccess = await Read.getAccessVaultDocAccessID(
            document[0].doc_access_id
          );

          for (const users of userAccess) {
            const deleteUser = await Delete.accessVaultdocAccessID(
              users.doc_access_id
            );
            usersArray.push(deleteUser);
          }

          const deleteDocs = await Delete.document(docID.toString());

          if (deleteDocs !== 1) {
            res.status(400).json({ message: "Error Deleting Document!" });
          } else {
            res
              .status(200)
              .json({ message: `Deleting doc_ id ${docID} successfully!` });
          }
        } else {
          return res.status(400).json("Document Doesn't Exist!");
        }
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from controllers document-deleteDocument: ${error}`);
      return;
    }
  },

  deleteAllDocument: async (req: express.Request, res: express.Response) => {
    try {
      if (res.locals.jwt.role == "Admin") {
        const deleteDocument = await Delete.allDocument();

        if (deleteDocument == 1) {
          const deleteVault = await Delete.allAccessVault();

          return res.status(200).json({
            message: `Sucessfully Deleting All Document!`,
            deleteVault: deleteVault,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Error Deleting All Document!" });
        }
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from controllers document-deleteAllDocument: ${error}`);
      return;
    }
  },

  getFile: async (req: express.Request, res: express.Response) => {
    try {
      const filename = req.query.filename;

      const filePath = path.join(staticFilesPath, filename.toString());

      res.sendFile(filePath, (err) => {
        if (err) {
          console.error(`Error serving file: ${err.message}`);
          res.status(500).end();
        }
      });
    } catch (error) {
      logger.fatal(`from controllers document-getFile: ${error}`);
      return;
    }
  },

  getDocumentCategory: async (req: express.Request, res: express.Response) => {
    try {
      const category = req.query.category;

      if (category) {
        Read.getDocsCategory(category.toString()).then((categoryRes) => {
          if (categoryRes) {
            return res.status(200).json(categoryRes);
          } else {
            return res
              .status(400)
              .json({ message: "Getting Documents Category" });
          }
        });
      } else {
        return res.status(400).json({ message: "Getting Documents Category" });
      }
    } catch (error) {
      logger.fatal(`from controllers document-getDocumentCategory: ${error}`);
      return;
    }
  },

  updateDocumentCategory: async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const docID = req.query.docID;

      const { category } = req.body;

      if (docID.toString() && category) {
        const categoryResult = await Update.category(
          category,
          docID.toString()
        );

        if (categoryResult == 1) {
          return res.status(200).json({ message: "Successfully Update!" });
        } else {
          return res.status(400).json({ message: "Something went wrong!" });
        }
      } else {
        return res.status(400).json({ message: "Fields Cannot be Empty!" });
      }
    } catch (error) {
      logger.fatal(
        `from controllers document-updateDocumentCategory: ${error}`
      );
      return;
    }
  },

  getArchivedDocumentYear: async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      if (res.locals.jwt.role == "Admin") {
        const archivedYear = await Read.getArchivedYear();

        return res.status(200).json(archivedYear);
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(
        `from controllers document-getArchivedDocumentYear: ${error}`
      );
      return;
    }
  },

  getArchivedDocument: async (req: express.Request, res: express.Response) => {
    try {
      const userID = res.locals.jwt.id;
      const year = req.query.year;
      let page = parseInt(String(req.query.page), 10);
      let Documents: Document[] = [];
      const offset = (page - 1) * 10;

      //!user document access logic
      if (res.locals.jwt.role == "Admin") {
        const documentCount = await Read.archivedDataCounter(year.toString());

        Read.getArchived(offset, year.toString()).then((dbRes) => {
          let totalPages = Math.ceil(documentCount / 10);

          if (page >= totalPages) {
            page = totalPages;
          }
          if (page < 1) {
            page = 1;
          }

          if (dbRes.length !== 0) {
            return res.status(200).json({
              data: dbRes,
              total_data: documentCount,
              total_page: totalPages,
              current_page: page,
              data_count: offset + dbRes.length,
            });
          } else {
            return res.status(400).json({ error: "something went wrong!" });
          }
        });
      } else {
        const userAccesVault = await Read.getAccessVault(userID);

        for (const access_id of userAccesVault) {
          const documentData = await Read.getDocumentByAccesID(
            access_id.doc_access_id
          );

          Documents.push(documentData);
        }

        return res.status(200).json(Documents);
      }
    } catch (error) {
      logger.fatal(`from DocumentControllers-getAllDocument: ${error}`);
      return;
    }
  },

  getDocumentStatus: async (req: express.Request, res: express.Response) => {
    try {
      const docID = req.query.docID;
      const status = req.query.status;

      const users = [];

      if (res.locals.jwt.role == "Admin") {
        const data = await Read.GetDocsStatus(
          docID.toString(),
          status.toString()
        );

        for (const user of data) {
          const name = await Read.getUserByID(user.user_id);

          if (name.id) {
            users.push(name.firstname);
          }
        }

        return res.status(200).json({
          status: status.toString(),
          user: users,
        });
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from DocumentControllers-getDocumentStatus: ${error}`);
      return;
    }
  },

  checkUserDocStatus: async (req: express.Request, res: express.Response) => {
    try {
      const userID = req.query.userID;
      const docID = req.query.docID;
      const status = req.query.status;

      const result = await Read.DocumentUserStatus(
        userID.toString(),
        docID.toString(),
        status.toString()
      );

      return res.status(200).json(result);
    } catch (error) {
      logger.fatal(`from DocumentControllers-checkUserDocStatus: ${error}`);
      return;
    }
  },

  createDocStatus: async (req: express.Request, res: express.Response) => {
    try {
      const { doc_id, user_id, status } = req.body;

      if (user_id) {
        const data = {
          id: IDgenerator.UUIDGenerator(),
          doc_id: doc_id,
          user_id: user_id,
          status: status,
          created_at: new Date().toISOString(),
        };

        const createStatus = await Create.DocumentStatus(data);

        if (createStatus !== 1) {
          return res.status(400).json({ error: "something went wrong!" });
        } else {
          return res
            .status(200)
            .json({ error: "Granted User Successfully Added!" });
        }
      }
    } catch (error) {
      logger.fatal(`from DocumentControllers-createDocStatus: ${error}`);
      return;
    }
  },

  AddUserDocs: async (req: express.Request, res: express.Response) => {
    try {
      const { users, doc_access_id } = req.body;

      const newUser = JSON.parse(users);
      const newAddedUser = [];

      if (res.locals.jwt.role == "Admin") {
        for (const user of newUser) {
          let accessVaultPayload: AccessVault;

          accessVaultPayload = {
            id: IDgenerator.UUIDGenerator(),
            doc_access_id: doc_access_id,
            user_id: user,
            created_at: new Date().toISOString(),
            created_by: res.locals.jwt.email,
            updated_by: res.locals.jwt.email,
          };

          const accessRes = await Create.accessVault(accessVaultPayload);

          if (accessRes !== 1) {
            newAddedUser.push({
              status: 400,
              message: "Error Adding User Access",
            });
          } else {
            newAddedUser.push({
              status: 200,
              message: "Granted User Successfully Added!",
            });
          }
        }
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }

      return res.status(200).json({
        document: "Document Successfully Added! ",
        granted_user: newAddedUser,
      });
    } catch (error) {
      logger.fatal(`from DocumentControllers-AddUserDocs: ${error}`);
      return;
    }
  },
};

export default DocumentControllers;
