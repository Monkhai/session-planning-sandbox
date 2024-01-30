import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  redirect("/");
  return null;
};

export default page;
