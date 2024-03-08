import axios, { AxiosError, AxiosResponse } from "axios"
import { User, UserAddPayload, UserUpdatePayload } from "../constants/user"
import { AuthErrResponseType } from "../constants/axios";

const UserAPIURL = import.meta.env.VITE_USER_API

const UserAPI = {

    createUser:async (user:UserAddPayload,token:string) => {

        try {
            
            const payload:UserAddPayload = {
                firstname:user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                role: user.role,
                recovery_key: user.recovery_key
            };

            const data = await axios.post(UserAPIURL+"register", payload, {
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

    getUser:async (user_id:string,token:string) => {

        try {
            
            const data = await axios.get(UserAPIURL+"get?userID="+user_id, {
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

    updateUser:async (id:string, user:UserUpdatePayload,token:string) => {

        try {

            const payload = {
                firstname : user.firstname,
                lastname :  user.lastname,
                role :  user.role,
            }

            const data = await axios.post(UserAPIURL+"update?userID="+id, payload, {
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

    getUserPagination:async (page:number, token:string) => {

        try {
            
            const data = await axios.get(UserAPIURL+"pagination?page="+page, {
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

    freeUser:async (access_id:number, token:string) => {
        
        try {
            
            const data = await axios.get(UserAPIURL+"free-user?accessID="+access_id, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' : token ? `Bearer ${token}` : ''
                }
            }).then((res:AxiosResponse) => {
                return res.data;
            }).catch((err: AxiosError) => {
                return err.response?.status;
            });

            return data

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

    getAllUser: async (token:string) => {

        try {
            
            const data = await axios.get(UserAPIURL+"getAll", {
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

    deleteUser:async (user_id:string,token:string) => {

        try {
            
            const data = await axios.delete(UserAPIURL+"delete?userID="+user_id, {
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

    deleteAllUser:async (token:string) => {

        try {
            
            const data = await axios.post(UserAPIURL+"deleteAll", {
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
    }

}

export default UserAPI