# Sistem Pelaporan Kekerasan Berbasis Blockchain

Sistem pelaporan kekerasan berbasis blockchain untuk mendukung SDGs 5 (Kesetaraan Gender). Sistem ini berjalan secara lokal dan menggunakan blockchain untuk menjamin integritas data laporan.

## Fitur

- Form pelaporan kekerasan (publik)
- Verifikasi bukti laporan (publik)
- Dashboard admin untuk melihat laporan (memerlukan MetaMask)
- Penyimpanan file bukti secara lokal
- Hash file disimpan di blockchain
- Tidak menyimpan identitas pelapor

## Teknologi yang Digunakan

- Smart Contract: Solidity + Hardhat
- Backend: Node.js + Express
- Frontend: Vue.js + Vuetify
- Blockchain: Hardhat Network (local)
- Wallet: MetaMask
- File Storage: Local storage

## Cara Menjalankan

### 1. Setup Smart Contract

```bash
cd contracts
npm install
npm run node  # Jalankan di terminal terpisah
npm run deploy:local  # Jalankan di terminal baru
```

Salin alamat kontrak yang didapat dari hasil deploy.

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` dengan isi:
```
PORT=3000
UPLOAD_DIR=uploads
PROVIDER_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=<alamat_kontrak_dari_langkah_1>
ADMIN_WALLET=<alamat_wallet_metamask_anda>
```

Jalankan backend:
```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Setup MetaMask

1. Install ekstensi MetaMask di browser
2. Tambahkan network Hardhat:
   - Network Name: Hardhat
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
3. Import salah satu private key dari node Hardhat untuk digunakan sebagai admin

## Penggunaan

1. Buka http://localhost:5173
2. Untuk membuat laporan, klik "Buat Laporan" dan isi form
3. Untuk verifikasi bukti, klik "Verifikasi" dan masukkan hash
4. Untuk akses admin:
   - Klik "Login Admin"
   - Hubungkan dengan wallet MetaMask yang sudah disetup
   - Lihat daftar laporan yang masuk

## Catatan Keamanan

- Sistem ini dirancang untuk berjalan secara lokal
- File bukti disimpan di folder lokal, bukan di blockchain
- Hash file digunakan untuk memverifikasi keaslian bukti
- Tidak ada data pribadi yang disimpan di blockchain 