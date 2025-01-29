export type Siswa = {
    id: number;
    name: string;
};

export type Kelas = {
    id: number;
    name: string;
    teacher: string;
    students: Siswa[];
};

export type Asrama = {
    id: number;
    name: string;
    classes: Kelas[];
};

export type Absensi = {
    siswaId: number;
    status: "Hadir" | "Tidak Hadir";
};
