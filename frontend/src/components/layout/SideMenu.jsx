import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const SideMenu = ({menuItems}) => {
    /*const menuItems=[
        {
            name:"profile",
            url:"/me/profile",
            icon:"fas fa-user",

        },
        {
            name:"Update Profile",
            url:"/me/update_profile",
            icon:"fas fa-user",

        },
        {
            name:"Upload Avatar",
            url:"/me/upload_avatar",
            icon:"fas fa-user-circle",

        },
        {
            name:"Update Password",
            url:"/password/update",
            icon:"fas fa-lock",

        },
    ];*/
    const location=useLocation()
    const [activeMenItem, setActiveMenuItem] = React.useState(location.pathname);

    //changer de lien
    const handleMenuItem= (menuItemsUrl)=>{
        setActiveMenuItem(menuItemsUrl)
    }
  return (
    
    <div className="list-group mt-5 pl-4">
    {menuItems?.map((item,index)=>(
        <Link
        to={item.url} 
        key={index} 
        onClick={()=>handleMenuItem(item.url)}
        aria-current={activeMenItem.includes(item.url)? "true":"false"}

        className={`fw-bold list-group-item list-group-item-action ${activeMenItem.includes(item.url)? "active":""}`}
      >
        <i className={`${item.icon} menu-item-icon-1 fa-fw pe-2`}></i> {item.name}
      </Link>
    ))}
     
     
    </div>
  )
}

export default SideMenu
