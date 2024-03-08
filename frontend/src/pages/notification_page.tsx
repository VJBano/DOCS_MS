import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, initDocument } from "../constants/document";
import DocumentAPI from "../api/document_api";
import Caching from "../utils/caching";
import DateFormatter from "../utils/date_formatter";
import { Comment, initComment } from "../constants/comment";
import CommentAPI from "../api/comment";
import StateStore from "../utils/store";
import Peek from "../components/modals/peek";
import { PiDotFill } from "react-icons/pi";

const Notification_Page = () => {
  const { successModal, setPeek } = StateStore.ModalStore();
  const { setGlobalCategory, globalCategory, navClicked } =
    StateStore.navStore();
  const { token, id } = Caching.getCache("AppData");
  const [userDocs, setUserDocs] = useState<Document[]>([]);
  const [docs, setDocs] = useState<Document>(initDocument);
  const [docComments, setDocComments] = useState<Comment[]>([initComment]);
  const [comment, setComment] = useState("");
  const [commentRes, setCommentRes] = useState("");
  const [newNotif, setNewNotif] = useState<string[]>([]);

  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);

  type notifProps = {
    doc_id: string[];
    new_id: string[];
    is_view: boolean;
    doc_len: number;
  };

  useEffect(() => {
    DocumentAPI.getUserAllDocument(id, token).then((res) => {
      if (typeof res !== "number") {
        setUserDocs(res);

        const notification = Caching.getCache("notif");

        if (notification == null || notification.doc_id.length == 0) {
          //? - if walay notif or naay notif pero way sulod
          //? - e add sa storage ang latest data sa api

          let ids = [];
          for (const doc_ids of res) {
            ids.push(doc_ids.id);
          }

          const data: notifProps = {
            doc_id: ids,
            new_id: [""],
            is_view: false,
            doc_len: res.length,
          };

          Caching.setCache("notif", data, 86400000);
        } else {
          if (
            Array.isArray(notification.doc_id) &&
            res.length > notification.doc_len
          ) {
            //? - if naay bag ong document ge add
            //? - mas taas ang api len kaysa storage notification len

            const newIDs = [];

            for (const doc of res) {
              const foundObject = notification.doc_id.some(
                (item: any) => item === doc.id
              );

              if (!foundObject) {
                newIDs.push(doc.id);
              }
            }

            const data: notifProps = {
              doc_id: notification.doc_id,
              new_id: newIDs,
              is_view: false,
              doc_len: notification.doc_len,
            };

            Caching.setCache("notif", data, 86400000);

            setNewNotif(notification.new_id);
          } else if (res.length < notification.doc_len) {
            //? - if naay g delete sa document
            //? - mas taas ang notification kaysa api len

            const { new_id } = Caching.getCache("notif");

            let ids = [];
            for (const doc_ids of res) {
              ids.push(doc_ids.id);
            }

            const newNotifInstance: notifProps = {
              doc_id: ids,
              new_id: new_id,
              is_view: false,
              doc_len: ids.length,
            };

            Caching.setCache("notif", newNotifInstance, 86400000);
          } else {
            //? - nothing happen
            //? - no execution
          }
        }
      }
    });
  }, [navClicked]);

  useEffect(() => {
    setDocs(userDocs.length !== 0 ? userDocs[0] : initDocument);
  }, [userDocs]);

  useEffect(() => {
    if (globalCategory == "All") {
      setFilteredDocs(userDocs);
    } else {
      const categorizedDocs = userDocs.filter(
        (doc) => doc.category === globalCategory
      );

      if (categorizedDocs.length > 0) {
        setFilteredDocs(categorizedDocs);
        setDocs(userDocs.length !== 0 ? categorizedDocs[0] : initDocument);
      } else {
        setFilteredDocs([]);
      }
    }
  }, [globalCategory, userDocs]);

  useEffect(() => {
    if (docs) {
      CommentAPI.getComment(docs.id, token).then((res) => {
        if (typeof res !== "number") {
          setDocComments(res);
        }
      });
    } else {
      setDocComments([]);
    }

  }, [docs, commentRes, successModal]);

  const handleComment = async () => {
    setCommentRes("");
    if (comment !== "") {
      CommentAPI.createComment(docs.id, id, comment, token).then((res) => {
        if (typeof res !== "number") {
          setCommentRes("Successful Added");
          setComment("");
        }
      });
    }
  };

  const handleDeleteComment = async (id: string, e: SyntheticEvent) => {
    e.preventDefault();
    setCommentRes("");
    CommentAPI.deleteComment(id, token).then((res) => {
      if (typeof res !== "number") {
        setCommentRes("Successful Deleted");
      }
    });
  };

  useEffect(() => {
    const { doc_id, new_id } = Caching.getCache("notif");

    if (Array.isArray(doc_id) && new_id.includes(docs.id)) {
    
      const ids = doc_id;
      const new_ids = new_id;

      ids.push(docs.id);

      const newNotifInstance: notifProps = {
        doc_id: ids,
        new_id: new_ids.filter((id: string) => id !== docs.id),
        is_view: false,
        doc_len: ids.length,
      };

      Caching.setCache("notif", newNotifInstance, 86400000);

      setNewNotif(new_ids.filter((id: string) => id !== docs.id));
    }
  }, [docs]);

  const handleSelectDocs = useCallback(
    (doc: Document) => {
      setDocs(doc);

      
    DocumentAPI.checkDocumentStatus(id, docs.id,"RECEIVED", token).then((res) => {
     

      if (typeof res !== "number") {
        if (res == "") {

          DocumentAPI.createDocumentStatus(docs.id, id, "RECEIVED", token).then((res) => {
              if (typeof res !== "number") {
                
              }
            }
          );
        }
      }
    });
    },
    [docs]
  );

  const handleDownload = async () => {
    if (docs) {
      const filename = docs.path.substring(docs.path.lastIndexOf("/") + 1);

      console.log("file: ", filename);
      DocumentAPI.getFile(filename, token).then((res) => {
        if (res) {
          const blobUrl = URL.createObjectURL(res);

          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = docs.doc_name;

          link.click();

          URL.revokeObjectURL(blobUrl);

          document.body.removeChild(link);
        }
      });
    }
  };

  const handleView = async () => {

    DocumentAPI.checkDocumentStatus(id, docs.id,"SEEN", token).then((res) => {
     

      if (typeof res !== "number") {
        if (res == "") {

          DocumentAPI.createDocumentStatus(docs.id, id, "SEEN", token).then((res) => {
              if (typeof res !== "number") {
                
              }
            }
          );
        }
      }
    });

    setPeek({ id: docs.id, isSelected: true });
  };

  return (
    <div className=" flex flex-row w-full h-full">
      <div className="flex flex-col w-1/4 border border-r-slate-400">
        <div className="flex w-full p-3 justify-between bg-[#222222] rounded-tl-md">
          <div className="w-auto flex justify-start items-center   gap-1">
            <h1 className="font-RobotoMedium text-1xl text-white">Documents</h1>
            <PiDotFill className="text-white" />
            <h1 className="font-RobotoMedium text-lg text-white">
              {filteredDocs.length}
            </h1>
          </div>

          <div>
            <div className="relative inline-flex items-center p-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
              <span className="sr-only">Unread</span>
              <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                {newNotif.length == 0 ? 0 : newNotif.length}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full justify-start bg-[#A8DF8E] items-start flex-row flex gap-1 px-2 py-2 ">
          <h1 className="font-RobotoMedium text-base">
            Document Category: &nbsp;
          </h1>
          <select
            onChange={(e) => setGlobalCategory(e.target.value)}
            value={globalCategory}
            className="w-1/2 max-h-full font-RobotoRegular bg-white text-base outline-none"
          >
            <option value="All">All</option>
            <option value="Memorandum">Memorandum</option>
            <option value="Minute">Minute</option>
            <option value="Communication">Communication Letter</option>
            <option value="Forms">Forms</option>
            <option value="Travel">Travel Order</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="w-full justify-start bg-white items-start flex-col h-full flex gap-1 pt-2 overflow-auto">
          {filteredDocs.length !== 0 ? (
            filteredDocs.map((doc, index) => {
              return (
                <div
                  key={index}
                  className={`flex w-full pl-3 py-1  ${
                    doc.id == docs?.id && "bg-[#00C897]"
                  }`}
                  onClick={() => handleSelectDocs(doc)}
                >
                  <h1
                    className={`${
                      newNotif.includes(doc.id)
                        ? "font-RobotoMedium"
                        : "font-RobotoRegular"
                    }   text-base`}
                  >
                    {doc.doc_name}
                  </h1>
                </div>
              );
            })
          ) : (
            <div className="flex w-full pl-3 py-1">
              <h1 className="w-full flex justify-center items-center h-full font-RobotoMedium text-base">
                No {globalCategory} Docs Found
              </h1>
            </div>
          )}
        </div>
      </div>

      {filteredDocs.length !== 0 ? (
        <div className="flex w-5/6 flex-col  rounded-tr-md">
          <Peek />
          <div className="w-full flex justify-between p-3 border border-b-slate-400 ">
            <h1 className="font-RobotoMedium text-xl">{docs.doc_name}</h1>
            <h1 className="font-RobotoRegular text-base">
              {DateFormatter.date_Formatter(docs.created_at)}
            </h1>
          </div>

          <div className="w-full flex justify-start px-5  h-48 bg-white">
            <textarea
              className="font-RobotoRegular text-base w-full p-3"
              disabled
              cols={10}
              value={docs.doc_description}
            ></textarea>
          </div>
          <div className="bg-white w-full flex justify-between px-5 py-4 ">
            <h1 className="font-RobotoRegular text-base">
              <strong>From</strong>&nbsp;:{docs.created_by}
            </h1>

            <div>
              <button
                onClick={() => handleView()}
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-RobotoMedium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                View
              </button>

              <button
                onClick={() => handleDownload()}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-RobotoMedium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Download File
              </button>
            </div>
          </div>

          <div className="flex w-full justify-start flex-col items-start">
            <div className="w-full flex p-3">
              <h1 className="font-RobotoMedium text-xl">Comments</h1>
            </div>

            <div className="flex flex-col w-full h-80 bg-white overflow-y-auto">
              {docComments.length !== 0 || docComments! == undefined ? (
                docComments.map((comment) => {
                  return (
                    <div
                      key={comment.id}
                      className="flex flex-col w-full p-3 justify-start items-start hover:bg-slate-300 border border-b-gray-300"
                    >
                      <div className="flex justify-between items-center">
                        <h1 className="font-RobotoMedium text-lg">
                          {comment.user_name}
                        </h1>
                        <h1 className="ml-10 font-RobotoRegular text-sm">
                          {DateFormatter.date_Formatter(comment.created_at)}
                        </h1>
                      </div>
                      <div className="pl-4 flex">
                        <h1 className="font-RobotoRegular text-base">
                          {comment.comment}
                        </h1>
                        {id == comment.user_id ? (
                          <button
                            onClick={(e) => handleDeleteComment(comment.id, e)}
                            className="ml-5 cursor-pointer font-RobotoRegular text-sm text-red-600 underline"
                          >
                            delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <h1 className="flex justify-center items-center w-full h-full font-RobotoMedium text-base">
                  No Comments Found
                </h1>
              )}
            </div>
            <div className="w-full flex justify-start items-start px-2 py-2 ">
              <div className="relative w-full ">
                <input
                  type="text"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  className="block w-full p-4 pl-5 text-base font-RobotoRegular border border-gray-500 outline-none rounded-lg bg-gray-50 placeholder-gray-400 text-black "
                  placeholder="Comment"
                  required
                />
                <button
                  onClick={() => handleComment()}
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800  outline-none focus:ring-blue-300 font-RobotoMedium rounded-lg text-base px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 "
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-5/6 flex-col  rounded-tr-md">
          <h1 className="flex justify-center items-center w-full h-full font-RobotoMedium text-base">
            No {globalCategory} Docs Found
          </h1>
        </div>
      )}
    </div>
  );
};

export default Notification_Page;
