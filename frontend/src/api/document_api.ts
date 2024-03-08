import axios, { AxiosError, AxiosResponse } from "axios";
import { AuthErrResponseType } from "../constants/axios";
import { DocumentPayload } from "../constants/document";

const DocumentAPIUrl = import.meta.env.VITE_DOCUMENT_API;

const DocumentAPI = {
  createDocument: async (
    file: File,
    category: string,
    description: string,
    permittedUser: string,
    token: string
  ) => {
    try {
      const payload = {
        doc_name: file.name,
        doc_description: description,
        permitted_user: permittedUser,
        category: category,
        file: file,
      };

      const data = await axios
        .post(DocumentAPIUrl + "create", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },
  getDocument: async (doc_id: string, token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "get?docID=" + doc_id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  getDocumentStatus: async (doc_id: string, status: string, token: string) => {
    try {
      const data = await axios
        .get(
          DocumentAPIUrl +
            "getDocsStatus?docID=" +
            doc_id +
            "&status=" +
            status,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        )
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  checkDocumentStatus: async (
    user_id: string,
    doc_id: string,
    status: string,
    token: string
  ) => {
    try {
      const data = await axios
        .get(
          DocumentAPIUrl +
            "checkDocumentStatus?userID=" +
            user_id +
            "&docID=" +
            doc_id +
            "&status=" +
            status,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        )
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },
  getAllDocument: async (page: number, category: string, token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "getAll?page=" + page + "&category=" + category, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  updateCategory: async (category: string, docID: string, token: string) => {
    try {
      const payload = {
        category: category,
      };

      const data = await axios
        .post(DocumentAPIUrl + "category/update?docID=" + docID, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  createDocumentStatus: async (
    doc_id: string,
    user_id: string,
    status: string,
    token: string
  ) => {
    try {
      const payload = {
        doc_id: doc_id,
        user_id: user_id,
        status: status,
      };

      const data = await axios
        .post(DocumentAPIUrl + "createStatus", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  updateDocument: async (
    doc_name: string,
    category: string,
    doc_description: string,
    doc_id: string,
    token: string
  ) => {
    try {
      const payload = {
        doc_name: doc_name,
        doc_description: doc_description,
        category: category,
      };

      const data = await axios
        .post(DocumentAPIUrl + "update?docID=" + doc_id, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  deleteDocument: async (doc_id: string, token: string) => {
    try {
      const data = await axios
        .delete(DocumentAPIUrl + "delete?docID=" + doc_id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },
  deleteAllDocument: async (token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "deleteAll", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  getUserAllDocument: async (user_id: string, token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "userDocs?userID=" + user_id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  getFile: async (filename: string, token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "getFile?filename=" + filename, {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  getFilePDF: async (filename: string, token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "getFile?filename=" + filename, {
          responseType: "arraybuffer",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  getArchivedYear: async (token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "archived/year", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  getArchivedDocument: async (year: string, page: number, token: string) => {
    try {
      const data = await axios
        .get(DocumentAPIUrl + "archived/docs?year=" + year + "&page=" + page, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },

  // add-user

  addDocsUser: async (users: string, doc_access_id: number, token: string) => {
    try {
      const payload = {
        users: users,
        doc_access_id: doc_access_id,
      };

      const data = await axios
        .post(DocumentAPIUrl + "add-user", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err: AxiosError) => {
          return err.response?.status;
        });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<AuthErrResponseType>;

        if (serverError && serverError.response) {
          return serverError.response.data;
        }
      }

      return { errorMessage: "Something Went Wrong" };
    }
  },
};

export default DocumentAPI;
