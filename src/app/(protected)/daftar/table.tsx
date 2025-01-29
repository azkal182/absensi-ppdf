"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const statusIcons = {
  HADIR: <CheckCircle className="text-green-500 w-4 h-4" />,
  SAKIT: <AlertCircle className="text-yellow-500 w-4 h-4" />,
  IZIN: <HelpCircle className="text-blue-500 w-4 h-4" />,
  ALFA: <XCircle className="text-red-500 w-4 h-4" />,
};

export default function AbsensiTable({ absensi }: { absensi: any[] }) {
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
    const year = 2025;
    const month = 1; // Januari
    const days = new Date(year, month, 0).getDate();
    const filteredDays = Array.from({ length: days }, (_, i) => i + 1).filter(
      (day) => {
        const date = new Date(year, month - 1, day); // Bulan di `Date` berbasis 0
        const dayOfWeek = date.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
        return dayOfWeek !== 2 && dayOfWeek !== 5; // Kecualikan Selasa (2) & Jumat (5)
      }
    );
    setDaysInMonth(filteredDays);
  }, []);

  return (
    <Card className="p-4">
      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-gray-200 text-sm text-gray-700">
            <TableHead className="border p-2">No</TableHead>
            <TableHead className="border p-2 text-nowrap">Nama</TableHead>
            {daysInMonth.map((day) => (
              <TableHead key={day} className="border p-2">
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {absensi.map((siswa, index) => (
            <TableRow key={siswa.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="border p-2 text-nowrap">
                {siswa.name}
              </TableCell>
              {daysInMonth.map((day) => (
                <TableCell key={day} className="border p-2 text-center">
                  {siswa.absensi[day] ? statusIcons[siswa.absensi[day]] : "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
