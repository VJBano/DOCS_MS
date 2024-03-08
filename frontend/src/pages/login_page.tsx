import { SyntheticEvent, useEffect, useState } from "react"
import { Login, initLogin } from "../constants/login"
import LoginAPI from "../api/login_api";
import Caching from "../utils/caching";
import { useNavigate } from "react-router-dom";
import dms from '../assets/dms_front.png'

const Login_Page = () => {

    const navigate = useNavigate();
    
    const [login, setLogin] = useState<Login>(initLogin);
    const [loginResponse, setLoginResponse] = useState("");

    useEffect(() => {
        setLoginResponse("")
     },[login]);

    const handleLogin = (e:SyntheticEvent) => {
        e.preventDefault();

        LoginAPI.login(login.email, login.password).then((res) => {

            if(res !== undefined && typeof(res) !== "number"){

                Caching.setCache("AppData", res, 86400000);

                if(res.role === "Admin"){
                    navigate('/admin');
                } else if(res.role === "User"){
                    navigate('/user');
                } else {
                    setLoginResponse("Something went wrong")
                }

            } else if(res == 400) {
                setLoginResponse("Wrong Email or Password!")
            } else if(res == 422){
                setLoginResponse("Input Valid Email and Password")
            } else {
                setLoginResponse("server error")
            }

        });
    }

  return (
    <>
        <div className="w-screen h-screen flex justify-center items-center
    bg-gradient-to-br from-purple-700 to-amber-700">
        <form className="p-10 bg-white rounded-xl drop-shadow-lg space-y-5" onSubmit={handleLogin}>
            <img className="mx-auto h-24 w-auto font-RobotoBlack" src={dms} alt="Your Logo Here"/>
            <h1 className="text-center text-3xl font-RobotoRegular">Sign in to your account</h1>
            <span className="font-RobotoMedium text-red-600">{loginResponse}</span>
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-RobotoMedium" >Email</label>
                <input  className="w-96 px-3 py-2 rounded-md border border-slate-400 font-RobotoLight" 
                onChange={(e) => setLogin({...login, email: e.target.value })}
                onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Please Enter Email"
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                type="email" 
                placeholder="Your Email"
                name="email" id="email"/>
            </div>
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-RobotoMedium" >Password</label>
                <input className="w-96 px-3 py-2 rounded-md border border-slate-400 font-RobotoLight" 
                onChange={(e) => setLogin({...login, password: e.target.value })}
                onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Please Enter Password"
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                type="password"
                placeholder="Your Password" 
                name="password" id="password"/>
            </div>


            <button  className="w-full px-10 py-2 bg-blue-600 text-white rounded-md
            hover:bg-blue-500 hover:drop-shadow-md duration-300 ease-in font-RobotoMedium" type="submit">
                Sign In
            </button>

            <p className="text-right"><a className="text-blue-600 text-sm font-RobotoLight hover:underline"
                    href="https://www.kindacode.com">Forget Password?</a></p>
        </form>
    </div> 
    </>
  )
}

export default Login_Page
