import React from "react";
import Navbar from "~/components/layout/Navbar";
import SettingSidebar from "../SettingSidebar";

export default function SettingLayout({ children }) {
  return (
    <div className="w-screen h-screen bg-[#E5E5E5]">
      <div className="navbar-container w-full fixed left-0 top-0 z-10">
        <Navbar />
      </div>

      <div className="pt-16 flex h-full overflow-y-hidden">
        <div className="sidebar-container h-full">
          <SettingSidebar />
        </div>
        <div className="content-container-outer p-2 w-full overflow-y-scroll">
          <div className="content-container-inner rounded-lg py-5 px-4 lg:px-10
          lg:py-5 2xl:py-[21px] 2xl:px-[45px] min-h-full bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
