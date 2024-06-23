export default interface PtkAttributes{
    uuid:string;
    nupy:string;
    nama:string;
    tempat_lahir:string;
    tanggal_lahir:Date;
    alamat:string;
    kecamatan:string;
    kabupaten:string;
    provinsi:string;
    gender:string;
    no_hp:string;
    status_pernikahan:string;
    pendidikan_terakhir:string;
    gelar:string;
    gol_darah:string;
}

export interface programResponseBreakDown {
    no: string,
    item:string,
    total:number
}