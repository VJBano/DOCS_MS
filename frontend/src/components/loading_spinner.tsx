import React from 'react'
import { useLottie } from "lottie-react";
import Animation from "../assets/Loading-Animation.json"

const Loading_spinner = () => {

  const options = {
    animationData: Animation,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="rounded-t-lg justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="rounded-t-lg relative my-6">
            <div className="loading-animation">{View}</div>
            <p className="font-semibold text-lg animate-pulse">Loading...</p>
          </div>
      </div>
  )
}

export default Loading_spinner