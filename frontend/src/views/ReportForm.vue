<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mt-5">
          <v-card-title class="text-center text-h5 py-4">
            Form Pelaporan Kekerasan
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitReport" ref="form">
              <v-select
                v-model="formData.violenceType"
                :items="violenceTypes"
                label="Jenis Kekerasan"
                required
                :rules="[v => !!v || 'Jenis kekerasan harus dipilih']"
              ></v-select>

              <v-text-field
                v-if="formData.violenceType === 'Lainnya'"
                v-model="formData.violenceTypeOther"
                label="Jenis Kekerasan (Lainnya)"
                required
                :rules="[v => !!v || 'Jenis kekerasan harus diisi']"
              />

              <v-text-field
                v-model="formData.location"
                label="Lokasi Kejadian"
                required
                :rules="[v => !!v || 'Lokasi harus diisi']"
              ></v-text-field>

              <v-text-field
                v-model="formData.date"
                label="Tanggal Kejadian"
                type="date"
                required
                :rules="[v => !!v || 'Tanggal harus diisi']"
              ></v-text-field>

              <v-file-input
                v-model="formData.file"
                label="Upload Bukti (PDF, Gambar, atau Video)"
                accept=".pdf,image/*,video/*"
                :rules="[
                  v => !v || v.size < 20000000 || 'File harus kurang dari 20MB'
                ]"
              ></v-file-input>

              <v-alert
                v-if="error"
                type="error"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <v-alert
                v-if="success"
                type="success"
                class="mb-4"
              >
                {{ success }}
              </v-alert>

              <div class="d-flex justify-center mt-4">
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  size="large"
                >
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