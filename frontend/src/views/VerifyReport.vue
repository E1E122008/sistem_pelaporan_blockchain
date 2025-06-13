<template>
  <v-container class="verify-bg" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mt-10 mx-auto pa-8 verify-card" max-width="520" elevation="12">
          <v-card-title class="text-center text-h4 font-weight-bold mb-2 verify-title">
            <v-icon left color="primary" size="36">mdi-file-search-outline</v-icon>
            Verifikasi Bukti Laporan
          </v-card-title>
          <v-divider class="mb-6"></v-divider>
          <v-card-text>
            <p class="text-body-1 mb-4 text-center">
              Masukkan hash dari bukti laporan untuk memverifikasi keasliannya.
            </p>

            <v-form @submit.prevent="verifyHash" ref="form">
              <v-text-field
                v-model="hash"
                label="Hash Bukti"
                prepend-inner-icon="mdi-key"
                required
                :rules="[v => !!v || 'Hash harus diisi']"
                class="mb-4"
                variant="outlined"
                color="primary"
              ></v-text-field>

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

              <v-alert
                v-if="verificationResult !== null"
                :type="verificationResult ? 'success' : 'warning'"
                class="mb-4 soft-alert"
                border="left"
                elevation="2"
              >
                <v-icon left v-if="verificationResult">mdi-check-circle</v-icon>
                <v-icon left v-else>mdi-alert</v-icon>
                {{ verificationResult 
                  ? 'Bukti valid dan terdaftar dalam sistem' 
                  : 'Bukti tidak ditemukan dalam sistem' 
                }}
              </v-alert>

              <div class="d-flex justify-center mt-6">
                <v-btn
                  color="primary"
                  class="gradient-btn"
                  type="submit"
                  :loading="loading"
                  size="x-large"
                  elevation="6"
                  style="border-radius: 10px; font-weight: 700; letter-spacing: 1px; min-width: 200px;"
                >
                  <v-icon left>mdi-magnify</v-icon>
                  Verifikasi
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import apiService from '../services/api.service';

export default {
  name: 'VerifyReport',
  setup() {
    const form = ref(null);
    const hash = ref('');
    const loading = ref(false);
    const error = ref('');
    const verificationResult = ref(null);

    const verifyHash = async () => {
      const { valid } = await form.value.validate();
      
      if (!valid) return;

      loading.value = true;
      error.value = '';
      verificationResult.value = null;

      try {
        const { exists } = await apiService.verifyReport(hash.value);
        verificationResult.value = exists;
      } catch (err) {
        error.value = err.message || 'Gagal memverifikasi bukti';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      hash,
      loading,
      error,
      verificationResult,
      verifyHash
    };
  }
};
</script>

<style scoped>
.verify-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  padding-top: 40px;
  padding-bottom: 40px;
}
.verify-card {
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.12);
  background: #fff;
}
.verify-title {
  color: #1e293b;
  letter-spacing: 1px;
}
.gradient-btn {
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%) !important;
  color: #fff !important;
  transition: box-shadow 0.2s;
}
.gradient-btn:hover {
  box-shadow: 0 4px 20px 0 #2563eb33;
}
.soft-alert {
  border-radius: 8px;
  font-size: 1.05rem;
}
</style> 