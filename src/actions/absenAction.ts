"use server";

import { SelectedAttendance } from "@/app/tableData";
import prisma from "@/lib/prisma";
import { StatusAbsen } from "@prisma/client";

export async function getAsrama() {
    try {
        const asrama = await prisma.asrama.findMany({

            select: {
                id: true,
                name: true
            }
        });

        return asrama;
    } catch (error) {
        return []
    }
}

export async function getClassByAsramaId(asramaId: number) {
    try {
        const result = await prisma.kelas.findMany({
            where: {
                asramaId: asramaId
            }
        })

        return result
    } catch (error) {
        return []

    }
}




// GET: Ambil data Asrama, Kelas, dan Siswa
export async function getDataByKelasId(kelasId: number) {
    try {
        const siswa = await prisma.siswa.findMany({
            where: {
                kelasId
            }
        });

        return siswa;
    } catch (error) {
        return []
    }
}

// POST: Simpan data absensi
// export async function saveData(dataAbsens: SelectedAttendance) {
//     try {
//         const { data, asramaId, kelasId } = dataAbsens
//         const result = await prisma.absensi.createMany({
//             data: data.map((item) => {
//                 return {
//                     siswaId: item.siswaId,
//                     userId: 1,
//                     status: item.status,
//                     date: Date.now()
//                 }
//             })
//         });

//         return result;
//     } catch (error) {
//         console.error(error);
//     }
// }

export async function saveData(dataAbsens: SelectedAttendance, userId: number) {
    try {
        const { data, asramaId, kelasId } = dataAbsens;

        if (!userId) {
            throw new Error("User ID tidak valid.");
        }

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error("Data absensi tidak boleh kosong.");
        }

        // Validasi status agar sesuai dengan enum StatusAbsen
        const validStatuses = Object.values(StatusAbsen);
        const formattedData = data.map((item) => {
            if (!validStatuses.includes(item.status as StatusAbsen)) {
                throw new Error(`Status "${item.status}" tidak valid.`);
            }
            return {
                siswaId: item.siswaId,
                userId,
                status: item.status as StatusAbsen,
                date: new Date()
            };
        });

        // Simpan data ke database
        const result = await prisma.absensi.createMany({
            data: formattedData
        });

        return { success: true, count: result.count };
    } catch (error) {
        console.error("Error saat menyimpan data absensi:", error);
        return { success: false, message: error.message };
    }
}

export async function getDaftarAbsen(year: number, month: number) {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const absensiList = await prisma.absensi.findMany({
            // where: {
            //     date: {
            //         gte: startDate.toISOString(),
            //         lte: endDate.toISOString()
            //     }
            // },
            include: {
                siswa: true
            },
            orderBy: [
                { siswaId: 'asc' },
                { date: 'asc' }
            ]
        });

        if (!absensiList || absensiList.length === 0) {
            return []; // Return array kosong jika tidak ada data
        }

        // Buat format data yang lebih terstruktur
        const siswaMap = new Map();

        absensiList.forEach(absensi => {
            const siswaId = absensi.siswa?.id ?? 0; // Pastikan siswa ada
            if (!siswaMap.has(siswaId)) {
                siswaMap.set(siswaId, {
                    id: siswaId,
                    name: absensi.siswa?.name ?? "Unknown",
                    absensi: {}
                });
            }

            const formattedDate = new Date(absensi.date).getDate();
            siswaMap.get(siswaId).absensi[formattedDate] = absensi.status;
        });

        return Array.from(siswaMap.values());
    } catch (error) {
        console.error("Error fetching absensi:", error);
        return { error: "Terjadi kesalahan saat mengambil data absensi." };
    }
}
