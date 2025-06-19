<template>
  <div class="verify-container">
    <div class="verify-background">
      <div class="bg-animation">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>
    
    <div class="verify-content">
      <div class="verify-card">
        <div class="verify-header">
          <div class="header-icon">
            <v-icon size="48" color="primary">mdi-file-search-outline</v-icon>
          </div>
          <h1 class="verify-title">Verifikasi Laporan Kekerasan</h1>
          <p class="verify-subtitle">Periksa keaslian dan validitas laporan yang telah disubmit</p>
        </div>

        <div class="verify-body">
          <div class="search-section">
            <div class="search-card">
              <label class="search-label">Masukkan Hash Laporan</label>
              <div class="search-input-group">
                <v-text-field
                  v-model="reportHash"
                  placeholder="Contoh: 5d71db026f4e46be1e1d439a9bc5704178b949e1b7ba99e5cd9847cecd3ca02c"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  color="primary"
                  class="search-input"
                  hide-details
                ></v-text-field>
                <v-btn
                  color="primary"
                  @click="verifyReport"
                  :loading="loading"
                  size="x-large"
                  class="search-btn"
                >
                  <v-icon left>mdi-check-decagram</v-icon>
                  Verifikasi
                </v-btn>
              </div>
            </div>
          </div>

          <div class="result-section" v-if="report || error">
            <div v-if="error" class="error-card">
              <div class="error-icon">
                <v-icon size="64" color="error">mdi-alert-circle</v-icon>
              </div>
              <h3 class="error-title">Laporan Tidak Ditemukan</h3>
              <p class="error-message">{{ error }}</p>
              <div class="error-actions">
                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="clearError"
                  class="retry-btn"
                >
                  <v-icon left>mdi-refresh</v-icon>
                  Coba Lagi
                </v-btn>
              </div>
            </div>

            <div v-else-if="report" class="success-card">
              <div class="success-header">
                <div class="success-icon">
                  <v-icon size="64" color="success">mdi-check-circle</v-icon>
                </div>
                <div class="success-badge">
                  <v-chip color="success" variant="tonal" size="large">
                    <v-icon left>mdi-shield-check</v-icon>
                    Laporan Terverifikasi
                  </v-chip>
                </div>
              </div>

              <div class="report-details">
                <h3 class="details-title">Detail Laporan</h3>
                
                <div class="details-grid">
                  <div class="detail-item">
                    <div class="detail-label">
                      <v-icon left color="primary">mdi-alert-octagon</v-icon>
                      Jenis Kekerasan
                    </div>
                    <div class="detail-value">{{ report.violenceType }}</div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <v-icon left color="blue">mdi-map-marker</v-icon>
                      Lokasi Kejadian
                    </div>
                    <div class="detail-value">{{ report.location }}</div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <v-icon left color="green">mdi-calendar</v-icon>
                      Tanggal Kejadian
                    </div>
                    <div class="detail-value">{{ formatIncidentDate(report.date) }}</div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <v-icon left color="indigo">mdi-account-group</v-icon>
                      Hubungan dengan Pelaku
                    </div>
                    <div class="detail-value">{{ report.relationWithPerpetrator }}</div>
                  </div>
                </div>

                <div class="hash-section">
                  <div class="hash-label">
                    <v-icon left color="grey">mdi-fingerprint</v-icon>
                    Hash Laporan
                  </div>
                  <div class="hash-display">
                    <code class="hash-text">{{ report.reportHash }}</code>
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      @click="copyHash(report.reportHash)"
                      class="copy-btn"
                    >
                      <v-icon size="16">mdi-content-copy</v-icon>
                    </v-btn>
                  </div>
                </div>

                <div class="verification-info">
                  <v-alert
                    type="info"
                    variant="tonal"
                    border="left"
                    class="info-alert"
                  >
                    
                    Laporan ini telah diverifikasi dan tersimpan di blockchain. Data tidak dapat dimanipulasi atau diubah.
                  </v-alert>
                </div>
              </div>
            </div>
          </div>

          <div class="info-section" v-else>
            <div class="info-card">
              <h3 class="info-title">Cara Verifikasi Laporan</h3>
              <div class="info-steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>Masukkan Hash</h4>
                    <p>Copy hash laporan yang ingin diverifikasi ke dalam form di atas</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>Klik Verifikasi</h4>
                    <p>Klik tombol verifikasi untuk memeriksa keaslian laporan</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>Lihat Hasil</h4>
                    <p>Detail laporan akan ditampilkan jika hash valid</p>
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
import { ref } from 'vue';
import apiService from '../services/api.service';

