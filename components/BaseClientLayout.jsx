import React from "react";

const BaseClientLayout = ({ children, floatingMenu = null }) => {
  return (
    <div className="flex min-h-screen font-body text-sm">
      <main className="h-screen w-full relative">
        <div className="h-full w-full">{children}</div>
        {floatingMenu}
      </main>
    </div>
  );
};

export default BaseClientLayout;
