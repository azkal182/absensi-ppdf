import { getAsrama } from "@/actions/absenAction";
import TableData from "./tableData";

export default async function Home() {
  const data = await getAsrama();

  return (
    <div>
      <TableData asrama={data ?? []} />
    </div>
  );
}
