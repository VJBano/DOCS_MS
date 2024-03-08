

import { Route, Routes } from 'react-router-dom'
import Login_Page from '../pages/login_page'
import Authentication from './authentication'
import Admin_Dashboard from '../pages/dashboard/admin_dashboard'
import User_Dashboard from '../pages/dashboard/user_dashboard'
import { lazy } from 'react'

const Routers = () => {


  const AdminDashboard = lazy(() => import('../pages/dashboard/admin_dashboard'));
  const UserDashboard = lazy(() => import('../pages/dashboard/user_dashboard'));
  return (
    <Routes>
        <Route path='/' element={<Login_Page/>}/>
        <Route path='/login' element={<Login_Page/>}/>
        
  
        {/* //!URL not Found Component/Page Here... */}
        {/* <Route path='*' element={}/> */}

      {/* //!Private Routes */}
      {/* //?Admin Routes */}
      <Route element={<Authentication role={["Admin"]}/>}>
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Route>

      {/* //?User Routes */}
      <Route element={<Authentication role={["User"]}/>}>
        <Route path='/user' element={<UserDashboard/>}/> 
      </Route>


    </Routes>
  )
}

export default Routers
