<template>
  <div class="form-container">
    <div class="form-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    
    <div class="form-content">
      <div class="form-card">
        <div class="form-header">
          <div class="header-icon">
            <v-icon size="48" color="primary">mdi-shield-account</v-icon>
          </div>
          <h1 class="form-title">Form Pelaporan Kekerasan</h1>
          <p class="form-subtitle">Laporkan kasus kekerasan dengan aman dan terjamin kerahasiaannya</p>
        </div>

        <v-form @submit.prevent="submitReport" ref="form" class="form-body">
          <div class="form-grid">
            <div class="form-column">
              <div class="input-group">
                <label class="input-label">Jenis Kekerasan</label>
                <v-select
                  v-model="formData.violenceType"
                  :items="violenceTypes"
                  placeholder="Pilih jenis kekerasan"
                  prepend-inner-icon="mdi-alert-octagon"
                  required
                  :rules="[v => !!v || 'Jenis kekerasan harus dipilih']"
                  variant="outlined"
                  color="primary"
                  class="modern-input"
                ></v-select>
              </div>

              <div class="input-group" v-if="formData.violenceType === 'Lainnya'">
                <label class="input-label">Jenis Kekerasan (Lainnya)</label>
                <v-text-field
                  v-model="formData.violenceTypeOther"
                  placeholder="Jelaskan jenis kekerasan lainnya"
                  prepend-inner-icon="mdi-pencil"
                  required
                  :rules="[v => !!v || 'Jenis kekerasan harus diisi']"
                  variant="outlined"
                  color="primary"
                  class="modern-input"
                />
              </div>

              <div class="input-group">
                <label class="input-label">Lokasi Kejadian</label>
                <v-text-field
                  v-model="formData.location"
                  placeholder="Masukkan lokasi kejadian"
                  prepend-inner-icon="mdi-map-marker"
                  required
                  :rules="[v => !!v || 'Lokasi harus diisi']"
                  variant="outlined"
                  color="primary"
                  class="modern-input"
                ></v-text-field>
              </div>
            </div>

            <div class="form-column">
              <div class="input-group">
                <label class="input-label">Hubungan dengan Pelaku</label>
                <v-text-field
                  v-model="formData.relationWithPerpetrator"
                  placeholder="Contoh: Pasangan, Keluarga, dll"
                  prepend-inner-icon="mdi-account-group"
                  required
                  :rules="[v => !!v || 'Hubungan harus diisi']"
                  variant="outlined"
                  color="primary"
                  class="modern-input"
                ></v-text-field>
              </div>

              <div class="input-group">
                <label class="input-label">Tanggal Kejadian</label>
                <v-text-field
                  v-model="formData.date"
                  type="date"
                  placeholder="Pilih tanggal kejadian"
                  prepend-inner-icon="mdi-calendar"
                  required
                  :rules="[v => !!v || 'Tanggal harus diisi']"
                  variant="outlined"
                  color="primary"
                  class="modern-input"
                ></v-text-field>
              </div>
            </div>
          </div>

          <div class="identity-section">
            <v-alert type="info" variant="tonal" border="left" class="modern-alert mb-4">
              Data Anda aman, hanya digunakan untuk verifikasi/tindak lanjut. (Opsional)
            </v-alert>
            <div class="identity-fields">
              <v-text-field
                v-model="formData.reporterName"
                label="Nama Pelapor (Opsional)"
                placeholder="Masukkan nama Anda"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="primary"
                class="modern-input mb-3"
              ></v-text-field>
              <v-text-field
                v-model="formData.reporterContact"
                label="Email atau No. HP (Opsional)"
                placeholder="Masukkan email atau nomor HP"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="primary"
                class="modern-input"
              ></v-text-field>
            </div>
          </div>

          <div class="file-upload-section">
            <label class="input-label">Upload Bukti</label>
            <div class="file-upload-card">
              <v-file-input
                v-model="formData.file"
                placeholder="Upload file bukti (PDF, Gambar, atau Video)"
                prepend-icon="mdi-paperclip"
                accept=".pdf,image/*,video/*"
                :rules="[
                  v => !v || v.size < 20000000 || 'File harus kurang dari 20MB'
                ]"
                variant="outlined"
                color="primary"
                show-size
                chips
                class="modern-file-input"
              ></v-file-input>
              <div class="file-info">
                <v-icon color="info" class="mr-2">mdi-information</v-icon>
                <span>Format yang didukung: PDF, JPG, PNG, MP4. Maksimal 20MB</span>
              </div>
            </div>
          </div>

          <div class="form-alerts">
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

            <v-alert
              v-if="success"
              type="success"
              class="modern-alert"
              border="left"
              elevation="2"
            >
              {{ success }}
            </v-alert>
          </div>

          <div class="form-actions">
            <v-btn
              color="primary"
              class="submit-btn"
              type="submit"
              :loading="loading"
              size="x-large"
              elevation="6"
            >
              <v-icon left>mdi-send</v-icon>
              Submit Laporan
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>
  </div>
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
      relationWithPerpetrator: '',
      date: '',
      file: null,
      reporterName: '',
      reporterContact: ''
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
        formDataToSend.append('relationWithPerpetrator', formData.relationWithPerpetrator);
        formDataToSend.append('date', formData.date);
        if (formData.reporterName) formDataToSend.append('reporterName', formData.reporterName);
        if (formData.reporterContact) formDataToSend.append('reporterContact', formData.reporterContact);
        if (formData.file) {
          formDataToSend.append('file', formData.file);
        }

        const response = await apiService.submitReport(formDataToSend);
        success.value = 'Laporan berhasil dikirim. Hash bukti: ' + response.reportHash;
        
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
.form-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.form-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 40%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.form-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-icon {
  margin-bottom: 20px;
}

.form-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}

.form-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 500px;
  margin: 0 auto;
}

.form-body {
  max-width: 1000px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 25px;
}

.input-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 1rem;
}

.modern-input {
  border-radius: 12px;
}

.file-upload-section {
  margin-bottom: 30px;
}

.file-upload-card {
  background: #f8fafc;
  border-radius: 15px;
  padding: 25px;
  border: 2px dashed #cbd5e1;
  transition: all 0.3s ease;
}

.file-upload-card:hover {
  border-color: #667eea;
  background: #f1f5f9;
}

.modern-file-input {
  margin-bottom: 15px;
}

.file-info {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 0.9rem;
}

.form-alerts {
  margin-bottom: 30px;
}

.modern-alert {
  border-radius: 12px;
  font-size: 1rem;
}

.form-actions {
  text-align: center;
}

.submit-btn {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  color: white !important;
  border-radius: 15px;
  font-weight: 600;
  padding: 15px 40px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .form-card {
    padding: 30px 20px;
  }
  
  .form-title {
    font-size: 2rem;
  }
}
</style> 