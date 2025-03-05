"use client";

import Sidebar from "@/components/layout/sidebar";
import TopNav from "@/components/layout/top-nav";
import { FullPageLoader } from "@/components/loading-spinner";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";

function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (status === "loading") {
    return <FullPageLoader />;
  }

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        className={`
          top-0 bottom-0 left-0 z-20 
          ${isCollapsed ? "w-16" : "w-64"}
        `}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={`flex flex-col flex-1 overflow-hidden ${
          isCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300`}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default ApplicationLayout;