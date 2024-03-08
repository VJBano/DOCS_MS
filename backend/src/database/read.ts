import { User } from "../models/user";
import { dbConnect } from "./config";
import { Connection } from "mysql";
import { ArchivedYear, Document, DocumentStatus } from "../models/document";
import { AccessVault } from "../models/access_vault";
import { Comment } from "../models/comment";
import { AccessLog } from "../models/access_log";

//TODO sort DESC
//TODO sorting document and also comments for futher use.
//TODO SELECT *FROM document ORDER BY STR_TO_DATE(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') DESC LIMIT 0,100

const Read = {
  checkEmailExistence: async (email: string): Promise<boolean> => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<boolean>((resolve, reject) => {
        connection.query(
          "SELECT COUNT(*) AS count FROM users WHERE is_deleted = false AND email = ?",
          email,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              const { count } = result[0];
              resolve(count > 0);
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

  email: async (email: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<User | null>((resolve, reject) => {
        connection.query(
          "SELECT * FROM users WHERE is_deleted = false AND email = ?",
          email,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              if (result.length === 0) {
                resolve(null);
              } else {
                resolve(result[0]);
              }
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

  allUserPagination: async (offset: number) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<User[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM users WHERE is_deleted = false LIMIT ? OFFSET ?",
          [10, offset],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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
  allUsers: async () => {
    let connection: Connection;
    try {
      connection = await dbConnect();

      return new Promise<User[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM users WHERE is_deleted = false  ",
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  document: async (doc_id: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<Document[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM document WHERE id = ? AND is_deleted = false",
          doc_id,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  getAccessVault: async (user_id: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<AccessVault[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM access_vault WHERE user_id IN (?, 'ALL-USER');",
          user_id,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  getAccessVaultDocAccessID: async (doc_access: number) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<AccessVault[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM access_vault WHERE doc_access_id = ? ",
          doc_access,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  allDocument: async (offset: number, category: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      let query = "";

      switch (category) {
        case "All":
          query =
            "SELECT * FROM document WHERE is_deleted = false LIMIT ? OFFSET ?";
          break;

        case "Archived":
          query =
            "SELECT * FROM document WHERE is_deleted = false AND category = 'Archived' LIMIT ? OFFSET ?";
          break;

        case "Minute":
          query =
            "SELECT * FROM document WHERE is_deleted = false AND category = 'Minute' LIMIT ? OFFSET ?";
          break;

        case "Memorandum":
          query =
            "SELECT * FROM document WHERE is_deleted = false AND category = 'Memorandum' LIMIT ? OFFSET ?";
          break;

        case "Communication":
          query =
            "SELECT * FROM document WHERE is_deleted = false AND category = 'Communication' LIMIT ? OFFSET ?";
          break;

        case "Forms":
          query =
            "SELECT * FROM document WHERE is_deleted = false AND category = 'Forms' LIMIT ? OFFSET ?";
          break;

        case "Travel":
          query =
            "SELECT * FROM document WHERE is_deleted = false AND category = 'Travel' LIMIT ? OFFSET ?";
          break;

        case "Others":
          query =
            "SELECT * FROM document WHERE is_deleted = false AND category = 'Others' LIMIT ? OFFSET ?";
          break;

        default:
          query =
            "SELECT * FROM document WHERE is_deleted = false LIMIT ? OFFSET ?";
      }

      return new Promise<Document[]>((resolve, reject) => {
        connection.query(
          query,
          [10, offset, category == "All" ? null : category],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  getDocumentByAccesID: async (access_id: number) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<Document>((resolve, reject) => {
        connection.query(
          "SELECT * FROM document WHERE  is_deleted = false AND category != 'Archived' AND doc_access_id = ? ORDER BY created_at ASC",
          access_id,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result[0]);
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

  getCommentByDocID: async (doc_id: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<Comment[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM comment WHERE  document_id = ?",
          doc_id,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  getCommentByID: async (comment_id: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<Comment>((resolve, reject) => {
        connection.query(
          "SELECT * FROM comment WHERE id = ?",
          comment_id,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result[0]);
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

  getUserByID: async (user_id: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<User>((resolve, reject) => {
        connection.query(
          "SELECT * FROM users WHERE id = ?",
          user_id,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result[0]);
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
  getLogByDocID: async (doc_id: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<AccessLog[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM access_logs WHERE doc_id = ?",
          doc_id,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  getDocsCategory: async (category: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<Document>((resolve, reject) => {
        connection.query(
          "SELECT * FROM document WHERE  is_deleted = false AND category = ?",
          category,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result[0]);
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

  archivedDataCounter: async (year: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<number>((resolve, reject) => {
        connection.query(
          "SELECT COUNT(*) as count FROM document WHERE category = 'Archived' AND DATE_FORMAT(created_at, '%Y') = ? ;",
          [year],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result[0]["count"]);
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

  dataCounter: async (db_name: string, category?: string) => {
    let connection: Connection;

    try {
      let query = "";

      if (category == "All" || category == "") {
        query = "SELECT COUNT(*) as count FROM document";
      } else {
        if (db_name == "document") {
          query = `SELECT COUNT(*) as count FROM document WHERE category = '${category}'`;
        } else if (db_name == "user") {
          query = "SELECT COUNT(*) as count FROM users";
        }
      }

      connection = await dbConnect();

      return new Promise<number>((resolve, reject) => {
        connection.query(query, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result[0]["count"]);
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

  getArchivedYear: async () => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<ArchivedYear[]>((resolve, reject) => {
        connection.query(
          `SELECT DISTINCT DATE_FORMAT(created_at, '%Y') as archived_year
                FROM document WHERE category = 'Archived'`,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  getArchived: async (offset: number, year: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<Document[]>((resolve, reject) => {
        connection.query(
          `SELECT *
              FROM document WHERE DATE_FORMAT(created_at, '%Y') = ? AND category = 'Archived' AND is_deleted = false LIMIT ? OFFSET ?`,
          [year, 10, offset],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  GetDocsStatus: async (doc_id: string, status: string) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<DocumentStatus[]>((resolve, reject) => {
        connection.query(
          "SELECT * FROM doc_status WHERE doc_id = ? AND status = ?",
          [doc_id, status],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
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

  DocumentUserStatus: async (
    user_id: string,
    doc_id: string,
    status: string
  ) => {
    let connection: Connection;

    try {
      connection = await dbConnect();

      return new Promise<DocumentStatus>((resolve, reject) => {
        connection.query(
          "SELECT * FROM doc_status WHERE doc_id = ? AND user_id = ? AND status = ?",
          [doc_id, user_id, status],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result[0]);
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
};

export default Read;
