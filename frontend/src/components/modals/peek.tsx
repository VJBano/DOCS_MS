import React, { useEffect, useMemo, useState } from 'react'
import StateStore from '../../utils/store'
import { RiCloseCircleFill } from 'react-icons/ri'
import DocumentAPI from '../../api/document_api';
import Caching from '../../utils/caching';
import { Document, initDocument } from '../../constants/document';
import { DocxBlob } from '../../utils/docs_blob';

const Peek = () => {

    const {peek, setPeek} = StateStore.ModalStore();
    const {token, id} = Caching.getCache("AppData");
    const [document, setDocument] = useState<Document[]>([initDocument]);
    const [fileBlob, setFileBlob] = useState<ArrayBuffer | null>(null);
    const initialPdfBlob = new Blob(["", ""], { type: 'application/pdf' });
    const [pdf, setPdf]  = useState<Blob>(initialPdfBlob);
    const [file, setFile] = useState("");
    const [refresh, setRefresh] = useState(1);

    useEffect(() => {

     
        setPdf(initialPdfBlob);
        DocumentAPI.getDocument(peek.id,token).then((res) => {
            if(typeof(res) !== "number") {
                setDocument(res);
            }
        });

        const filename = document[0].path.substring(document[0].path.lastIndexOf('/') + 1);

        if(document[0].doc_type == "docx"){
            DocumentAPI.getFile(filename, token).then((res) => {
                setFileBlob(res);
            });
        
          } else if(document[0].doc_type == "pdf") {

            DocumentAPI.getFile(filename, token).then((res) => {
                if(typeof(res) !== "number") {
                  setPdf(res);
                }
                  
              });

          }

    },[peek, refresh]);

    useEffect(() => {

        if(document[0].doc_type == "docx"){
        DocxBlob(fileBlob).then((res) => {
            setFile(res as string)
        });
    }
    },[fileBlob]);
  return (
    <>
    {peek.isSelected? 
    <>
         <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className=" relative flex w-full h-5/6  my-6  max-w-6xl ">
            <div className={`rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none transition duration-700 ease-in-out`}>
            
            <div className="flex items-start justify-between p-2 border-b border-solid border-slate-300 rounded-t">
              <div className='flex w-1/3'>
              </div>

              <div className='flex w-full justify-center'>
                <h1 className={` font-RobotoBold text-xl align-text-top`}></h1>
              </div>
              
              <div className='flex w-1/3 justify-end'> 
                <RiCloseCircleFill onClick={()=>setPeek({id:"", isSelected:false})} className='h-8 w-8 text-slate-500 hover:text-red-700 transition duration-300 ease-in-out'/>
              </div>
              
            </div>

            <div className='w-full h-full flex flex-col justify-start items-start'>
            <div className='w-full flex pr-5 flex-row justify-end space-x-2 items-end'>
                    <button onClick={() => setRefresh(refresh == 3 ? 0 : refresh+1)} className={`bg-blue-500 text-white rounded-md p-1 border-black font-RobotoMedium  w-20`}>Refresh</button>
                </div>


                <div className="w-full h-full flex ">

                {document[0].doc_type === 'docx' ? (
                <div className="w-full h-[89%] bg-gray-200 p-2 border border-gray-300 rounded overflow-auto"
                dangerouslySetInnerHTML={{ __html: file }} ></div>
                
                    ) : 
                    pdf?
                    <embed
                    src={URL.createObjectURL(pdf)}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    /> : <h1>Loading...</h1>
                    
                    }
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

export default Peek
