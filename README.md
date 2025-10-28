# PaddyPadi 🌱 - Deteksi Penyakit Padi

PaddyPadi adalah sebuah Progressive Web App (PWA) yang dirancang untuk membantu pengguna mendeteksi kemungkinan penyakit pada tanaman padi menggunakan teknologi _machine learning_. Aplikasi ini memungkinkan pengguna untuk memindai gambar daun padi melalui kamera perangkat atau mengunggah gambar yang sudah ada.

## ✨ Fitur Utama

* **Deteksi Penyakit:** Menganalisis gambar daun padi untuk mengidentifikasi potensi penyakit.
* **Dua Mode Input:**
    * **Unggah Gambar:** Pilih gambar daun padi dari galeri perangkat Anda.
    * **Scan Kamera:** Gunakan kamera perangkat secara langsung untuk pemindaian _real-time_ (dengan model saringan awal) dan pengambilan gambar.
* **Model Dua Tingkat:**
    * **Model Saringan (TF.js):** Model _client-side_ TensorFlow.js yang berjalan di browser untuk memberikan umpan balik cepat saat menggunakan kamera.
    * **Model Ahli (Server):** Setelah gambar diambil (dari kamera atau unggahan), gambar dikirim ke server backend (misalnya, FastAPI) untuk analisis yang lebih mendalam menggunakan model yang lebih kompleks.
* **Hasil Detil:** Menampilkan nama penyakit yang terdeteksi, tingkat kepercayaan (_confidence level_), dan informasi detail mengenai penyakit tersebut (deskripsi, penyebab, penanganan) yang diambil dari Firestore.
* **Riwayat Laporan:** Pengguna dapat menyimpan hasil prediksi sebagai laporan di akun mereka, yang tersimpan di Firestore.
* **Informasi Penyakit:** Menampilkan daftar penyakit padi yang dapat dideteksi beserta detailnya.
* **Autentikasi Pengguna:** Menggunakan Firebase Authentication untuk login dan registrasi.
* **Profil Pengguna:** Halaman untuk melihat informasi pengguna dan logout.
* **PWA Ready:** Dapat diinstal di perangkat pengguna untuk pengalaman seperti aplikasi native.

## 🚀 Teknologi yang Digunakan

* **Frontend:**
    * [React](https://reactjs.org/)
    * [Vite](https://vitejs.dev/) - Build tool
    * [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
    * [React Router](https://reactrouter.com/) - Routing
    * [TensorFlow.js](https://www.tensorflow.org/js) - Untuk model saringan _client-side_
    * [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) - Untuk fungsionalitas PWA
* **Backend & Database:**
    * [Firebase](https://firebase.google.com/)
        * **Firestore:** Database NoSQL untuk menyimpan data penyakit dan laporan pengguna.
        * **Authentication:** Untuk manajemen pengguna.
        * **(Opsional: Firebase Storage):** Direkomendasikan untuk menyimpan gambar yang diunggah/di-capture.
* **Model Ahli (Server):** Dihosting secara terpisah (misalnya, menggunakan Python FastAPI/Flask di Railway, Google Cloud Run, dll.) dan diakses melalui API.

## 🛠️ Instalasi & Setup Lokal

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/nama-pengguna-anda/paddypadi.git](https://github.com/nama-pengguna-anda/paddypadi.git)
    cd paddypadi
    ```

2.  **Install Dependensi:**
    Pastikan Anda memiliki [Node.js](https://nodejs.org/) dan npm (atau [Yarn](https://yarnpkg.com/)) terinstal.
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Firebase:**
    * Buat proyek Firebase baru di [Firebase Console](https://console.firebase.google.com/).
    * Aktifkan layanan **Authentication** (dengan metode Email/Password) dan **Firestore Database**.
    * Dapatkan konfigurasi Firebase Anda (API Key, Auth Domain, Project ID, dll.) dari pengaturan proyek.
    * Buat file `.env` di *root* proyek dan tambahkan konfigurasi Firebase Anda:
        ```env
        VITE_FIREBASE_API_KEY=apikey_anda
        VITE_FIREBASE_AUTH_DOMAIN=domain_auth_anda
        VITE_FIREBASE_PROJECT_ID=project_id_anda
        VITE_FIREBASE_STORAGE_BUCKET=storage_bucket_anda
        VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id_anda
        VITE_FIREBASE_APP_ID=app_id_anda
        
        # Tambahkan URL API Model Ahli Anda
        VITE_EXPERT_MODEL_API_URL=[https://url-backend-model-ahli-anda.com](https://url-backend-model-ahli-anda.com) 
        ```
    * Perbarui file `src/services/firebase.js` untuk membaca variabel lingkungan ini:
        ```javascript
        // src/services/firebase.js
        import { initializeApp } from 'firebase/app';
        import { getAuth } from 'firebase/auth';
        import { getFirestore } from 'firebase/firestore';

        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID
        };

        const app = initializeApp(firebaseConfig);
        export const auth = getAuth(app);
        export const db = getFirestore(app);
        ```
    * Perbarui file `src/services/predictionService.js` untuk menggunakan URL API Model Ahli:
        ```javascript
        // src/services/predictionService.js
        // ... (import lainnya)
        const EXPERT_MODEL_API_URL = import.meta.env.VITE_EXPERT_MODEL_API_URL;
        
        // ... (fungsi loadModel, predict)

        export const predictExpert = async (imageFile) => {
            if (!EXPERT_MODEL_API_URL) {
                throw new Error("Expert model API URL is not configured.");
            }
            // ... (logika fetch ke EXPERT_MODEL_API_URL)
        };
        ```

4.  **Isi Data Awal Firestore (Opsional):**
    * Anda mungkin perlu mengisi koleksi `diseases` di Firestore dengan data penyakit padi (nama, penjelasan, penyebab, penanganan, dll.) agar aplikasi dapat menampilkan informasi yang relevan. Pastikan ID dokumen di koleksi `diseases` sesuai dengan `class_name` yang dihasilkan oleh model prediksi Anda.

5.  **Jalankan Development Server:**
    ```bash
    npm run dev
    # atau
    yarn dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

## 📦 Build untuk Produksi

Untuk membuat versi produksi aplikasi:

```bash
npm run build
# atau
yarn build
