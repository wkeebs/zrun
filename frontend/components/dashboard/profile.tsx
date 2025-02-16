"use client";

import React from "react";
import { useAuth } from "@/lib/context/auth-context";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return <div>{user?.email}</div>;
};

export default Profile;
