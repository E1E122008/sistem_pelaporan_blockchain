<template>
  <div class="denied-container">
    <div class="denied-background">
      <div class="error-pattern">
        <div class="error-shape error-shape-1">⚠️</div>
        <div class="error-shape error-shape-2">🚫</div>
        <div class="error-shape error-shape-3">🔒</div>
      </div>
    </div>
    
    <div class="denied-content">
      <div class="denied-card">
        <div class="denied-header">
          <div class="error-icon">
            <v-icon size="80" color="error">mdi-shield-alert</v-icon>
          </div>
          <h1 class="denied-title">Akses Ditolak</h1>
          <p class="denied-subtitle">Maaf, Anda tidak memiliki izin untuk mengakses halaman ini</p>
        </div>

        <div class="denied-body">
          <div class="error-details">
            <div class="detail-item">
              <v-icon color="error" class="mr-3">mdi-alert-circle</v-icon>
              <span>Anda harus login sebagai admin untuk mengakses halaman ini</span>
            </div>
            <div class="detail-item">
              <v-icon color="warning" class="mr-3">mdi-account-key</v-icon>
              <span>Pastikan Anda memiliki kredensial admin yang valid</span>
            </div>
            <div class="detail-item">
              <v-icon color="info" class="mr-3">mdi-information</v-icon>
              <span>Hubungi administrator jika Anda merasa ini adalah kesalahan</span>
            </div>
          </div>

          <div class="action-buttons">
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              @click="$router.push({ name: 'AdminLogin' })"
              class="login-btn"
            >
              <v-icon left>mdi-login</v-icon>
              Login Admin
            </v-btn>
            
            <v-btn
              color="secondary"
              variant="outlined"
              size="large"
              @click="$router.push({ name: 'Home' })"
              class="home-btn"
            >
              <v-icon left>mdi-home</v-icon>
              Kembali ke Beranda
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessDenied'
}
</script>

<style scoped>
.denied-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.denied-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.error-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
}

.error-shape {
  position: absolute;
  font-size: 3rem;
  animation: bounce 3s ease-in-out infinite;
  opacity: 0.3;
}

.error-shape-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.error-shape-2 {
  top: 60%;
  right: 20%;
  animation-delay: 1s;
}

.error-shape-3 {
  top: 40%;
  left: 60%;
  animation-delay: 2s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

.denied-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
}

.denied-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.denied-header {
  margin-bottom: 40px;
}

.error-icon {
  margin-bottom: 20px;
}

.denied-title {
  font-size: 3rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 15px;
}

.denied-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.denied-body {
  max-width: 500px;
  margin: 0 auto;
}

.error-details {
  background: #fef2f2;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  border: 1px solid #fecaca;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1rem;
  color: #7f1d1d;
  line-height: 1.5;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-btn {
  background: linear-gradient(45deg, #dc2626, #991b1b) !important;
  color: white !important;
  border-radius: 15px;
  font-weight: 600;
  padding: 15px 30px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
}

.home-btn {
  border-radius: 15px;
  font-weight: 600;
  padding: 15px 30px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .denied-card {
    padding: 30px 20px;
  }
  
  .denied-title {
    font-size: 2.5rem;
  }
  
  .error-shape {
    display: none;
  }
  
  .action-buttons {
    gap: 10px;
  }
}
</style> 