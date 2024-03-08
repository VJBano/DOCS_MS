import { BiSolidDashboard,BiSolidUserDetail } from "react-icons/bi";
import { PiNotificationBold } from "react-icons/pi";
import { IoDocumentTextSharp } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { FaFileArchive } from "react-icons/fa";

const sideBar = [
    {
        id:1,
        icon: <BiSolidDashboard className="nav-icon"/>,
        title: "Dashboard"
    },
    {
        id:2,
        icon: <IoDocumentTextSharp className="nav-icon"/>,
        title: "Document"
    },
    {
        id:3,
        icon: <BiSolidUserDetail className="nav-icon"/>,
        title: "User"
    },
    {
        id:4,
        icon: <PiNotificationBold className="nav-icon"/>,
        title: "Notification"
    },
    {
        id:5,
        icon: <FaFileArchive className="nav-icon"/>,
        title:"Archived Files"
    },
     {
        id:6,
        icon:  <ImExit className="nav-icon"/>,
        title: "Logout",
        
    },
    
]

export interface SidebarOptionProps {
    id:number;
    icon:JSX.Element;
    title:string;
  }
  

export default sideBar