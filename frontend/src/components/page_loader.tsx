import React, { lazy, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StateStore from '../utils/store';
import Caching from '../utils/caching';
import Archived_Page from '../pages/archived_page';

function Page_Loader() {
  const navigation = useNavigate();
  const { navClicked, setNavClicked, setGlobalCategory, globalCategory  } = StateStore.navStore();

  const [page, setPage] = useState(<></>);
  const option = Caching.getCache("nav");
  const {setSuccessModal} = StateStore.ModalStore();

  const DashboardPage = lazy(() => import("../pages/dashboard_page"));
  const DocumentPage = lazy(() => import("../pages/document_page"));
  const UserPage = lazy(() => import("../pages/user_page"));
  const NotifPage = lazy(() => import("../pages/notification_page"));

  if(!option){
    navigation('/login')
}

  useEffect(() => {

    if(navClicked == 1){
      Caching.setCache("nav", {option:1}, 86400000);
      setPage(<DashboardPage/>);
      setSuccessModal(false);
  } else if(navClicked == 2){
    
    Caching.setCache("nav", {option:2}, 86400000);
      setPage(<DocumentPage/>);
      setSuccessModal(false);
  }else if(navClicked == 3){
    Caching.setCache("nav", {option:3}, 86400000);
      setPage(<UserPage/>);
      setSuccessModal(false);
  }else if(navClicked == 4){
    Caching.setCache("nav", {option:4}, 86400000);
      setPage(<NotifPage/>);
      setSuccessModal(false);
  } else if(navClicked == 5) {
    Caching.setCache("nav", {option:5}, 86400000);
      setPage(<Archived_Page/>);
      setSuccessModal(false);
  } else if(navClicked == 6){
      setSuccessModal(false);
      window.localStorage.removeItem("AppData");
      setNavClicked(1)
      navigation('/login')
    //! set Logout here to true
  }

  },[navClicked]);

  return (
    <>
    {page}
    </>
  )
}

export default Page_Loader