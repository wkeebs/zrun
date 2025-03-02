"use client";

import React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { withAuth } from "@/lib/auth/route-protection";
import ActionButton from "../action-button";

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <div>Welcome, {user?.email}</div>
      <ActionButton route="/plans/new">Create a Plan</ActionButton>
    </>
  );
};

export default withAuth(ProfilePage);