export default {
  name: 'VerifyReport',
  setup() {
    const reportHash = ref('');
    const report = ref(null);
    const error = ref('');
    const loading = ref(false);

    const verifyReport = async () => {
      if (!reportHash.value.trim()) {
        error.value = 'Hash laporan harus diisi';
        return;
      }

      loading.value = true;
      error.value = '';
      report.value = null;

      try {
        const data = await apiService.verifyReport(reportHash.value);
        report.value = data;
      } catch (err) {
        error.value = err.message || 'Gagal memverifikasi laporan';
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

    const clearError = () => {
      error.value = '';
      report.value = null;
    };

    return {
      reportHash,
      report,
      error,
      loading,
      verifyReport,
      formatIncidentDate,
      formatSubmitDate,
      copyHash,
      clearError
    };
  }
};
</script>

<style scoped>
.verify-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.verify-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-animation {
  position: absolute;
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 8s ease-in-out infinite;
}

.circle-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}

.circle-3 {
  width: 80px;
  height: 80px;
  top: 40%;
  left: 60%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.1); }
}

.verify-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
}

.verify-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.verify-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-icon {
  margin-bottom: 20px;
}

.verify-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}

.verify-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 500px;
  margin: 0 auto;
}

.verify-body {
  max-width: 800px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 40px;
}

.search-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 30px;
  border: 2px solid #e2e8f0;
}

.search-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.search-input-group {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.search-input {
  flex: 1;
  border-radius: 12px;
}

.search-btn {
  border-radius: 12px;
  font-weight: 600;
  padding: 15px 30px;
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  color: white !important;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.result-section {
  margin-bottom: 40px;
}

.error-card, .success-card {
  border-radius: 20px;
  padding: 40px;
  text-align: center;
}

.error-card {
  background: #fef2f2;
  border: 2px solid #fecaca;
}

.error-icon {
  margin-bottom: 20px;
}

.error-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 10px;
}

.error-message {
  color: #7f1d1d;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.retry-btn {
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
}

.success-card {
  background: #f0fdf4;
  border: 2px solid #bbf7d0;
}

.success-header {
  margin-bottom: 30px;
}

.success-icon {
  margin-bottom: 20px;
}

.success-badge {
  margin-bottom: 20px;
}

.report-details {
  text-align: left;
}

.details-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 25px;
  text-align: center;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  background: white;
  border-radius: 15px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.detail-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1e293b;
}

.hash-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.hash-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 10px;
}

.hash-display {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #e2e8f0;
}

.hash-text {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #64748b;
  word-break: break-all;
  flex: 1;
}

.copy-btn {
  flex-shrink: 0;
}

.verification-info {
  margin-top: 20px;
}

.info-alert {
  border-radius: 12px;
  font-size: 1rem;
}

.info-section {
  margin-top: 40px;
}

.info-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #e2e8f0;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 25px;
  text-align: center;
}

.info-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.step-number {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 5px;
}

.step-content p {
  color: #64748b;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .verify-card {
    padding: 30px 20px;
  }
  
  .verify-title {
    font-size: 2rem;
  }
  
  .search-input-group {
    flex-direction: column;
    gap: 15px;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .info-steps {
    grid-template-columns: 1fr;
  }
}
</style> 