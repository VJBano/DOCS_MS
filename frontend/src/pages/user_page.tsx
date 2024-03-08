import React, { useEffect, useState } from 'react'
import { FiPlusSquare } from 'react-icons/fi'
import { User, initUser } from '../constants/user';
import Caching from '../utils/caching';
import UserAPI from '../api/user_api';
import { IoMdOptions } from 'react-icons/io';
import StateStore from '../utils/store';
import Add_User from '../components/modals/add_user';
import Select_User from '../components/modals/select_user';

const User_Page = () => {
  const initData = {
    current_page:0,
    total_page:0,
    total_data:0,
    data_count:0,
    data: [initUser]

};

  const {setAddUserModal, addUserModal, successModal, setSelectUserModal} = StateStore.ModalStore(); 
  const { token } = Caching.getCache("AppData");
  const [user, setUser] = useState(initData);
  const [page, setPage] = useState(1);

  useEffect(() => {

    UserAPI.getUserPagination(page,token).then((res) => {
      if(typeof(res) !== "number"){
        setUser(res);
      } else {
        setUser({current_page:0,
          total_page:0,
          total_data:0,
          data_count:0,
          data: []});
      }
        
    });

  },[page,addUserModal,successModal]);
  return (
    <div className=" w-full h-full">
     <Add_User/>
     <Select_User/>
    <div className="bg-gray-200 h-10 justify-between flex flex-row sticky rounded-lg">
      <div className=" w-full flex justify-start items-center mx-2 ">
        <div className="lg:flex hidden space-x-2 items-center justify-start ml-2 gap-3 ">
          
        </div>

        <div className="flex flex-row justify-center items-center w-2/3 ">
          
        </div>

        <div className="flex flex-row justify-center items-center w-1/2 ">
          
        </div>
      </div>

      <div className="w-1/2 flex justify-end items-center mx-4 space-x-3">
     
           <div onClick={() => setAddUserModal(true)}  className='flex flex-row gap-1 items-center mt-2 rounded-md 0 h-8 p-2'>
           <FiPlusSquare  className='h-7 w-7 transition duration-300 '/>
          </div>
      </div>
    </div>

    <div className=" w-full px-2 py-2 border border-b-black" style={{ height:550}}>
       <table className="  table-fixed w-full sm:overflow-auto border-collapse border-transparent">
       <thead className="border-b bg-[#1A5D1A] ">
            <tr>

            <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                <div className="flex items-center justify-center ">
                  FirstName
                </div>
              </th>

              <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                <div className="flex items-center justify-center gap-2 ">
                  Lastname
                </div>
              </th>

              <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                <div className="flex items-center justify-center gap-2 ">
                  Username
                </div>
              </th>
            
              <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                <div className="flex items-center justify-center">
                  Role
                </div>
              </th>
              <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                <div className="flex items-center justify-center">Action</div>
              </th>
            </tr>
          </thead>
          <tbody className="my-9">

          {user.data.length != 0 ?
          
          user.data.map((list:User) => {

              return (
                  <tr key={list.id} className="odd:bg-gray-200 bg-gray-100  border-b  text-base text-gray-600 font-RobotoRegular transition duration-200 hover:bg-green-300">
                      <td className=" text-base font-medium text-gray-800 border-none py-3 border-r font-RobotoRegular">
                          {list.firstname}
                      </td>
                      <td className=" text-base font-medium text-gray-800 border-none py-3 border-r border-collapse font-RobotoRegular">
                          {list.lastname}
                      </td>
                      <td className=" text-base font-medium text-gray-800 border-none py-3 border-r border-collapse font-RobotoRegular">
                          {list.email}
                      </td>
                      <td className=" text-base font-medium text-gray-800 border-none py-3 border-r font-RobotoRegular">
                          {list.role}
                      </td>
                      <td onClick={() => setSelectUserModal({id:list.id, isSelected:true})} className="text-base border-none  font-medium text-right items-end justify-center flex py-3 border-r">
                  <IoMdOptions  className='h-6 w-6 transition duration-300 hover:text-red-700 '/>
                  </td>
                  </tr>
              )
              }): 
             null
              }
          
          </tbody>
       </table>
       </div>

       <div className=' flex w-full justify-between p-5 gap-3 flex-row items-center'>
          <div className='flex flex-row justify-between gap-3'>
              <div className='flex flex-row'>   
                  <h1 className='font-RobotoMedium text-base'>User:&nbsp;</h1>
                  <h1 className='font-RobotoRegular text-base'>{user.data_count}&nbsp;of&nbsp;{user.total_data}</h1>
              </div>
              
              <div className='flex flex-row'>   
                  <h1 className='font-RobotoMedium text-base'> Page:&nbsp;</h1>
                  <h1 className='font-RobotoRegular text-base'>{user.current_page}&nbsp;of&nbsp;{user.total_page}</h1>
              </div>

             
          </div>
        

          <div className='flex w-1/2 justify-end gap-3'>
           <button onClick={() => setPage(page-1)} disabled={page <= 1 && true} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded font-RobotoBlack">
              Previous
              </button>
              <button onClick={() => setPage(page+1)} disabled={page >= user.total_page && true } className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded font-RobotoBlack`}>
              Next
          </button>

          </div>
       </div>

  </div>
  )
}

export default User_Page