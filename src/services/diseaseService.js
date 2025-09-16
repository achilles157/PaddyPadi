const diseases = [
        {
        id: 1,
        name: "Bacterial Leaf Blight",
        symptoms: "Lesi berair pada tepi daun yang berubah menjadi abu-abu keputihan.",
        prevention: "Gunakan varietas padi yang tahan. Jangan memupuk dengan Nitrogen berlebihan.",
        handling: "Gunakan bakterisida berbasis tembaga sesuai dosis anjuran. Perbaiki sistem drainase sawah."
    },
        { id: 2, name: "Brown Spot",
        description: "Disebabkan oleh jamur Cochliobolus miyabeanus...",
        prevention: "Perbaiki drainase, gunakan fungisida jika perlu."
    },
        { id: 3, name: "Leaf Smut",
        description: "Disebabkan oleh jamur Entyloma oryzae...",
        prevention: "Gunakan benih bebas penyakit, lakukan rotasi tanaman."
    },
    ];
    
export const getDiseases = async () => diseases;
export const getDiseaseById = async (id) => diseases.find(d => d.id === parseInt(id));