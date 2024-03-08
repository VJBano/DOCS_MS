import axios, { AxiosError, AxiosResponse } from "axios"
import { AuthErrResponseType } from "../constants/axios";

const loginAPIURL = import.meta.env.VITE_USER_LOGIN;

const LoginAPI = {

    login:async (email:string, password:string) => {
        
        try {
            
            const user = {
                email:email,
                password:password
             }

             const data = await axios.post(loginAPIURL, user,{
                headers: {
                    'Content-Type': 'application/json',
                }
             }).then((res: AxiosResponse) => {
                return res.data
             }).catch((err:AxiosError) => {
               
                return err.response?.status
             })

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
    }
}

export default LoginAPI
