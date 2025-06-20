<template>
  <div class="list-container">
    <div class="list-background">
      <div class="bg-pattern"></div>
    </div>
    
    <div class="list-content">
      <div class="list-card">
        <div class="list-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon size="48" color="primary">mdi-format-list-bulleted-square</v-icon>
            </div>
            <div class="header-text">
              <h1 class="list-title">Daftar Laporan Kekerasan</h1>
              <p class="list-subtitle">Kelola dan pantau semua laporan yang telah disubmit</p>
            </div>
          </div>
          <div class="header-actions">
            <v-btn
              color="error"
              variant="outlined"
              @click="logout"
              class="logout-btn"
            >
              <v-icon left>mdi-logout</v-icon>
              Logout
            </v-btn>
          </div>
        </div>

        <div class="list-body">
          <v-alert
            v-if="error"
            type="error"
            class="modern-alert"
            border="left"
            elevation="2"
          >
            <v-icon left>mdi-alert-circle</v-icon>
            {{ error }}
          </v-alert>

          <div class="table-container">
            <div v-if="loading" class="loading-container">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
              <p class="loading-text">Memuat data laporan...</p>
            </div>

            <div v-else-if="reports.length === 0" class="empty-container">
              <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
              <h3>Belum ada laporan</h3>
              <p>Laporan yang disubmit akan muncul di sini</p>
            </div>

            <div v-else class="reports-table">
              <div class="table-header">
                <div class="header-cell">No.</div>
                <div class="header-cell">Jenis Kekerasan</div>
                <div class="header-cell">Lokasi</div>
                <div class="header-cell">Tanggal</div>
                <div class="header-cell">Tanggal Submit</div>
                <div class="header-cell">Hubungan dengan Pelaku</div>
                <div class="header-cell">Hash Laporan</div>
                <div class="header-cell">Bukti</div>
                <div class="header-cell">Nama Pelapor</div>
                <div class="header-cell">Kontak Pelapor</div>
              </div>

              <div class="table-body">
                <div 
                  v-for="(report, index) in reports" 
                  :key="report.reportHash" 
                  class="table-row"
                >
                  <div class="table-cell">
                    <v-chip color="primary" variant="tonal" size="small">
                      {{ index + 1 }}
                    </v-chip>
                  </div>
                  <div class="table-cell">
                    <div class="violence-type">
                      <v-icon left small color="deep-orange">mdi-alert-octagon</v-icon>
                      {{ report.violenceType }}
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="location">
                      <v-icon left small color="blue">mdi-map-marker</v-icon>
                      {{ report.location }}
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="date">
                      <v-icon left small color="green">mdi-calendar</v-icon>
                      {{ formatIncidentDate(report.date) }}
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="date">
                      <v-icon left small color="purple">mdi-calendar-clock</v-icon>
                      {{ formatSubmitDate(report.timestamp) }}
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="relation">
                      <v-icon left small color="indigo">mdi-account-group</v-icon>
                      {{ report.relationWithPerpetrator }}
                    </div>
                  </div>
                  <div class="table-cell hash-cell">
                    <div class="hash-content">
                      <span class="hash-text">{{ report.reportHash }}</span>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="primary"
                        @click="copyHash(report.reportHash)"
                        class="copy-btn"
                      >
                        <v-icon size="16">mdi-content-copy</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div class="table-cell">
                    <template v-if="report.fileName">
                      <v-btn
                        :href="fileUrl(report.fileName)"
                        target="_blank"
                        color="info"
                        size="small"
                        variant="outlined"
                        class="bukti-btn"
                      >
                        <v-icon left small>mdi-paperclip</v-icon>
                        Lihat Bukti
                      </v-btn>
                    </template>
                    <template v-else>
                      <span style="color: #aaa;">Tidak ada</span>
                    </template>
                  </div>
                  <div class="table-cell">
                    <div class="reporter-name">
                      <v-icon left small color="teal">mdi-account</v-icon>
                      {{ report.reporterName || '-' }}
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="reporter-contact">
                      <v-icon left small color="orange">mdi-phone</v-icon>
                      {{ report.reporterContact || '-' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../services/api.service';
import blockchainService from '../services/blockchain.service';

const ADMIN_WALLET = import.meta.env.VITE_ADMIN_WALLET?.toLowerCase();

export default {
  name: 'ReportList',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');
    const reports = ref([]);

    const fetchReports = async () => {
      loading.value = true;
      error.value = '';

      try {
        const data = await apiService.getAllReports();
        console.log('Raw reports data:', data);
        data.forEach(report => {
          console.log('Report submitDate:', {
            raw: report.submitDate,
            type: typeof report.submitDate,
            parsed: new Date(parseInt(report.submitDate))
          });
        });
        reports.value = data;
      } catch (err) {
        error.value = err.message || 'Failed to fetch reports';
        if (err.response?.status === 403) {
          router.push({ name: 'AccessDenied' });
        }
      } finally {
        loading.value = false;
      }
    };

    const formatIncidentDate = (date) => {
      if (!date) return '-';
      const d = new Date(date);
      return d.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Makassar',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };

    const formatSubmitDate = (timestamp) => {
      if (!timestamp) return '-';
      const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
      if (!ts) return '-';
      const d = new Date(ts * 1000);
      return d.toLocaleString('id-ID', {
        timeZone: 'Asia/Makassar',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    const copyHash = async (hash) => {
      try {
        await navigator.clipboard.writeText(hash);
        // Bisa tambahkan toast notification di sini
      } catch (err) {
        console.error('Failed to copy hash:', err);
      }
    };

    const logout = async () => {
      await blockchainService.disconnect();
      router.push({ name: 'Home' });
    };

    const fileUrl = (fileName) => {
      if (!fileName) return '#';
      return `http://localhost:3001/uploads/${fileName}`;
    };

    onMounted(async () => {
      // Cek wallet admin dari backend
      try {
        const address = await blockchainService.getWalletAddress();
        const { adminWallet } = await apiService.getAdminWallet();
        if (!adminWallet || address.toLowerCase() !== adminWallet.toLowerCase()) {
          router.push({ name: 'AccessDenied' });
          return;
        }
      } catch (err) {
        // Jika wallet belum connect, redirect juga
        router.push({ name: 'AccessDenied' });
        return;
      }
      fetchReports();
    });

    return {
      loading,
      error,
      reports,
      formatIncidentDate,
      formatSubmitDate,
      copyHash,
      logout,
      fileUrl
    };
  }
};
</script>

<style scoped>
.list-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.list-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.list-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
}

.list-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 20px;
  padding: 15px;
  color: white;
}

.header-text {
  flex: 1;
}

.list-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
}

.list-subtitle {
  font-size: 1.1rem;
  color: #64748b;
}

.logout-btn {
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
}

.list-body {
  min-height: 400px;
}

.modern-alert {
  border-radius: 12px;
  font-size: 1rem;
  margin-bottom: 30px;
}

.table-container {
  overflow-x: auto;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin: 20px 0;
}

.reports-table {
  width: 100%;
  background: white;
  min-width: 2000px;
  border-collapse: separate;
  border-spacing: 0;
}

.table-header{
  display: grid;
  background: linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%);
  color: #fff;
  font-weight: 600;
  padding: 16px 8px;
  position: sticky;
  top: 0;
  z-index: 1;
  grid-template-columns:
    80px    /* No. */
    220px   /* Jenis Kekerasan */
    220px   /* Lokasi */
    180px   /* Tanggal */
    260px   /* Tanggal Submit */
    220px   /* Hubungan dengan Pelaku */
    350px   /* Hash Laporan */
    150px   /* Bukti */
    160px   /* Nama Pelapor */
    150px;  /* Kontak Pelapor */
  align-items: center;
}

.header-cell, .table-cell {
  padding: 8px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  line-height: 1.5;
}

.table-row {
  display: grid;
  padding: 12px 8px;
  grid-template-columns:
    80px    /* No. */
    220px   /* Jenis Kekerasan */
    220px   /* Lokasi */
    180px   /* Tanggal */
    260px   /* Tanggal Submit */
    220px   /* Hubungan dengan Pelaku */
    350px   /* Hash Laporan */
    150px   /* Bukti */
    160px   /* Nama Pelapor */
    150px;  /* Kontak Pelapor */
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

/* Style untuk setiap tipe kolom */
.violence-type,
.location,
.date,
.relation,
.reporter-name,
.reporter-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.violence-type {
  color: #e11d48;
  font-weight: 500;
}

.location {
  color: #1d4ed8;
}

.date {
  color: #047857;
}

.relation {
  color: #6366f1;
}

.reporter-name {
  color: #0f766e;
  font-weight: 500;
}

.reporter-contact {
  color: #ea580c;
  font-weight: 500;
}

.hash-cell {
  overflow: hidden;
  max-width: 320px;
}

.hash-content {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.hash-text {
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-size: 0.9em;
  background: #f3f4f6;
  padding: 6px 10px;
  border-radius: 6px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
  display: inline-block;
  vertical-align: middle;
}

.copy-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.copy-btn:hover {
  opacity: 1;
}

.bukti-btn {
  width: 100%;
  max-width: 100px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Styling untuk nomor dan pelapor */
.table-cell:first-child {
  justify-content: center;
  text-align: center;
}

.table-cell:nth-last-child(2) {
  color: #8b5cf6;
  font-weight: 600;
}

.table-cell:nth-last-child(1) {
  color: #ec4899;
  font-weight: 600;
}

.loading-container, .empty-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 16px;
}

.loading-text {
  margin-top: 16px;
  color: #6b7280;
  font-size: 1.1rem;
}

.empty-container h3 {
  margin: 16px 0 8px;
  color: #374151;
  font-size: 1.5rem;
}

.empty-container p {
  color: #6b7280;
}

@media (max-width: 1200px) {
  .reports-table {
    min-width: 1800px;
  }
  .header-cell, .table-cell {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .list-title {
    font-size: 2rem;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .header-cell, .table-cell {
    padding: 10px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    background: white;
    margin: 10px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
}
</style> 