import React, { useEffect, useState } from 'react'
import Side_Bar from '../../components/side_bar'
import Page_Loader from '../../components/page_loader'
import dms_logo from '../../assets/dms_logo.png'
import UserAPI from '../../api/user_api'
import { User, initUser } from '../../constants/user'
import Caching from '../../utils/caching'

const User_Dashboard = () => {

  const {token, id} = Caching.getCache("AppData");
  const [username, setUsername] = useState<User>(initUser);

  useEffect(() => {

    UserAPI.getUser(id, token).then((res) => {

      if(typeof(res) !== "number") {
          setUsername(res);
      }
    });

  },[]);
  
  return (
    <div className=' w-full h-screen '>
       <div className='flex flex-row items-start justify-start w-full h-full '>
        <div className='flex flex-col justify-start items-center w-2/12 bg-white h-full px-3'>
        <div className='py-3 px-1 border-b- w-full justify-center items-start flex'>
        <img src={dms_logo} className=" h-20 w-20"/>
         </div>

         {/* sidebar component here here... */}
         <Side_Bar/>
        </div>

          <div className='flex flex-col  w-full h-full '>
            <div className='flex flex-row items-center justify-between my-2 mx-4 bg-gradient-to-t bg-[#222222] rounded-sm h-12 drop-shadow'>
              <div className=' mx-2 text-white font-headerFont text-xl font-semibold font-RobotoBold'>
                    {/* header here... */}
                </div>
                <div className='flex mx-3'>
                  {/* header right content... */}
              <h1 className={`group-hover:shadow xl:flex hidden text-white mr-5`}>Hi, Welcome Back {username.firstname}</h1>

              </div>
            </div>
            <div className={ `h-full max-h-full bg-gray-200 my-3 mx-3 rounded-lg drop-shadow-2xl `}>
              {/* page loader here... */}
              <Page_Loader/>
            </div>
          </div>
       </div>
    </div>
  )
}

export default User_Dashboard
