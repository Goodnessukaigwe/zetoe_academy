import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
  
      {isOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-40 z-20 "
          onClick={toggleSidebar}
        > </div>
      )}

      <aside
        className={`fixed md:fixed inset-y-0 left-0 z-30 bg-gray-900 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }  transition-transform duration-300 
         ease-in-out shadow-lg`}
      >
    

        <ul className="p-4 space-y-2">
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">🏠 Dashboard</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">👥 Manage Admins</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">🎓 Manage Students</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">💳 Payment Info</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">📊 System Overview</li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
