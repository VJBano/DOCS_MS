import React, { useEffect } from "react";
import { BsFillExclamationCircleFill } from "react-icons/bs";

import { FaBeer } from "react-icons/fa";

type SuccessProps = {
  title:string,
}
const Create_Failed = ( {title}:SuccessProps ) => {

  const handleExit = async () => {

    console.log("exit ! ")

  };

  return (
    <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className=" relative flex w-96 h-72  my-6 ">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none transition duration-700 ease-in-out">
              <div className="flex items-start  p-2 border-b border-solid border-slate-300 rounded-t">
                <h1 className="font-RobotoBold text-lg">
                  Failed
                </h1>
              </div>
              <div className="w-full h-full  items-center flex flex-col mt-10">
                <div className=" flex flex-row">
                  <h1 className=" flex items-center font-RobotoRegular text-lg">{`Failed . ${title}`} 
                  <BsFillExclamationCircleFill  className="text-red-700" />
                  </h1>

                </div>
                <div className=" flex flex-row mt-10 gap-3">
                  <button
                    type="button"
                    onClick={() => handleExit()}
                    className="font-RobotoRegular text-base text-white bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800  rounded-lg  px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black rounded-lg"></div>
    </>
  );
};

export default Create_Failed;

