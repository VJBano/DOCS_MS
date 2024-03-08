import React, { useEffect, useState } from 'react'
import { FiPlusSquare } from 'react-icons/fi';
import { IoMdOptions } from 'react-icons/io';
import DocumentAPI from '../api/document_api';
import Select_Document from '../components/modals/select_document';
import { Document, initDocument } from '../constants/document';
import Caching from '../utils/caching';
import StateStore from '../utils/store';

const Archived_Page = () => {
    const initData = {
        current_page:0,
        total_page:0,
        total_data:0,
        data_count:0,
        data: [initDocument]
    
    }
    
      const { token } = Caching.getCache("AppData");
      const [document, setDocument] = useState(initData);
      const [page, setPage] = useState(1);
      const [year, setYear] = useState([{archived_year:""}]);
      const [selectYear, setSelectYear] = useState("");
    
      const { addDocumentModal,successModal, setSelectDocumentModal} = StateStore.ModalStore();
      const {navClicked} = StateStore.navStore();
      const { globalCategory  } = StateStore.navStore();

      useEffect(() => {

        DocumentAPI.getArchivedYear(token).then((res) => {

          if(typeof(res) !== "number"){

            setYear(res)
            setSelectYear(res[0].archived_year);
          } else {
            setYear([]);
          }
        });

      },[navClicked, selectYear]);

      useEffect(() => {
    
        
      
        DocumentAPI.getArchivedDocument(selectYear,page,token).then((res) => {
            
            if(typeof(res) !== "number"){
              setDocument(res);
            } else {
              setDocument({
                current_page:0,
                total_page:0,
                total_data:0,
                data_count:0,
                data: []
              })
            }
        });

        

      },[page, addDocumentModal, successModal, globalCategory,selectYear]);
    
      return (
        <div className=" w-full h-full">
          <Select_Document/>
          <div className="bg-gray-200 h-10 justify-between flex flex-row sticky rounded-lg">
            <div className=" w-full flex justify-start items-center mx-2 ">
              <div className="lg:flex hidden space-x-2 items-center justify-start ml-2 gap-3 ">
                
              </div>
    
              <div className="flex flex-row justify-center items-center w-2/3 ">
          
          <h1 className='font-RobotoMedium text-base'>Archived Year: &nbsp;</h1>
           <select onChange={(e) => setSelectYear(e.target.value)} value={selectYear} className="w-1/2 max-h-full font-RobotoRegular text-base outline-none">
            {year.length != 0 ?

                year.map((list) => {
                  
                  return (
                    <option key={list.archived_year} value={list.archived_year}>{list.archived_year}</option>
                  )
                })
           :

            <option value="">No Archived</option>
            
          }
           
            </select>
         
          </div>
    
              <div className="flex flex-row justify-center items-center w-1/2 ">
                
              </div>

            </div>
    
            <div className="w-1/2 flex justify-end items-center mx-4 space-x-3">
           
                
            </div>
          </div>
    
          <div className=" w-full px-2 py-2 border border-b-black" style={{ height:550}}>
             <table className="  table-fixed w-full sm:overflow-auto border-collapse border-transparent">
             <thead className="border-b bg-[#1A5D1A] ">
                  <tr>
    
                  <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                      <div className="flex items-center justify-center ">
                        Document Name
                      </div>
                    </th>
    
                    <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                      <div className="flex items-center justify-center gap-2 ">
                        Document Description
                      </div>
                    </th>
                  
                    <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                      <div className="flex items-center justify-center">
                        Document Type
                      </div>
                    </th>
                    <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                      <div className="flex items-center justify-center">
                        Category
                      </div>
                    </th>
                    <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                      <div className="flex items-center justify-center">
                        Access Code
                      </div>
                    </th>
    
                    <th className="p-2 cursor-pointer  text-white font-RobotoMedium text-base">
                      <div className="flex items-center justify-center">Action</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="my-9">
    
                {document.data.length != 0 ?
                
                document.data.map((list:Document) => {
    
                    return (
                        <tr key={list.id} className="odd:bg-gray-200 bg-gray-100  border-b  text-base text-gray-600 font-RobotoRegular transition duration-200 hover:bg-green-300">
                            <td className=" text-base font-medium text-gray-800 border-none py-3 border-r font-RobotoRegular">
                                {list.doc_name}
                            </td>
                            <td className=" text-base font-medium text-gray-800 border-none py-3 border-r border-collapse font-RobotoRegular">
                                {list.doc_description}
                            </td>
                            <td className=" text-base font-medium text-gray-800 border-none py-3 border-r font-RobotoRegular">
                                {list.doc_type}
                            </td>
                            <td className=" text-base font-medium text-gray-800 border-none py-3 border-r font-RobotoRegular">
                                {list.category}
                            </td>
                            <td className=" text-base font-medium text-gray-800 border-none py-3 border-r font-RobotoRegular">
                                {list.doc_access_id}
                            </td>
                            <td onClick={() => setSelectDocumentModal({id:list.id, isSelected:true})} className="text-base border-none  font-medium text-right items-end justify-center flex py-3 border-r">
                        <IoMdOptions className='h-6 w-6 transition duration-300 hover:text-red-700 '/>
                        </td>
                        </tr>
                    )
                    }): 
                   null
                    }
                
                </tbody>
             </table>
             {document.data.length == 0 ?
                 <div className='w-full h-full flex justify-center items-center font-RobotoBlack text-lg'>
                 {`No ${globalCategory == "Archived"? globalCategory : "Archived"} Document Found`}
                </div> : null
            }
             </div>
    
             <div className=' flex w-full justify-between p-5 gap-3 flex-row items-center'>
                <div className='flex flex-row justify-between gap-3'>
                    <div className='flex flex-row'>   
                        <h1 className='font-RobotoMedium text-base'>Document:&nbsp;</h1>
                        <h1 className='font-RobotoRegular text-base'>{document.data_count}&nbsp;of&nbsp;{document.total_data}</h1>
                    </div>
                    
                    <div className='flex flex-row'>   
                        <h1 className='font-RobotoMedium text-base'> Page:&nbsp;</h1>
                        <h1 className='font-RobotoRegular text-base'>{document.current_page}&nbsp;of&nbsp;{document.total_page}</h1>
                    </div>
    
                   
                </div>
              
    
                <div className='flex w-1/2 justify-end gap-3'>
                 <button onClick={() => setPage(page-1)} disabled={page <= 1 && true} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded font-RobotoBlack">
                    Previous
                    </button>
                    <button onClick={() => setPage(page+1)} disabled={page >= document.total_page && true } className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded font-RobotoBlack`}>
                    Next
                </button>
    
                </div>
             </div>
    
        </div>
      );
}

export default Archived_Page