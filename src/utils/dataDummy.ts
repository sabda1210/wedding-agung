interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

export const generateDummyWishes = (): Wish[] => {
  return [
    {
      id: 1,
      name: "Ahmad Fauzi",
      message: "Selamat menempuh hidup baru! Semoga pernikahan kalian menjadi berkah dan sakinah mawaddah warahmah.",
      date: "25 Mei 2025"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      message: "Bahagia selalu untuk kedua mempelai. Semoga cinta kalian abadi selamanya.",
      date: "26 Mei 2025"
    },
    {
      id: 3,
      name: "Budi Santoso",
      message: "Selamat atas pernikahan kalian! Semoga rumah tangga kalian dipenuhi dengan cinta, kebahagiaan, dan rezeki yang berlimpah.",
      date: "27 Mei 2025"
    },
    {
      id: 4,
      name: "Dewi Fortuna",
      message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
      date: "27 Mei 2025"
    },
    {
      id: 5,
      name: "Reza Rahadian",
      message: "Semoga pernikahan ini menjadi awal dari kehidupan yang lebih baik. Bahagia selalu!",
      date: "28 Mei 2025"
    },
    {
      id: 6,
      name: "Dian Sastro",
      message: "Selamat menempuh hidup baru! Semoga selalu dilimpahkan kebahagiaan dan keberkahan.",
      date: "28 Mei 2025"
    },
    {
      id: 7,
      name: "Taufik Hidayat",
      message: "Selamat ya! Semoga langgeng dan menjadi keluarga yang sakinah mawaddah warahmah.",
      date: "28 Mei 2025"
    },
    {
      id: 8,
      name: "Luna Maya",
      message: "Bahagia selalu untuk kalian berdua. Semoga pernikahan kalian dilandasi dengan cinta dan ketulusan.",
      date: "29 Mei 2025"
    },
    {
      id: 9,
      name: "Anwar Ibrahim",
      message: "Semoga menjadi keluarga yang selalu dilimpahkan kebahagiaan dan keberkahan. Amin.",
      date: "29 Mei 2025"
    },
    {
      id: 10,
      name: "Raisa Andriana",
      message: "Selamat atas pernikahan kalian! Semoga selalu bahagia dan sejahtera.",
      date: "29 Mei 2025"
    },
    {
      id: 11,
      name: "Andika Pratama",
      message: "Semoga cinta kalian abadi selamanya. Selamat menempuh hidup baru!",
      date: "30 Mei 2025"
    },
    {
      id: 12,
      name: "Rina Nose",
      message: "Selamat menempuh hidup baru! Semoga pernikahan kalian menjadi berkah dan selalu dilimpahkan kebahagiaan.",
      date: "30 Mei 2025"
    }
  ];
};