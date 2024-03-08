import React, { useEffect, useState } from 'react'
import { SidebarOptionProps } from '../constants/sidebar'
import { useNavigate } from 'react-router-dom';
import StateStore from '../utils/store';
import sideBar from '../constants/sidebar';

const Side_Bar = () => {
  const navigate = useNavigate();
  const [option, setOption] = useState<SidebarOptionProps[]>([{ id: 0, icon: <></>, title: "" }]);
  const { navClicked, setNavClicked } = StateStore.navStore();
  const { role } = StateStore.roleStore();

  useEffect(() => {
    if (role === "Admin") {

      const adminOption = sideBar.filter(adminMenu => {
        return adminMenu.id !== 4;
      });

      setOption(adminOption);
      
    } else if (role === "User") {
        
      const userOption = sideBar.filter(userMenu => {
        return userMenu.id !== 2 && userMenu.id !== 3 && userMenu.id !== 5;
      });
      
      setOption(userOption);
      
    } else {
      setOption([]);
    }
  }, [role]);

  if (role == undefined || role == null) {
    navigate("/login");
  }
  
  return (
    <div className="flex flex-col container w-full">
      {option.map((i) => {
        return (
          <div
            key={i.id}
            onClick={() => setNavClicked(i.id)}
            className={`h-14 flex justify-between items-center rounded cursor-pointer my-1 border-b-4 border-transparent 
                ${
                  (navClicked === i.id &&
                    "font-bold bg-[#17594A]  text-white") ||
                  (navClicked === i.id && "font-bold bg-[#17594A]  text-white") ||
                  (navClicked !== i.id && "hover:bg-slate-400")
                }`}
          >
            <div className="h-14 flex justify-start items-center rounded-l cursor-pointer my-1 border-b-4 border-transparent w-full">
              <span
                className={`ml-2 xl:hidden ${
                    navClicked === i.id && "text-white"
                }`}
              >
                {i.icon}
              </span>
              <span
                className={`xl:flex hidden mx-2 ${
                    navClicked === i.id && "text-white"
                }`}
              >
                {i.icon}
              </span>
              <h1
                className={`font-RobotoRegular text-base group-hover:shadow xl:flex hidden space-x-4 ${
                    navClicked === i.id && "text-lg font-RobotoBold"
                }`}
              >
                { role === "User"?i.title == "Dashboard"? "Homepage" :i.title  : i.title}
              </h1>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Side_Bar