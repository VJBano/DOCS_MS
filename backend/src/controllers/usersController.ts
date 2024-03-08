import Create from "../database/create";
import Read from "../database/read";
import express from "express";
import { User } from "../models/user";
import Argon from "../utils/argon";
import IDgenerator from "../utils/idGenerator";
import { validationResult } from "express-validator";
import Update from "../database/update";
import Delete from "../database/delete";
import logger from "../utils/logger";

const UserControllers = {
  registerUser: async (req: express.Request, res: express.Response) => {
    try {
      const { firstname, lastname, email, password, role, recovery_key }: User =
        req.body;
      if (res.locals.jwt.role == "Admin") {
        if (!firstname || !lastname || !email || !role || !recovery_key) {
          return res.sendStatus(400);
        }

        const emailExist = await Read.checkEmailExistence(email);

        if (emailExist) {
          return res.status(400).json("Email Already Exist!");
        }

        const hashPassword = await Argon.createHash(password);

        const user: User = {
          id: IDgenerator.UUIDGenerator(),
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: hashPassword,
          role: role,
          recovery_key: recovery_key,
          token: "jwt",
          reset_token: "jwt",
          created_at: new Date().toISOString(),
          is_deleted: false,
        };

        Create.user(user).then((dbRes) => {
          if (dbRes !== 1) {
            return res.status(400).json("Error Adding User");
          }

          return res.status(200).json("User Successfully Added! ");
        });
      } else {
        return res.status(401).json("Can't have Permission to Register User");
      }
    } catch (error) {
      logger.fatal(`from UserControllers-registerUser: ${error}`);
      return;
    }
  },
  updateUser: async (req: express.Request, res: express.Response) => {
    try {
      const userID = req.query.userID;

      const { firstname, lastname, role } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const dataToDB = {
        firstname: firstname,
        lastname: lastname,
        role: role,
      };

      Update.user(dataToDB as User, userID.toString()).then((dbRes) => {
        if (dbRes !== 1) {
          return res.status(400).json("Error Updating User");
        }

        return res.status(200).json("User Successfully Updated! ");
      });
    } catch (error) {
      logger.fatal(`from UserControllers-updateUser: ${error}`);
      return;
    }
  },
  getUser: async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.query.userID;

      if (res.locals.jwt.role == "Admin" || res.locals.jwt.role == "User") {
        Read.getUserByID(userId.toString()).then((dbRes) => {
          if (dbRes) {
            return res.status(200).json(dbRes);
          }

          return res.status(400).json("No User Exist!");
        });
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from UserControllers-getUser: ${error}`);
      return;
    }
  },
  getAllUserPagination: async (req: express.Request, res: express.Response) => {
    try {
      let page = parseInt(String(req.query.page), 10);
      const offset = (page - 1) * 10;

      if (res.locals.jwt.role == "Admin") {
        const documentCount = await Read.dataCounter("user");

        Read.allUserPagination(offset).then((dbRes) => {
          const totalPages = Math.ceil(documentCount / 10);

          if (page > totalPages) {
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
            return res.status(400).json("No Users Exist!");
          }
        });
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from UserControllers-getAllUser: ${error}`);
      return;
    }
  },

  getAllUser: async (req: express.Request, res: express.Response) => {
    try {
      if (res.locals.jwt.role == "Admin" || res.locals.jwt.role == "User") {
        Read.allUsers().then((dbRes) => {
          if (dbRes.length !== 0) {
            return res.status(200).json(dbRes);
          } else {
            return res.status(400).json("No Users Exist!");
          }
        });
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from UserControllers-getAllUser: ${error}`);
      return;
    }
  },

  deleteUser: async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.query.userID;

      if (res.locals.jwt.role == "Admin") {
        Delete.user(userId.toString()).then((dbRes) => {
          if (dbRes !== 1) {
            return res.status(400).json({ message: "Error Deleting User!" });
          } else {
            return res
              .status(200)
              .json({ message: `Deleting user ${userId} successfully!` });
          }
        });
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from UserControllers-deleteUser: ${error}`);
      return;
    }
  },

  deleteAllUser: async (req: express.Request, res: express.Response) => {
    try {
      if (res.locals.jwt.role == "Admin") {
        Delete.allUser().then((dbRes) => {
          if (dbRes == 1) {
            return res
              .status(200)
              .json({ message: `Sucessfully Deleting All Users!` });
          } else {
            return res
              .status(400)
              .json({ message: "Error Deleting All User!" });
          }
        });
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from UserControllers-deleteAllUser: ${error}`);
      return;
    }
  },
  freeUser: async (req: express.Request, res: express.Response) => {
    try {
      const accessID = req.query.accessID;
      const userIDs: string[] = [];

      if (res.locals.jwt.role == "Admin") {
        const users = await Read.getAccessVaultDocAccessID(
          parseInt(accessID.toString())
        );

        const allUsers = await Read.allUsers();

  
        if (users[0].user_id == "ALL-USER") {
          return res.status(200).json("ALL USERS ARE ADDEDs");
        } else {
          for (const ids of users) {
            userIDs.push(ids.user_id);
          }

          const filteredUsers = allUsers.filter(
            (user) => !userIDs.includes(user.id)
          );

          if (filteredUsers.length != 0) {
            return res.status(200).json(filteredUsers);
          } else {
            return res.status(200).json("ALL USERS ARE ADDED");
          }
        }
      } else {
        return res.status(401).json("Authorized Account only can Access!");
      }
    } catch (error) {
      logger.fatal(`from DocumentControllers-addUserDocs: ${error}`);
      return;
    }
  },
};

export default UserControllers;
