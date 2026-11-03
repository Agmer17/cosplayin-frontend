export type FindBoxDTO = {
  type: "FeatureCollection";
  features: PlaceFeatureDTO[];
};

export type PlaceFeatureDTO = {
  type: "Feature";
  geometry: PlaceGeometryDTO;
  properties: PlacePropertiesDTO;
};

export type PlaceGeometryDTO = {
  type: "Point";
  coordinates: [longitude: number, latitude: number];
};

export type PlacePropertiesDTO = {
  id: string;
  name: string;
  category: string;
};


export interface MapPlace {
    id: string
    name: string
    category: string
    address: string
    description: string
    schedule?: string
    tags?: string[]
}


// Data mock: nama tempat, alamat, dan jadwal hanya untuk menguji alur search/list/detail.
export const MOCK_PLACES: MapPlace[] = [
    {
        id: "bogor-cosplay-fest",
        name: "Bogor Cosplay Fest",
        category: "Event",
        address: "Convention Hall, Jl. Raya Pajajaran, Bogor Tengah, Kota Bogor",
        description:
            "Festival cosplay dengan lomba kostum, panggung musik jejepangan, dan bazar merchandise anime.",
        schedule: "Sabtu–Minggu, 10.00–21.00",
        tags: ["cosplay", "lomba", "bazar"],
    },
    {
        id: "jejepangan-market",
        name: "Jejepangan Market",
        category: "Event",
        address: "Lapangan Sempur, Jl. Sempur, Bogor Tengah, Kota Bogor",
        description:
            "Bazar bulanan komunitas dengan lapak merchandise, kuliner Jepang, dan zona foto cosplay.",
        schedule: "Setiap Minggu pertama, 09.00–17.00",
        tags: ["bazar", "merchandise", "kuliner"],
    },
    {
        id: "taman-topi-meetup",
        name: "Taman Topi Meetup",
        category: "Kumpul",
        address: "Taman Topi, Jl. Kapten Muslihat, Bogor Tengah, Kota Bogor",
        description:
            "Titik kumpul santai cosplayer dan penggemar anime untuk ngobrol, tukar merchandise, dan foto bareng.",
        schedule: "Sabtu, 15.00–18.00",
        tags: ["santai", "foto bareng"],
    },
    {
        id: "kebun-raya-photoshoot",
        name: "Spot Photoshoot Kebun Raya",
        category: "Photoshoot",
        address: "Jl. Ir. H. Juanda No. 13, Paledang, Bogor Tengah, Kota Bogor",
        description:
            "Area favorit fotografer dan cosplayer untuk sesi foto bertema alam dan fantasi. Cek aturan properti dan izin sebelum datang.",
        schedule: "Setiap hari, 08.00–16.00",
        tags: ["fotografi", "outdoor"],
    },
    {
        id: "kopi-nippon",
        name: "Kopi Nippon",
        category: "Kumpul",
        address: "Jl. Suryakencana, Bogor Tengah, Kota Bogor",
        description:
            "Kafe bertema Jepang dengan ruang luas untuk kumpul komunitas, nobar anime, dan rapat kecil panitia event.",
        schedule: "Setiap hari, 11.00–22.00",
        tags: ["kafe", "nobar", "komunitas"],
    },
    {
        id: "anime-club-ipb",
        name: "Anime Club IPB Dramaga",
        category: "Komunitas",
        address: "Kampus IPB Dramaga, Jl. Raya Dramaga, Kabupaten Bogor",
        description:
            "Komunitas mahasiswa penggemar anime dan budaya Jepang yang rutin mengadakan nobar, lomba, dan latihan cosplay.",
        schedule: "Jumat, 16.00–19.00",
        tags: ["mahasiswa", "nobar"],
    },
]