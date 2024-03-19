type statusActivity = 'Ditunda' | 'Disetujui' | 'Ditolak'

export default interface ActivityAttributes{
    no_kegiatan:string;
    item_kegiatan:string;
    status:statusActivity;
    no_komponen:string;
    continue:boolean

}