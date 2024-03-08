import React, { SyntheticEvent, useEffect, useState } from 'react'
import { initComment, Comment } from '../constants/comment';
import DateFormatter from '../utils/date_formatter';
import DocumentAPI from '../api/document_api';
import StateStore from '../utils/store';
import Caching from '../utils/caching';
import { initDocument, Document } from '../constants/document';
import CommentAPI from '../api/comment';

const Comments = () => {

  const [docComments, setDocComments] = useState<Comment[]>([initComment]);
  const { token, id } = Caching.getCache("AppData");
  const {selectDocumentModal} = StateStore.ModalStore();
  const [userDocs, setUserDocs] = useState<Document[]>([]);
  const [comment, setComment] = useState("");
  const [docs, setDocs] = useState<Document>(initDocument);
  const [commentRes, setCommentRes] = useState("")

  useEffect(() => {
    DocumentAPI.getUserAllDocument(selectDocumentModal.id, token).then((res) => {
      if(typeof(res) !== "number") {
        setUserDocs(res);
        setDocs(userDocs.length !== 0? res[0] : "");
      }
    });
  },[docs]);

  useEffect(() => {

    CommentAPI.getComment(selectDocumentModal.id, token).then((res) => {
        if(typeof(res) !== "number") {
          setDocComments(res);
        }
    });

  },[docs, commentRes]);
  
  const handleDeleteComment = async (id:string, e:SyntheticEvent) => {
    e.preventDefault();
    setCommentRes("");
      CommentAPI.deleteComment(id, token).then((res) => {
          if(typeof(res) !== "number") {
            setCommentRes("Successful Deleted");
          }
      });
  }

  const handleComment = async () => {
    setCommentRes("");
    if(comment !== "") {
      CommentAPI.createComment(selectDocumentModal.id, id,comment, token).then((res) => {
          if(typeof(res) !== "number") {
            setCommentRes("Successful Added");
            setComment("");
          }
      });
    }
  }

  return (
    <>
     <div className='w-full flex-col flex pl-5 justify-start items-start'>
     <div className='flex w-full h-full justify-start flex-col items-start'>
       
        
        <div className='flex flex-col w-full h-96 bg-white overflow-y-auto'>

          {docComments.length !== 0? 
          
            docComments.map((comment) => {
              return (
                <div key={comment.id} className='flex flex-col w-full p-3 justify-start items-start hover:bg-slate-300 border border-b-gray-300'>
                  <div className='flex justify-between items-center'>
                  <h1 className='font-RobotoMedium text-lg'>{comment.user_name}</h1>
                  <h1 className='ml-10 font-RobotoRegular text-sm'>{DateFormatter.date_Formatter(comment.created_at)}</h1>
                  </div>
                  <div className='pl-4 flex'>
                    <h1 className='font-RobotoRegular text-base'>{comment.comment}</h1>
                    {id == comment.user_id ? <button onClick={(e) =>handleDeleteComment(comment.id, e)} 
                     className='ml-5 cursor-pointer font-RobotoRegular text-sm text-red-600 underline' >delete</button>: null}
                    
                  </div>
              </div>
              )
            })
          : <h1 className='flex justify-center items-center w-full h-full font-RobotoMedium text-base'>No Comments Found</h1> }
            


        </div>
      <div className="w-full flex justify-start items-start px-2 py-2 ">
              <div className="relative w-full ">
                  
                  <input type="text" onChange={(e) => setComment(e.target.value)} value={comment} className="block w-full p-4 pl-5 text-base font-RobotoRegular border border-gray-500 outline-none rounded-lg bg-gray-50 placeholder-gray-400 text-black " placeholder="Comment" required/>
                  <button onClick={() => handleComment()} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800  outline-none focus:ring-blue-300 font-RobotoMedium rounded-lg text-base px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 ">
                    Send
                    </button>
              </div>
          </div>
      </div>
  </div>
     
    </>
  )
}

export default Comments