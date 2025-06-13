<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mt-5">
          <v-card-title class="text-center text-h5 py-4">
            Verifikasi Bukti Laporan
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4 text-center">
              Masukkan hash dari bukti laporan untuk memverifikasi keasliannya.
            </p>

            <v-form @submit.prevent="verifyHash" ref="form">
              <v-text-field
                v-model="hash"
                label="Hash Bukti"
                required
                :rules="[v => !!v || 'Hash harus diisi']"
              ></v-text-field>

              <v-alert
                v-if="error"
                type="error"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <v-alert
                v-if="verificationResult !== null"
                :type="verificationResult ? 'success' : 'warning'"
                class="mb-4"
              >
                {{ verificationResult 
                  ? 'Bukti valid dan terdaftar dalam sistem' 
                  : 'Bukti tidak ditemukan dalam sistem' 
                }}
              </v-alert>

              <div class="d-flex justify-center mt-4">
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  size="large"
                >
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