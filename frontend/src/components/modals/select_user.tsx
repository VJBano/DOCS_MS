import React, { SyntheticEvent, useEffect, useState } from 'react'
import { RiCloseCircleFill } from 'react-icons/ri'
import StateStore from '../../utils/store'
import { User, UserUpdatePayload, initUser } from '../../constants/user';
import UserAPI from '../../api/user_api';
import Caching from '../../utils/caching';
import Success_Modal from './success_modal';

const Select_User = () => {

    const {selectUserModal, setSelectUserModal,setSuccessModal } = StateStore.ModalStore();
    const {token} = Caching.getCache("AppData");
    const [user, setUser] = useState<User>(initUser);
    const [option, setOption] = useState(1)
    const [editUserForm, setEditUserForm] = useState({firstname:"", lastname:"", role:""});
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      if(editUserForm.firstname == "" || editUserForm.lastname == "" || editUserForm.role == "") {

        setIsValid(false);
      } else {
        setIsValid(true);
      }
    },[editUserForm]);

    useEffect(() => {
      setEditUserForm({firstname:user.firstname, lastname:user.lastname, role:user.role});
      
    },[option,selectUserModal]);

    useEffect(() => {
      setOption(1);
        UserAPI.getUser(selectUserModal.id, token).then((res) => {

            if(typeof(res) !== "number") {
                setUser(res);
            }
        });

        setSuccessModal(false);

    },[selectUserModal]);

    const handleDelete =async () => {
      
      UserAPI.deleteUser(user.id, token).then((res) => {

        console.log("res: ", res)
        if(typeof(res) !== "number") {
          setSuccessModal(true);
        } else {
          setSuccessModal(false);
        }

      });

    }

    const handleUpdate = async (e:SyntheticEvent) => {
      e.preventDefault();
      
      if(isValid) {

        const payload:UserUpdatePayload = {
          firstname:editUserForm.firstname,
          lastname:editUserForm.lastname,
          role:editUserForm.role
        };

          UserAPI.updateUser(user.id, payload, token).then((res) => {

            if(typeof(res) !== "number") {
                setSuccessModal(true);
            }
          })
      }

    }

    const editUser = (
      <div className='w-full h-full flex flex-col justify-start items-start '>
       <div className='w-full flex  pt-10 pl-10 gap-28 items-center justify-start'>
              <div>
                  <h1 className='font-RobotoMedium text-lg'>Firstname:&nbsp;</h1>
                  <input type="text"
                   value={editUserForm.firstname}
                    onChange={(e) => setEditUserForm({...editUserForm, firstname: e.target.value})}
                  id="meter_no" className="w-full bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              </div>

              <div>
                  <h1 className='font-RobotoMedium text-lg'>Lastname:&nbsp;</h1>
                  <input type="text"
                  value={editUserForm.lastname}
                   onChange={(e) => setEditUserForm({...editUserForm, lastname: e.target.value})}
                  id="meter_no" className="w-full bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              </div>

              <div>
            <h1 className="font-RobotoMedium text-lg">Role:&nbsp; </h1>
                      <select
                        onChange={(e) =>
                          setEditUserForm({
                            ...editUserForm,
                            role: e.target.value,
                          })
                        }
                        value={editUserForm.role}
                        className="w-28 bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="User" defaultChecked>
                          User
                        </option>
                        <option value="Admin">Admin</option>
                       
                      </select>
            </div>

            <div className="w-full mt-20 flex justify-end pr-10 ">
                    <button
                      onClick={() => setEditUserForm({firstname:"", lastname:"", role:""})}
                      type="button"
                      className="font-RobotoMedium  text-white bg-red-500 hover:bg-red-900 focus:outline-none rounded-md text-base px-5 py-2.5 mr-2 mb-2 dark:bg-red-500 dark:hover:bg-red-700 "
                    >
                      Reset
                    </button>
                    <button
                      onClick={(e) => handleUpdate(e)}
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
    )

    const viewUser = (
      <div className='w-full h-full flex flex-col justify-start items-start '>
        <div className='w-full flex  pt-10 pl-10 gap-28 items-center justify-start'>
              <div>
                  <h1 className='font-RobotoMedium text-lg'>Firstname:&nbsp; {user.firstname}</h1>
                  
              </div>

              <div>
                  <h1 className='font-RobotoMedium text-lg'>Lastname:&nbsp;{user.lastname}</h1>
                  
              </div>

              <div>
                  <h1 className='font-RobotoMedium text-lg'>Email:&nbsp;{user.email}</h1>
                  
              </div>

            </div>

            <div className='w-full flex  pt-10 pl-10 gap-28 items-center justify-start'>
              <div>
                  <h1 className='font-RobotoMedium text-lg'>Role:&nbsp; {user.role}</h1>
                  
              </div>
            </div>

            <div className="w-full mt-40 flex justify-end pr-10 ">
          
                    <button
                        onClick={() => handleDelete()}
                      className={`
                           "bg-green-700 hover:bg-red-800 focus:ring-red-300 dark:hover:bg-red-700 dark:focus:ring-red-800 focus:ring-4
                          bg-red-500
              font-RobotoMedium focus:outline-none text-white rounded-md text-base px-5 py-2.5 mr-2 mb-2  `}
                    >
                      Delete
                    </button>
                  </div>

        </div>
    )
  return (
    <>
    {selectUserModal.isSelected? 
    <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          {option == 1 ? <Success_Modal title={"Deleting User"}/>:<Success_Modal title={"Updating User"}/> }
         
          <div className=" relative flex w-full h-5/6  my-6  max-w-6xl ">
            <div className={`rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none transition duration-700 ease-in-out`}>
            
            <div className="flex items-start justify-between p-2 border-b border-solid border-slate-300 rounded-t">
              <div className='flex w-1/3'>
              <h1 className='font-RobotoMedium text-xl  self-start flex '>{user.firstname+ " "+user.lastname}</h1>
              </div>

              <div className='flex w-full justify-center'>
                <h1 className={` font-RobotoBold text-xl align-text-top`}></h1>
              </div>
              
              <div onClick={() => setSelectUserModal({id:"", isSelected:false})} className='flex w-1/3 justify-end'> 
                <RiCloseCircleFill  className='h-8 w-8 text-slate-500 hover:text-red-700 transition duration-300 ease-in-out'/>
              </div>
              
            </div>

            <div className='w-full h-full flex flex-col justify-start items-start'>
                <div className='w-full flex pr-5 flex-row justify-end space-x-2 items-end'>
                    <h1 onClick={() => setOption(1)} className={` ${option == 1 && 'border-b-2 border-black'} font-RobotoMedium  w-20`}>View</h1>
                    <h1 onClick={() => setOption(2)} className={`${option == 2 && 'border-b-2 border-black'} font-RobotoMedium w-20`}>Edit</h1>
                </div>
                  {option == 1 ? viewUser : editUser}
            

            </div>
            </div>
          </div>
         </div>
         <div className="opacity-25 fixed inset-0 z-40 bg-black rounded-lg"></div>
    </> 
    :null}
    </>
  )
}

export default Select_User