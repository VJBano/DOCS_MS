import axios, { AxiosError, AxiosResponse } from "axios";
import { AuthErrResponseType } from "../constants/axios";

const commentAPIURL = import.meta.env.VITE_COMMENT_API;

const CommentAPI = {

    createComment:async (document_id:string, user_id:string, comment:string, token:string) => {
        
        try {
            const payload = {
                document_id:document_id,
                user_id:user_id,
                comment:comment,
            }

            const data = await axios.post(commentAPIURL+"create", payload, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' : token ? `Bearer ${token}` : ''
                }
            }).then((res:AxiosResponse) => {
                return res.data;
            }).catch((err: AxiosError) => {
                return err.response?.status;
            });

            return data;

        } catch (error) {
            if(axios.isAxiosError(error)) {
    
                const serverError = error as AxiosError<AuthErrResponseType>;
    
                if (serverError && serverError.response) {
                    return serverError.response.data;
                  }
               }
    
               return { errorMessage: "Something Went Wrong" };
        }
    }, 

    getComment:async (doc_id:string, token:string) => {
        
        try {
            const data = await axios.get(commentAPIURL+ "get?docID="+doc_id, {
                
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' : token ? `Bearer ${token}` : ''
                }
            }).then((res:AxiosResponse) => {
                return res.data;
            }).catch((err: AxiosError) => {
                return err.response?.status;
            });

            return data;

        } catch (error) {
            if(axios.isAxiosError(error)) {
    
                const serverError = error as AxiosError<AuthErrResponseType>;
    
                if (serverError && serverError.response) {
                    return serverError.response.data;
                  }
               }
    
               return { errorMessage: "Something Went Wrong" };
        }
    },

    //! will work this if needed...
    getAllComment:async () => {
        
        try {
            
        } catch (error) {
            
        }
    },

    updateComment:async (comment_id:string,comment:string, token:string) => {
        
        try {
            
            const payload = {
                comment:comment
            };

            const data = await axios.post(commentAPIURL+"update?commentID="+comment_id, payload, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' : token ? `Bearer ${token}` : ''
                }
            }).then((res:AxiosResponse) => {
                return res.data;
            }).catch((err: AxiosError) => {
                return err.response?.status;
            });

            return data;

        } catch (error) {
            if(axios.isAxiosError(error)) {
    
                const serverError = error as AxiosError<AuthErrResponseType>;
    
                if (serverError && serverError.response) {
                    return serverError.response.data;
                  }
               }
    
               return { errorMessage: "Something Went Wrong" };
        }
    },

    deleteComment:async (comment_id:string, token:string) => {
        
        try {

            const data = await axios.delete(commentAPIURL+"delete?commentID="+comment_id,{
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' : token ? `Bearer ${token}` : ''
                }
            }).then((res:AxiosResponse) => {
                return res.data;
            }).catch((err: AxiosError) => {
                return err.response?.status;
            });

            return data;
            
        } catch (error) {
            
            if(axios.isAxiosError(error)) {
    
                const serverError = error as AxiosError<AuthErrResponseType>;
    
                if (serverError && serverError.response) {
                    return serverError.response.data;
                  }
               }
    
               return { errorMessage: "Something Went Wrong" };
        }
    },

    deleteAllComment:async (token:string) => {
        
        try {

            const data = await axios.post(commentAPIURL+"deleteAll", {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' : token ? `Bearer ${token}` : ''
                }
            }).then((res:AxiosResponse) => {
                return res.data;
            }).catch((err: AxiosError) => {
                return err.response?.status;
            });

            return data;
            
        } catch (error) {
            if(axios.isAxiosError(error)) {
    
                const serverError = error as AxiosError<AuthErrResponseType>;
    
                if (serverError && serverError.response) {
                    return serverError.response.data;
                  }
               }
    
               return { errorMessage: "Something Went Wrong" };
        }
    },
}

export default CommentAPI