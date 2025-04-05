import React from "react";
import Toggler from "./navbar/Toggler";

export default function NavBar() {
  return (
    <div className="absolute left-0 top-0 w-screen bg-gradient-to-b from-gray-600 to-transparent py-4 px-6">
      <div className="flex flex-row justify-between">
        <Toggler />
        <h1>Login</h1>
      </div>
    </div>
  );
}
