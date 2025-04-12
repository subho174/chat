import React from "react";

const Panel = () => {
  return (
    <div className="basis-[20%] border-r-1 border-gray-300 h-[100vh] p-[2rem_1.5rem]">
      <header className="flex justify-between items-center">
        <i className="fa-solid fa-users"></i>
        <p className="font-medium text-xl">Contacts</p>
        <i className="fa-solid fa-plus"></i>
      </header>
      <div>
        <i className="fa-solid fa-magnifying-glass relative top-10.5 left-3"></i>
        <input
          type="text"
          name=""
          placeholder="Search users"
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default Panel;
