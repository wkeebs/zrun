"use client";

import React from "react";
import { useAuth } from "@/lib/context/auth-context";

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return <div>{user?.email}</div>;
};

export default ProfilePage;
