"use client";
import React from "react";
import getUserId from "~/services/backend/userManagement/getUserId";
import client from "~/utils/supabaseClient";

const page = () => {
  return (
    <section className="relative flex h-[100dvh] flex-col items-center justify-start bg-background-gradient pt-4 dark:bg-dark-background-gradient">
      <h1>How to delete your account</h1>
      <h2 className="pt-4">Step 1</h2>
      <p className="pt-2">Log in to your account</p>
      <h2 className="pt-4">Step 2</h2>
      <p className="pt-2">
        click the question mark at the bottom right corner of the screen
      </p>
      <h2 className="pt-4">Step 3</h2>
      <p className="pt-2">Click the delete account button</p>
      <h2 className="pt-4">Step 4</h2>
      <p className="pt-2">Confirm the deletion</p>
      <h2 className="pt-4">Step 5</h2>
      <p className="pt-2">
        Thats it! We will make sure to delete all of your data :)
      </p>
    </section>
  );
};

export default page;
