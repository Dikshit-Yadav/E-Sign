import React from 'react';
import { useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .sidebar {
          width: 250px;
          height: 93vh;
          background: #222;
          color: #fff;
          padding: 20px 10px;
        }
        .navList {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .navItem {
          padding: 10px 0;
          cursor: pointer;
        }
        .body {
          display: flex;
          flex: 1;
        }
      `}</style>

      <aside className='sidebar'>
        <h2>Officer Dashboard</h2>
        <i className="fa-solid fa-arrow-left"></i>
        <ul className='navList'>
          <li className='navItem' onClick={() => navigate("/officer-dashboard")}>Dashboard</li>
        </ul>
      </aside>
    </>
  );
};

export default SideBar;