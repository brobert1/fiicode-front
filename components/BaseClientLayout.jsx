import React from "react";

const BaseClientLayout = ({ children, floatingMenu = null }) => {
  return (
    <div className="flex min-h-dvh font-body text-sm">
      <main className="min-h-dvh w-full relative">
        <div className="h-dvh w-full">{children}</div>
        {floatingMenu}
      </main>
    </div>
  );
};

export default BaseClientLayout;
