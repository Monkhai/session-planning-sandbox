import React from "react";

const page = ({ params }: { params: { athleteId: number } }) => {
  return <div>{params.athleteId}</div>;
};

export default page;
