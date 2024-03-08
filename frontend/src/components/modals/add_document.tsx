import React, { useEffect, useState } from 'react'
import StateStore from '../../utils/store'
import { RiCloseCircleFill } from "react-icons/ri";
import { User, initUser } from '../../constants/user';
import UserAPI from '../../api/user_api';
import Caching from '../../utils/caching';
import Success_Modal from './success_modal';
import DocumentAPI from '../../api/document_api';
import { all } from 'axios';

const Add_Document = () => {

    const {addDocumentModal, setAddDocumentModal, setSuccessModal, successModal} = StateStore.ModalStore();
    const {globalCategory} = StateStore.navStore()
    const {token} = Caching.getCache("AppData");
    const [user, setUser] = useState<User[]>([initUser]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [description, setDescription] = useState("");
    const [isFill, setIsFill] = useState(false);
    const [category, setCategory] = useState("Archived")

    useEffect(() => {

      UserAPI.getAllUser(token).then((res) => {
          if(typeof(res) != "number") {
            setUser(res);
          }
      });
    },[addDocumentModal, successModal]);

    useEffect(() =>{

      setDescription("");
      setSelectedUserIds([]);
      setSelectAll(false);
      setUser([]);
      setIsFill(false);
    },[addDocumentModal, successModal]);


    const handleUserCheckboxChange = (userId:string) => {

      if (selectAll) {
        return;
      }

      if (selectedUserIds.includes(userId)) {
  
        setSelectedUserIds(selectedUserIds.filter((selectedUserId) => selectedUserId !== userId));
      } else {
       
        setSelectedUserIds([...selectedUserIds, userId]);
      }
    };


    const handleSelectAllChange = () => {

      
      if (selectAll) {
        setSelectedUserIds([]);
      } else {

        const allUserIds = user.map((user) => user.id);


        setSelectedUserIds(["ALL-USER"]);
      }
      setSelectAll(!selectAll);
    };

    const handleSave = async () => {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  
      if (!fileInput) {
        alert('File input not found');
        setIsFill(false);
        return;
      }
  
      const file = fileInput.files?.[0];
  
      if (!file) {
        alert('Please select a file');
        setIsFill(false);
        return;
      }
  
      DocumentAPI.createDocument(file,globalCategory, description,JSON.stringify(selectedUserIds) ,token).then((res) => {
        if(res.status !== 400){
          setSuccessModal(true);
        } else {
          setSuccessModal(false);
          
        }
      });
    };

    useEffect(() => {
      if(description !== "" && selectedUserIds.length !== 0) {
          setIsFill(true);
      } else {
        setIsFill(false);
      }

    },[description, selectedUserIds]);

  return (
    <>
      {addDocumentModal? 
      <>
         <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
         <Success_Modal title={"Adding Document"}/>
          <div className=" relative flex w-full h-5/6  my-6  max-w-6xl ">
            <div className={`rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none transition duration-700 ease-in-out`}>
            
            <div className="flex items-start justify-between p-2 border-b border-solid border-slate-300 rounded-t">
              <div className='flex w-1/3'>
              <h1 className='font-RobotoMedium text-xl  self-start flex '>Add New Document</h1>
              </div>

              <div className='flex w-full justify-center'>
                <h1 className={` font-RobotoBold text-xl align-text-top`}></h1>
              </div>
              
              <div className='flex w-1/3 justify-end'> 
                <RiCloseCircleFill onClick={()=>setAddDocumentModal(false)} className='h-8 w-8 text-slate-500 hover:text-red-700 transition duration-300 ease-in-out'/>
              </div>
              
            </div>

            <div className='w-full h-full flex flex-col justify-start items-start'>
              
              <div className='w-[100%] flex-row flex justify-start items-start pt-10 pl-5  '>

              <input className="flex justify-center items-center w-1/2 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-600 focus:outline-none dark:placeholder-gray-400" id="fileInput" type="file"/>
              {/* <div className="flex w-1/2 justify-start items-start mb-3 ml-5">
            <h1 className="font-RobotoMedium text-lg">Category:&nbsp; </h1>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className="w-40 bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="Minute" defaultChecked>Minute</option>
                    <option value="Archived" >Archived</option>
                    <option value="Memorandum" >Memorandum</option>
                    <option value="Communication">Communication Letter</option>
                    <option value="Forms">Forms</option>
                    <option value="Travel">Travel Order</option>
                  
                  
                </select>
            </div> */}
              </div>
              <div className='w-[100%] flex-row pt-5 h-[50%] flex  pl-5'>
              <textarea onChange={(e) => setDescription(e.target.value)} value={description}  id="message" rows={10} className="block font-RobotoRegular p-2.5 w-[60%] text-base bg-gray-50 rounded-lg border border-black dark:placeholder-gray-400 text-black focus:outline-none"  placeholder="Write document description here...">

              </textarea>

                <div className='w-[35%] flex bg-[#379237] ml-5 flex-col ' >
                  <h1 className='font-RobotoMedium text-base text-white '>Permitted User(s)</h1>
                <ul className='w-full flex flex-col justify-start items-start bg-white border border-black' style={{ height: '300px', overflowY: 'auto' }}>
                
                <li>
                <label className='w-full ml-2 flex justify-between items-center space-y-1'>
                <input
                    className='h-5 w-5'
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                <span className='ml-1 font-RobotoMedium text-base'>
                      All User
                    </span>
                    </label>
                    </li>
              {user.map((user) => (
                <li key={user.id}>
                  <label className='w-full ml-2 flex justify-between items-center space-y-1'>

                    {selectAll ? 
                      <input
                      className='h-5 w-5'
                        type="checkbox"
                        checked={true}
                        // onChange={() => handleUserCheckboxChange(user.id)}
                      /> : 
                      <input
                    className='h-5 w-5'
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleUserCheckboxChange(user.id)}
                    />
                  }
                    
                    <span
                    className='ml-1 font-RobotoRegular text-base'
                    >
                      {user.firstname+ " "+ user.lastname}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
                </div>  
              </div>
              <div className='w-full flex-col pt-5 mt-5 flex justify-end items-end'>
              <button onClick={handleSave} disabled={isFill? false : true} type="button" className={`text-white font-RobotoMedium ${isFill ? "bg-blue-700 hover:bg-blue-800":"bg-gray-700 hover:bg-gray-800"  }  focus:ring-4 mr-10 focus:ring-blue-300  rounded-lg text-base px-5 py-2.5 mb-2 `}>
                Send
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

export default Add_Document
