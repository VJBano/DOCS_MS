import React, { SyntheticEvent, useEffect, useState } from 'react'
import StateStore from '../../utils/store'
import { RiCloseCircleFill } from 'react-icons/ri';
import UserAPI from '../../api/user_api';
import Caching from '../../utils/caching';
import Success_Modal from './success_modal';

const Add_User = () => {

    const initAddUser = {firstname: "", lastname: "", email: "", password: "", recovery_key: "", role:"User"};

    const {token} = Caching.getCache("AppData");
    const {addUserModal, setAddUserModal, successModal, setSuccessModal} = StateStore.ModalStore();

    const [user, setUser] =  useState(initAddUser);
    const [isValid, setIsValid] = useState(false);

    const emailRejex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    useEffect(() =>{

      if(user.firstname == "" || user.lastname == "" || user.password == "" || user.recovery_key == "" || user.email == "") {

        setIsValid(false);
      } else {
        setIsValid(emailRejex.test(user.email));
      }

      

    },[user]);

    useEffect(() => {

      if(user.firstname == "") {
        setUser({...user, password:""});
      }

    },[user.firstname])

    useEffect(() => {
      
      setUser(initAddUser);

    },[successModal]);


    const handleGeneratePassword = () => {

      setUser({...user, password:  user.firstname+String(Math.floor(Math.random() * (10000 - 100000 + 1)) + 100000)})
    }

    const handleSave = async (e:SyntheticEvent) => {

      if(isValid) {

        UserAPI.createUser(user,token).then((res) => {

          if(typeof(res) !== "number") {
              
              setSuccessModal(true);
          }else {
            setSuccessModal(false);
          }

        });
      }
      
    }

  return (
    <>
    {addUserModal?
     <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <Success_Modal title={"Adding User"}/>
        <div className=" relative flex w-full h-5/6  my-6  max-w-6xl ">
          <div className={`rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none transition duration-700 ease-in-out`}>
          <div className="flex items-start justify-between p-2 border-b border-solid border-slate-300 rounded-t">
              <div className='flex w-1/3'>
              <h1 className='font-RobotoMedium text-xl  self-start flex '>Add New User</h1>
              </div>

              <div className='flex w-full justify-center'>
                <h1 className={` font-RobotoBold text-xl align-text-top`}></h1>
              </div>
              
              <div className='flex w-1/3 justify-end'> 
                <RiCloseCircleFill onClick={()=>setAddUserModal(false)} className='h-8 w-8 text-slate-500 hover:text-red-700 transition duration-300 ease-in-out'/>
              </div>
              
            </div>

            <div className='w-full h-full flex flex-col justify-start items-start'>
              
              <div className='w-full flex  pt-10 pl-10 gap-28 items-center justify-start'>
              <div>
                  <h1 className='font-RobotoMedium text-lg'>Firstname:&nbsp;</h1>
                  <input type="text"
                   value={user.firstname}
                   onChange={(e) => setUser({...user, firstname: e.target.value})}
                  id="" className="w-full bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              </div>

              <div>
                  <h1 className='font-RobotoMedium text-lg'>Lastname:&nbsp;</h1>
                  <input type="text"
                  value={user.lastname}
                  onChange={(e) => setUser({...user, lastname: e.target.value})}
                  id="" className="w-full bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              </div>

              <div>
                  <h1 className='font-RobotoMedium text-lg'>Email:&nbsp;</h1>
                  <input type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  id="" className="w-full bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              </div>

            </div>

            <div className='w-full flex  pt-10 pl-10 gap-28 items-center justify-start'>
            <div>
                <h1 className='font-RobotoMedium text-lg'>Password:&nbsp;</h1>
                <input type="text"
                disabled
                 value={user.password}
                onChange={(e) => setUser({...user, password:e.target.value})}
                id="" className="w-full bg-gray-500 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              <button  onClick={() => user.firstname? handleGeneratePassword(): alert("Enter Firstname First!")} type="button" className="mt-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Generate
                </button>
            </div>

            <div>
                <h1 className='font-RobotoMedium text-lg'>Recovery Key:&nbsp;</h1>
                <input type="text"
                value={user.recovery_key}
                onChange={(e) => setUser({...user, recovery_key:e.target.value})}
                id="" className="w-full bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>

            <div>
            <h1 className="font-RobotoMedium text-lg">Role:&nbsp; </h1>
                      <select
                        onChange={(e) =>
                          setUser({
                            ...user,
                            role: e.target.value,
                          })
                        }
                        value={user.role}
                        className="w-28 bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="User" defaultChecked>
                          User
                        </option>
                        <option value="Admin">Admin</option>
                       
                      </select>
            </div>

          </div>

          <div className="w-full mt-20 flex justify-end pr-10 ">
                    <button
                      onClick={() => setUser(initAddUser)}
                      type="button"
                      className="font-RobotoMedium  text-white bg-red-500 hover:bg-red-900 focus:outline-none rounded-md text-base px-5 py-2.5 mr-2 mb-2 dark:bg-red-500 dark:hover:bg-red-700 "
                    >
                      Reset
                    </button>
                    <button
                      onClick={(e) => handleSave(e)}
                      disabled={isValid ? false : true}
                      className={`${
                        isValid
                          ? "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:hover:bg-green-700 dark:focus:ring-green-800 focus:ring-4 "
                          : "bg-gray-600"
                      } font-RobotoMedium focus:outline-none text-white rounded-md text-base px-5 py-2.5 mr-2 mb-2  `}
                    >
                      Save
                    </button>
                  </div>

            </div>


          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black rounded-lg"></div>
     </> 
     
     : ""}

    </>
  )
}

export default Add_User;