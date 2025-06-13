<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="mt-5">
          <v-card-title class="text-center text-h5 py-4">
            Login Admin
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4 text-center">
              Silakan hubungkan wallet MetaMask Anda untuk mengakses halaman admin.
            </p>
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
            >
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              @click="connectWallet"
              :loading="loading"
            >
              Hubungkan MetaMask
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import blockchainService from '../services/blockchain.service';
import apiService from '../services/api.service';

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');

    const connectWallet = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const address = await blockchainService.connectWallet();
        localStorage.setItem('adminWallet', address);
        apiService.setAdminHeader(address);
        router.push({ name: 'ReportList' });
      } catch (err) {
        error.value = err.message || 'Failed to connect wallet';
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      connectWallet
    };
  }
};
</script> 