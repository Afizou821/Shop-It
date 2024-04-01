import React from 'react'
import SideMenu from './SideMenu'

const UserLayout = ({children}) => {
  const menuItems=[
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
];

  return (
    <div>
      <div className='mt-2 mb-4 py-4'>
        <h2 className='text-center fw-bolder'>User Settings</h2>
      </div>
      <div className='container'>
        <div className='row justify-content-around'>
            <div className='col-12 col-lg-3'>
                <p> <SideMenu menuItems={menuItems} /></p>
            </div>
            <div className='col-12 col-lg-8 user-dashbord'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default UserLayout
