import { getDaftarAbsen } from "@/actions/absenAction";
import React from "react";
import AbsensiTable from "./table";

const page = async () => {
  const data = await getDaftarAbsen(2024, 1);
  console.log(data);

  return (
    <div>
      <AbsensiTable absensi={data} />
    </div>
  );
};

export default page;
