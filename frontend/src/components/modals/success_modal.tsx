import React, { useEffect } from 'react'
import StateStore from '../../utils/store'

type SuccessProps = {
    title:string,
}
const Success_Modal = ({title}:SuccessProps) => {

    const { setSuccessModal, successModal,setAddUserModal, setAddDocumentModal, setSelectUserModal, setSelectDocumentModal} = StateStore.ModalStore();
   
    const handleExit = async () => {
    
        setAddDocumentModal(false);
        setAddUserModal(false)
        setSelectUserModal({id:"", isSelected:false});
        setSelectDocumentModal({id:"", isSelected:false})

        setSuccessModal(false);
    }

  return (
    <>
      {successModal? 
      <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className=" relative flex w-96 h-72  my-6 ">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none transition duration-700 ease-in-out">
             <div className="flex items-start justify-between p-2 border-b border-solid border-slate-300 rounded-t">
               <h1 className='font-RobotoBold text-lg'>Success</h1>
               {/* <RiCloseCircleFill onClick={()=> setConfirmDeleteModal(false)} className='h-8 w-8 text-red-700'/> */}
             </div>
             <div className='w-full h-full  items-center flex flex-col mt-10'>
                     <div className=' flex flex-row'>
                         <h1 className='font-RobotoRegular text-lg'>{`Successfully ${title}.`}</h1>
                     </div>
                     <div className=' flex flex-row mt-10 gap-3'>
                     <button type="button" onClick={() =>handleExit() } className="font-RobotoRegular text-base text-white bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800  rounded-lg  px-5 py-2.5 text-center mr-2 mb-2">
                         Exit
                         </button>
                         
                     </div>
             </div>
           </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black rounded-lg"></div>
      </>
      : null}
    </>
  )
}

export default Success_Modal
