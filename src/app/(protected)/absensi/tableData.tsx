"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getClassByAsramaId,
  getDataByKelasId,
  saveData,
} from "@/actions/absenAction";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type AsramaProps = {
  name: string;
  id: number;
}[];

type KelasData = {
  id: number;
  name: string;
  teacher: string;
  asramaId: number;
}[];

type SiswaData = {
  id: number;
  name: string;
  kelasId: number;
}[];

export type SelectedAttendance = {
  kelasId?: number;
  asramaId?: number;
  data: { siswaId: number; status: string }[];
};

const TableData = ({ asrama }: { asrama: AsramaProps }) => {
  const [kelas, setKelas] = useState<KelasData | []>([]);
  const [siswa, setSiswa] = useState<SiswaData | []>([]);
  const [dialog, setDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<SelectedAttendance>({
      kelasId: undefined,
      asramaId: undefined,
      data: [],
    });
  const { toast } = useToast();

  const handleCheckboxChange = (siswaId: number, status: string) => {
    setSelectedAttendance((prev) => {
      const updatedData = prev.data.filter((item) => item.siswaId !== siswaId);
      updatedData.push({ siswaId, status });

      return {
        ...prev,
        data: updatedData,
      };
    });
  };

  const handleChangeAsrama = async (asramaId: string) => {
    const id = parseInt(asramaId);
    try {
      const result = await getClassByAsramaId(id);
      setKelas(result);
      setSelectedAttendance((prev) => ({
        ...prev,
        asramaId: id,
      }));
    } catch (error) {
      alert(error);
    }
  };

  const handleChangeKelas = async (kelasId: string) => {
    const id = parseInt(kelasId);
    try {
      const result = await getDataByKelasId(id);
      setSiswa(result);

      const defaultAttendance = result.map((item) => ({
        siswaId: item.id,
        status: "HADIR",
      }));

      setSelectedAttendance((prev) => ({
        ...prev,
        kelasId: id,
        data: defaultAttendance,
      }));
    } catch (error) {
      alert(error);
    }
  };

  const countStatus = (status: string) => {
    return selectedAttendance.data.filter((item) => item.status === status)
      .length;
  };

  const handleSubmit = async () => {
    try {
      await saveData(selectedAttendance, 1);
      setDialog(false);
      toast({
        title: "Sukses",
        description: "Data berhasil disimpan",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Data berhasil disimpan",
      });
    }
  };

  const handleConfirm = async () => {
    if (selectedAttendance.data.length > 0) {
      setDialog(true);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select onValueChange={handleChangeAsrama}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Pilih Asrama" />
          </SelectTrigger>
          <SelectContent>
            {asrama.map((item, index) => (
              <SelectItem key={index} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleChangeKelas}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            {kelas.map((item, index) => (
              <SelectItem key={index} value={item.id.toString()}>
                {item.name} - {item.teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="my-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="">
          <h3 className="text-lg font-semibold text-center">Rekap Kehadiran</h3>
          {selectedAttendance.kelasId && (
            <h3 className="text-lg font-semibold text-center mb-2">
              {asrama.find((a) => a.id === selectedAttendance.asramaId)?.name} -{" "}
              {kelas.find((k) => k.id === selectedAttendance.kelasId)?.name} -{" "}
              {kelas.find((k) => k.id === selectedAttendance.kelasId)?.teacher}
            </h3>
          )}
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <li>Total: {siswa.length}</li>
          <li>Hadir: {countStatus("HADIR")}</li>
          <li>Izin: {countStatus("IZIN")}</li>
          <li>Sakit: {countStatus("SAKIT")}</li>
          <li>Alfa: {countStatus("ALFA")}</li>
        </ul>
      </div>

      <Table className="border border-gray-300 rounded-lg overflow-hidden">
        <TableCaption>Daftar Kehadiran Siswa</TableCaption>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead className="w-[50px] text-center">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="md:w-16">Hadir</TableHead>
            <TableHead className="md:w-16">Izin</TableHead>
            <TableHead className="md:w-16">Sakit</TableHead>
            <TableHead className="md:w-16">Alfa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {siswa?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === "HADIR"
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, "HADIR")}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === "IZIN"
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, "IZIN")}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === "SAKIT"
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, "SAKIT")}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === "ALFA"
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, "ALFA")}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={handleConfirm}>Submit</Button>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apakah data sudah benar?</DialogTitle>
          </DialogHeader>
          <div>
            {selectedAttendance.kelasId && (
              <h3 className="font-semibold mb-2">
                {asrama.find((a) => a.id === selectedAttendance.asramaId)?.name}{" "}
                - {kelas.find((k) => k.id === selectedAttendance.kelasId)?.name}{" "}
                -{" "}
                {
                  kelas.find((k) => k.id === selectedAttendance.kelasId)
                    ?.teacher
                }
              </h3>
            )}
            <ul className="grid grid-cols-3">
              <li>Total: {siswa.length}</li>
              <li>Hadir: {countStatus("HADIR")}</li>
              <li>Izin: {countStatus("IZIN")}</li>
              <li>Sakit: {countStatus("SAKIT")}</li>
              <li>Alfa: {countStatus("ALFA")}</li>
            </ul>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                setDialog(false);
              }}
            >
              Batal
            </Button>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableData;
