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
                <div class="header-cell">Hubungan dengan Pelaku</div>
                <div class="header-cell">Hash Laporan</div>
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
                      {{ formatDate(report.date) }}
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

    const formatDate = (timestamp) => {
      return new Date(parseInt(timestamp)).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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

    onMounted(() => {
      fetchReports();
    });

    return {
      loading,
      error,
      reports,
      formatDate,
      copyHash,
      logout
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
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.loading-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-text {
  margin-top: 20px;
  color: #64748b;
  font-size: 1.1rem;
}

.empty-container h3 {
  margin: 20px 0 10px 0;
  color: #1e293b;
  font-size: 1.5rem;
}

.empty-container p {
  color: #64748b;
  font-size: 1rem;
}

.reports-table {
  background: white;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr 1fr 2fr;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-weight: 600;
}

.header-cell {
  padding: 10px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr 1fr 2fr;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f8fafc;
  transform: translateX(5px);
}

.table-cell {
  padding: 10px;
  display: flex;
  align-items: center;
}

.violence-type, .location, .date, .relation {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.hash-cell {
  max-width: 100%;
}

.hash-content {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.hash-text {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #64748b;
  word-break: break-all;
  flex: 1;
}

.copy-btn {
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .table-header, .table-row {
    grid-template-columns: 60px 1fr 1fr 1fr 1fr 1.5fr;
    gap: 15px;
  }
  
  .header-cell, .table-cell {
    padding: 8px;
    font-size: 0.85rem;
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