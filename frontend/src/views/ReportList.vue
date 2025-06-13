<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="mt-5">
          <v-card-title class="text-center text-h5 py-4">
            Daftar Laporan Kekerasan
          </v-card-title>
          
          <v-card-text>
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
            >
              {{ error }}
            </v-alert>

            <div class="d-flex justify-end mb-4">
              <v-btn
                color="error"
                variant="outlined"
                @click="logout"
              >
                Logout
              </v-btn>
            </div>

            <v-table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Jenis Kekerasan</th>
                  <th>Lokasi</th>
                  <th>Tanggal</th>
                  <th>Hash Bukti</th>
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
                <tr v-else v-for="(report, index) in reports" :key="report.fileHash">
                  <td>{{ index + 1 }}</td>
                  <td>{{ report.violenceType }}</td>
                  <td>{{ report.location }}</td>
                  <td>{{ formatDate(report.date) }}</td>
                  <td class="text-truncate" style="max-width: 200px;">
                    {{ report.fileHash }}
                  </td>
                </tr>
              </tbody>
            </v-table>
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