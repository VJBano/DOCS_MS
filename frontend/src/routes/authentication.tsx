import React, { Suspense, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import StateStore from '../utils/store';
import Caching from '../utils/caching';
import Loading_spinner from '../components/loading_spinner';
interface RoleProps  {
    role: {}[];
}

const Authentication = ({role}:RoleProps) => {

    //! role State
    const { setRole } = StateStore.roleStore();

    //! user cache data 
    const cacheAuth = Caching.getCache("AppData");
  
    let isLogged
    
    if(cacheAuth){

      isLogged = true
    } else {
      isLogged = false
    }

    useEffect(() => {
      setRole(cacheAuth?.role)
    },[])
    
  return (
    <>
      {isLogged? role?.includes(cacheAuth.role)? 
      <Suspense fallback={<Loading_spinner/>}>
        <Outlet/>
      </Suspense>: "UnAuthorized Page/Component Here..." :  <Navigate to={'/login'}/>}
    </>
  )
}

export default Authentication
