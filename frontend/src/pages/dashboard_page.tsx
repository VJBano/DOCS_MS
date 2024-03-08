
import Caching from '../utils/caching';
import StateStore from '../utils/store';
import homepage from '../assets/homepage.png'

import { FcViewDetails,FcTodoList,FcDataProtection, FcOpenedFolder,FcKindle,FcDeployment } from "react-icons/fc";
import { useEffect, useState } from 'react';
const Dashboard_Page = () => {
  const { setNavClicked, navClicked , setGlobalCategory, globalCategory } = StateStore.navStore();
  const {role} = Caching.getCache("AppData");
  
  const [category, setCategory] = useState("default");

  useEffect(() => {


    if(category !== "default") {
      setNavClicked(2);
      setGlobalCategory(category)
    }

  },[category]);

  const handleCLick = async (id:number) => {


    setNavClicked(4);
    // if(id == 6) {
    //   setNavClicked(5);
    // } else{
    //   setNavClicked(2);
    // }

    if(id == 1) {
      setGlobalCategory("Minute");
    } else if(id == 2){
      setGlobalCategory("Memorandum");
    } else if(id == 3) {
      setGlobalCategory("Communication");
    } else if(id == 4) {
      setGlobalCategory("Forms");
    } else if(id == 5) {
      setGlobalCategory("Travel");
    } else if(id == 6) {
      setGlobalCategory("Others");
    } else {
      setGlobalCategory("All");
    }
  }
  return (
    <div className=" w-full h-full">
          <div className="bg-gray-200 h-10 justify-between flex flex-row sticky rounded-lg">
        <div className=" w-full flex justify-start items-center mx-2 ">
          <div className="lg:flex hidden space-x-2 items-center justify-start ml-2 gap-3 ">
            
          </div>

          <div className="flex flex-row justify-center items-center w-2/3 ">
          
          </div>

          <div className="flex flex-row justify-center items-center w-1/2 ">
            
          </div>
        </div>
      </div>
        <div className=" w-full px-2 py-2 border" style={{ height:550}}>
          {role == "Admin" ?<div className=' flex flex-wrap justify-start items-start md:space-x-3 h-full w-full px-5 gap-32'>

          <div className="flex flex-row justify-center items-center w-2/3 ">
          
          <h1 className='font-RobotoMedium text-base'>Document Category: &nbsp;</h1>
           <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-1/2 max-h-full font-RobotoRegular text-base outline-none">
           <option value="default" defaultChecked>Select Category</option>
              <option value="All">All</option>
              <option value="Memorandum">Memorandum</option>
              <option value="Minute">Minute</option>
              <option value="Communication">Communication Letter</option>
              <option value="Forms">Forms</option>
              <option value="Travel">Travel Order</option>
              <option value="Others">Others</option>
              
              

            </select>
         
          </div>
{/* <div  onClick={() => handleCLick(1)}>
  <FcTodoList className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Minute Files</h1>
</div>

<div  onClick={() => handleCLick(2)} className='flex flex-col justify-center items-center'>
  <FcOpenedFolder className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Memorandum Files</h1>
</div>

<div  onClick={() => handleCLick(3)} className='flex flex-col justify-center items-center'>
  <FcKindle className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Comnunication Letter Files</h1>
</div>

<div  onClick={() => handleCLick(4)} >
  <FcViewDetails className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Forms Files</h1>
</div>

<div  onClick={() => handleCLick(5)} className='flex flex-col justify-center items-center'>
  <FcDeployment className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Travel Order Files</h1>
</div>

<div  onClick={() => handleCLick(6)}>
  <FcDataProtection className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Archive Files</h1>
</div> */}

</div>: 

<div  className=" bg-cover bg-center bg-no-repeat flex flex-wrap gap-10 justify-center items-center">
  {/* <img src={homepage} alt="" style={{height:778, width:"100%"}}/> */}


  <div  onClick={() => handleCLick(1)}>
  <FcTodoList className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Minute Files</h1>
</div>

<div  onClick={() => handleCLick(2)} className='flex flex-col justify-center items-center'>
  <FcOpenedFolder className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Memorandum Files</h1>
</div>

<div  onClick={() => handleCLick(3)} className='flex flex-col justify-center items-center'>
  <FcKindle className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Comnunication Letter Files</h1>
</div>

<div  onClick={() => handleCLick(4)} >
  <FcViewDetails className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Forms Files</h1>
</div>

<div  onClick={() => handleCLick(5)} className='flex flex-col justify-center items-center'>
  <FcDeployment className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Travel Order Files</h1>
</div>

<div  onClick={() => handleCLick(6)}>
  <FcDataProtection className="w-20 h-20 "/>
  <h1 className='font-RobotoMedium text-base mt-3'>Others</h1>
</div>

</div>

}
      
        </div>
    </div>
  )
}

export default Dashboard_Page