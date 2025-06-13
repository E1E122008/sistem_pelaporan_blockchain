<template>
  <v-container class="report-bg" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mt-10 mx-auto pa-8 report-card" max-width="520" elevation="12">
          <v-card-title class="text-center text-h4 font-weight-bold mb-2 report-title">
            <v-icon left color="primary" size="36">mdi-shield-account</v-icon>
            Form Pelaporan Kekerasan
          </v-card-title>
          <v-divider class="mb-6"></v-divider>
          <v-card-text>
            <v-form @submit.prevent="submitReport" ref="form">
              <v-select
                v-model="formData.violenceType"
                :items="violenceTypes"
                label="Jenis Kekerasan"
                prepend-inner-icon="mdi-alert-octagon"
                required
                :rules="[v => !!v || 'Jenis kekerasan harus dipilih']"
                class="mb-4"
                variant="outlined"
                color="primary"
              ></v-select>

              <v-text-field
                v-if="formData.violenceType === 'Lainnya'"
                v-model="formData.violenceTypeOther"
                label="Jenis Kekerasan (Lainnya)"
                prepend-inner-icon="mdi-pencil"
                required
                :rules="[v => !!v || 'Jenis kekerasan harus diisi']"
                class="mb-4"
                variant="outlined"
                color="primary"
              />

              <v-text-field
                v-model="formData.location"
                label="Lokasi Kejadian"
                prepend-inner-icon="mdi-map-marker"
                required
                :rules="[v => !!v || 'Lokasi harus diisi']"
                class="mb-4"
                variant="outlined"
                color="primary"
              ></v-text-field>

              <v-text-field
                v-model="formData.date"
                label="Tanggal Kejadian"
                type="date"
                prepend-inner-icon="mdi-calendar"
                required
                :rules="[v => !!v || 'Tanggal harus diisi']"
                class="mb-4"
                variant="outlined"
                color="primary"
              ></v-text-field>

              <v-file-input
                v-model="formData.file"
                label="Upload Bukti (PDF, Gambar, atau Video)"
                prepend-icon="mdi-paperclip"
                accept=".pdf,image/*,video/*"
                :rules="[
                  v => !v || v.size < 20000000 || 'File harus kurang dari 20MB'
                ]"
                class="mb-4"
                variant="outlined"
                color="primary"
                show-size
                chips
              ></v-file-input>

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
                v-if="success"
                type="success"
                class="mb-4 soft-alert"
                border="left"
                elevation="2"
              >
                <v-icon left>mdi-check-circle</v-icon>
                {{ success }}
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
                  <v-icon left>mdi-send</v-icon>
                  Submit Laporan
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
import { ref, reactive } from 'vue';
import apiService from '../services/api.service';

export default {
  name: 'ReportForm',
  setup() {
    const form = ref(null);
    const loading = ref(false);
    const error = ref('');
    const success = ref('');

    const formData = reactive({
      violenceType: '',
      violenceTypeOther: '',
      location: '',
      date: '',
      file: null
    });

    const violenceTypes = [
      'Kekerasan Fisik',
      'Kekerasan Verbal',
      'Kekerasan Seksual',
      'Kekerasan Psikologis',
      'Kekerasan Ekonomi',
      'Lainnya'
    ];

    const submitReport = async () => {
      const { valid } = await form.value.validate();
      
      if (!valid) return;

      loading.value = true;
      error.value = '';
      success.value = '';

      try {
        const formDataToSend = new FormData();
        formDataToSend.append(
          'violenceType',
          formData.violenceType === 'Lainnya' ? formData.violenceTypeOther : formData.violenceType
        );
        formDataToSend.append('location', formData.location);
        formDataToSend.append('date', formData.date);
        
        if (formData.file) {
          formDataToSend.append('file', formData.file);
        }

        const response = await apiService.submitReport(formDataToSend);
        success.value = 'Laporan berhasil dikirim. Hash bukti: ' + response.fileHash;
        
        // Reset form
        form.value.reset();
        Object.keys(formData).forEach(key => formData[key] = '');
      } catch (err) {
        error.value = err.message || 'Gagal mengirim laporan';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      formData,
      violenceTypes,
      loading,
      error,
      success,
      submitReport
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