<template>
  <v-container class="report-bg" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="mt-10 mx-auto pa-8 report-card" max-width="1100" elevation="12">
          <v-card-title class="text-center text-h4 font-weight-bold mb-2 report-title">
            <v-icon left color="primary" size="36">mdi-format-list-bulleted-square</v-icon>
            Daftar Laporan Kekerasan
          </v-card-title>
          <v-divider class="mb-6"></v-divider>
          <v-card-text>
            <v-alert
              v-if="error"
              type="error"
              class="mb-4 soft-alert"
              border="left"
              elevation="2"
            >
              <v-icon left>mdi-alert-circle</v-icon>
              {{ error }}
            </v-alert>

            <div class="d-flex justify-end mb-4">
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

            <div class="table-responsive">
              <v-table class="modern-table" density="comfortable">
                <thead>
                  <tr>
                    <th style="width: 60px;">No.</th>
                    <th style="width: 220px;">Jenis Kekerasan</th>
                    <th style="width: 180px;">Lokasi</th>
                    <th style="width: 180px;">Tanggal</th>
                    <th style="min-width: 320px;">Hash Bukti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading" class="text-center">
                    <td colspan="5">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </td>
                  </tr>
                  <tr v-else-if="reports.length === 0">
                    <td colspan="5" class="text-center">
                      Belum ada laporan
                    </td>
                  </tr>
                  <tr v-else v-for="(report, index) in reports" :key="report.fileHash" class="table-row">
                    <td><v-chip color="primary" variant="tonal">{{ index + 1 }}</v-chip></td>
                    <td><v-icon left small color="deep-orange">mdi-alert-octagon</v-icon> {{ report.violenceType }}</td>
                    <td><v-icon left small color="blue">mdi-map-marker</v-icon> {{ report.location }}</td>
                    <td><v-icon left small color="green">mdi-calendar</v-icon> {{ formatDate(report.date) }}</td>
                    <td class="hash-cell">
                      {{ report.fileHash }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
      logout
    };
  }
};
</script>

<style scoped>
.report-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  padding-top: 40px;
  padding-bottom: 40px;
}
.report-card {
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.12);
  background: #fff;
}
.report-title {
  color: #1e293b;
  letter-spacing: 1px;
}
.soft-alert {
  border-radius: 8px;
  font-size: 1.05rem;
}
.logout-btn {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 1px;
}
.modern-table {
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  box-shadow: 0 2px 8px 0 #2563eb11;
  min-width: 900px;
}
.table-row:hover {
  background: #e0e7ff44;
  transition: background 0.2s;
}
.table-responsive {
  width: 100%;
  overflow-x: auto;
}
.hash-cell {
  max-width: 400px;
  white-space: normal;
  word-break: break-all;
}
</style> 