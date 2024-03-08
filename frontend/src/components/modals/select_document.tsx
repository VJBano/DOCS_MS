import React, { SyntheticEvent, useEffect, useState } from "react";
import StateStore from "../../utils/store";
import { RiCloseCircleFill } from "react-icons/ri";
import DocumentAPI from "../../api/document_api";
import Caching from "../../utils/caching";
import { Document, initDocument } from "../../constants/document";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { DocxBlob } from "../../utils/docs_blob";
import { Document as Doc, Page } from "react-pdf";
import PDFViewer from "../pdf_viewer";
import DateFormatter from "../../utils/date_formatter";
import Success_Modal from "./success_modal";
import Comment from "../comment";
import Comments from "../comment";
import UserAPI from "../../api/user_api";
import { User } from "../../constants/user";

const Select_Document = () => {
  const { selectDocumentModal, setSelectDocumentModal, setSuccessModal } =
    StateStore.ModalStore();
  const { token } = Caching.getCache("AppData");

  const initialPdfBlob = new Blob(["", ""], { type: "application/pdf" });

  const [document, setDocument] = useState<Document[]>([initDocument]);
  const [fileBlob, setFileBlob] = useState<ArrayBuffer | null>(null);
  const [file, setFile] = useState("");
  const [pdf, setPdf] = useState<Blob>(initialPdfBlob);
  const [refresh, setRefresh] = useState(1);
  const [option, setOption] = useState(1);
  const [editDocForm, setEditDocForm] = useState({
    doc_name: "",
    description: "",
    category: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [seen, setSeen] = useState({ status: "", user: [""] });
  const [received, setReceived] = useState({ status: "", user: [""] });
  const [freeUser, setFreeUser] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    setOption(1);
    setPdf(initialPdfBlob);
    DocumentAPI.getDocument(selectDocumentModal.id, token).then((res) => {
      if (typeof res !== "number") {
        setDocument(res);
      }
    });

    const filename = document[0].path.substring(
      document[0].path.lastIndexOf("/") + 1
    );

    if (document[0].doc_type == "docx") {
      DocumentAPI.getFile(filename, token).then((res) => {
        setFileBlob(res);
        // console.log("blob: ", res);
      });
    }
    DocumentAPI.getFile(filename, token).then((res) => {
      if (typeof res !== "number") {
        setPdf(res);
      }
    });

    DocumentAPI.getDocumentStatus(selectDocumentModal.id, "SEEN", token).then(
      (res) => {
        if (typeof res !== "number") {
          setSeen(res);
        }
      }
    );

    DocumentAPI.getDocumentStatus(
      selectDocumentModal.id,
      "RECEIVED",
      token
    ).then((res) => {
      if (typeof res !== "number") {
        setReceived(res);
      }
    });
  }, [selectDocumentModal, refresh]);

  useEffect(() => {
    setEditDocForm({
      doc_name: document[0].doc_name,
      description: document[0].doc_description,
      category: document[0].category,
    });

    UserAPI.freeUser(document[0].doc_access_id, token).then((res) => {
      if (typeof res !== "number") {
        setFreeUser(res);
      }
    });
  }, [option]);

  useEffect(() => {
    if (document[0].doc_type == "docx") {
      DocxBlob(fileBlob).then((res) => {
        setFile(res as string);
      });
    }
  }, [fileBlob]);

  useEffect(() => {
    if (editDocForm.doc_name == "" || editDocForm.description == "") {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [editDocForm]);

  const handleDelete = async (e: SyntheticEvent) => {
    e.preventDefault();
    DocumentAPI.deleteDocument(document[0].id, token).then((res) => {
      if (typeof res !== "number") {
        setSuccessModal(true);
      } else {
        setSuccessModal(false);
      }
    });
  };

  const handleUpdateCategory = async (e: SyntheticEvent) => {
    e.preventDefault();

    DocumentAPI.updateCategory("Archived", document[0].id, token).then(
      (res) => {
        if (typeof res !== "number") {
          setSuccessModal(true);
        } else {
          setSuccessModal(false);
        }
      }
    );
  };

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (isValid) {
      DocumentAPI.updateDocument(
        editDocForm.doc_name,
        editDocForm.category,
        editDocForm.description,
        document[0].id,
        token
      ).then((res) => {
        if (typeof res !== "number") {
          setSuccessModal(true);
        }
      });
    }
  };

  const handleAddRecipient = async (e: SyntheticEvent) => {
    e.preventDefault();

    DocumentAPI.addDocsUser(
      JSON.stringify(selectedUserIds),
      document[0].doc_access_id,
      token
    ).then((res) => {
      if (typeof res !== "number") {
        setSuccessModal(true);
      }
    });
  };

  const editDocument = (
    <>
      <div className="w-full flex-col flex pl-5 justify-start items-start">
        <div className="w-full flex justify-start items-center">
          <h1 className="font-RobotoMedium text-lg">Document Name:&nbsp;</h1>
          <input
            type="text"
            value={editDocForm.doc_name}
            onChange={(e) =>
              setEditDocForm({ ...editDocForm, doc_name: e.target.value })
            }
            id=""
            className="w-1/4 bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="flex w-1/2 justify-start items-start my-3 ">
          <h1 className="font-RobotoMedium text-lg">Category:&nbsp; </h1>
          <select
            onChange={(e) =>
              setEditDocForm({ ...editDocForm, category: e.target.value })
            }
            value={editDocForm.category}
            className="w-40 bg-gray-50 border border-gray-300 text-black font-RobotoRegular text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="Minute" defaultChecked>
              Minute
            </option>
            <option value="Memorandum">Memorandum</option>
            <option value="Archived">Archived</option>
            <option value="Communication">Communication Letter</option>
            <option value="Forms">Forms</option>
            <option value="Travel">Travel Order</option>
          </select>
        </div>

        <h1 className="font-RobotoMedium text-lg">Description</h1>
        <textarea
          onChange={(e) =>
            setEditDocForm({ ...editDocForm, description: e.target.value })
          }
          value={editDocForm.description}
          id="description"
          rows={10}
          className="block font-RobotoRegular p-2.5 w-[60%] text-base bg-gray-50 rounded-lg border border-black dark:placeholder-gray-400 text-black focus:outline-none"
          placeholder="Write document description here..."
        ></textarea>

        <div className="w-full mt-20 flex justify-end pr-10 ">
          <button
            onClick={() =>
              setEditDocForm({ doc_name: "", description: "", category: "" })
            }
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
            Update
          </button>
        </div>
      </div>
    </>
  );

  const viewDocument = (
    <div className="w-full h-full flex flex-row justify-start items-start ">
      <div className="w-1/2 h-full flex ">
        {document[0].doc_type === "docx" ? (
          <div
            className="w-full h-[89%] bg-gray-200 p-2 border border-gray-300 rounded overflow-auto"
            dangerouslySetInnerHTML={{ __html: file }}
          ></div>
        ) : pdf ? (
          <embed
            src={URL.createObjectURL(pdf)}
            type="application/pdf"
            width="100%"
            height="99%"
          />
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <div className="w-1/2  flex flex-col ">
        <div className="w-full flex justify-end items-end pr-2">
          <button
            onClick={() => setRefresh(refresh == 3 ? 0 : refresh + 1)}
            type="button"
            className="text-white mt-2 bg-blue-700 hover:bg-blue-800  font-RobotoRegular rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-col w-full gap-3 pl-3">
          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">
              Document Name:&nbsp;
            </h1>
            <h1 className="font-RobotoRegular text-base">
              {document[0].doc_name}
            </h1>
          </div>

          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">
              Document Type:&nbsp;
            </h1>
            <h1 className="font-RobotoRegular text-base">
              {document[0].doc_type}
            </h1>
          </div>

          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">Description:&nbsp;</h1>
            <h1 className="font-RobotoRegular text-base">
              {document[0].doc_description}
            </h1>
          </div>
          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">Category:&nbsp;</h1>
            <h1 className="font-RobotoRegular text-base">
              {document[0].category}
            </h1>
          </div>

          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">Created At:&nbsp;</h1>
            <h1 className="font-RobotoRegular text-base">
              {DateFormatter.date_Formatter(document[0].created_at)}
            </h1>
          </div>

          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">Created By:&nbsp;</h1>
            <h1 className="font-RobotoRegular text-base">
              {document[0].created_by}
            </h1>
          </div>

          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">Seen By:&nbsp;</h1>
            <h1 className="font-RobotoRegular text-base italic flex-wrap">
              {seen.user.map((user) => (
                <span key={user} className="mr-1">
                  {user},
                </span>
              ))}
            </h1>
          </div>

          <div className="flex flex-row ">
            <h1 className="font-RobotoMedium text-base">Received By:&nbsp;</h1>
            <h1 className="font-RobotoRegular text-base italic flex-wrap">
              {received.user.map((user) => (
                <span key={user} className="mr-1">
                  {user},
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="w-full mt-40 flex justify-end pr-10 ">
          {document[0].category !== "Archived" ? (
            <button
              onClick={(e) => handleUpdateCategory(e)}
              className={`
                      hover:bg-orange-800 focus:ring-orange-300 dark:hover:bg-orange-700 dark:focus:ring-orange-800 focus:ring-4
                    bg-orange-500
                  font-RobotoMedium focus:outline-none text-white rounded-md text-base px-5 py-2.5 mr-2 mb-2  `}
            >
              Archived
            </button>
          ) : (
            <button
              onClick={(e) => handleDelete(e)}
              className={`
                        hover:bg-red-800 focus:ring-red-300 dark:hover:bg-red-700 dark:focus:ring-red-800 focus:ring-4
                      bg-red-500
                    font-RobotoMedium focus:outline-none text-white rounded-md text-base px-5 py-2.5 mr-2 mb-2  `}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const handleUserCheckboxChange = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(
        selectedUserIds.filter((selectedUserId) => selectedUserId !== userId)
      );
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const addRecipient = (
    <div className="w-full h-full flex flex-col justify-start items-start ">
      <div className="w-5/6 flex bg-[#379237] my-2 mx-5 flex-col ">
        <h1 className="font-RobotoMedium text-base text-white ">Add User(s)</h1>
        <ul
          className="w-full flex flex-col justify-start items-start bg-white border border-black"
          style={{ height: "300px", overflowY: "auto" }}
        >
          {Array.isArray(freeUser)
            ? freeUser.map((user) => (
                <li key={user.id}>
                  <label className="w-full ml-2 flex justify-between items-center space-y-1">
                    <input
                      className="h-5 w-5"
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleUserCheckboxChange(user.id)}
                    />

                    <span className="ml-1 font-RobotoRegular text-base">
                      {user.firstname + " " + user.lastname}
                    </span>
                  </label>
                </li>
              ))
            : freeUser}
        </ul>
      </div>
      <div className="w-full mt-20 flex justify-end pr-10 ">
        <button
          onClick={(e) => handleAddRecipient(e)}
          disabled={selectedUserIds.length != 0 ? false : true}
          className={`${
            selectedUserIds.length != 0
              ? "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:hover:bg-green-700 dark:focus:ring-green-800 focus:ring-4 "
              : "bg-gray-600"
          } font-RobotoMedium focus:outline-none text-white rounded-md text-base px-5 py-2.5 mr-2 mb-2  `}
        >
          Add Recipient
        </button>
      </div>
    </div>
  );

  return (
    <>
      {selectDocumentModal.isSelected ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            {option == 1 ? (
              document[0].category !== "Archived" ? (
                <Success_Modal title={"Archived Document"} />
              ) : (
                <Success_Modal title={"Deleting Document"} />
              )
            ) : (
              <Success_Modal title={"Adding Users"} />
            )}
            <div className=" relative flex w-full h-5/6  my-6  max-w-6xl ">
              <div
                className={`rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none transition duration-700 ease-in-out`}
              >
                <div className="flex items-start justify-between p-2 border-b border-solid border-slate-300 rounded-t">
                  <div className="flex w-1/3">
                    <h1 className="font-RobotoMedium text-xl  self-start flex ">
                      {document[0].doc_name}
                    </h1>
                  </div>

                  <div className="flex w-full justify-center">
                    <h1
                      className={` font-RobotoBold text-xl align-text-top`}
                    ></h1>
                  </div>

                  <div className="flex w-1/3 justify-end">
                    <RiCloseCircleFill
                      onClick={() =>
                        setSelectDocumentModal({ id: "", isSelected: false })
                      }
                      className="h-8 w-8 text-slate-500 hover:text-red-700 transition duration-300 ease-in-out"
                    />
                  </div>
                </div>

                <div className="w-full h-full flex flex-col justify-start items-start">
                  <div className="w-full flex pr-5 flex-row justify-end space-x-2 items-end">
                    <h1
                      onClick={() => setOption(1)}
                      className={` ${
                        option == 1 && "border-b-2 border-black"
                      } font-RobotoMedium  w-20`}
                    >
                      View
                    </h1>
                    {document[0].category == "Archived" ? null : (
                      <h1
                        onClick={() => setOption(2)}
                        className={`${
                          option == 2 && "border-b-2 border-black"
                        } font-RobotoMedium w-32`}
                      >
                        Add Recipient
                      </h1>
                    )}

                    <h1
                      onClick={() => setOption(3)}
                      className={`${
                        option == 3 && "border-b-2 border-black"
                      } font-RobotoMedium w-20`}
                    >
                      Comment
                    </h1>
                  </div>

                  {option == 1 ? (
                    viewDocument
                  ) : option == 2 ? (
                    addRecipient
                  ) : option == 3 ? (
                    <Comments />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black rounded-lg"></div>
        </>
      ) : null}
    </>
  );
};

export default Select_Document;
