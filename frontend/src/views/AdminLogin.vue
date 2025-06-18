<template>
  <div class="login-container">
    <div class="login-background">
      <div class="geometric-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
    
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <div class="header-icon">
            <v-icon size="48" color="primary">mdi-account-key</v-icon>
          </div>
          <h1 class="login-title">Akses Daftar Laporan</h1>
          <p class="login-subtitle">Hubungkan wallet MetaMask Anda untuk melihat dan mengelola laporan kekerasan</p>
        </div>

        <div class="login-body">
          <div v-if="!walletConnected" class="connect-section">
            <v-btn
              color="primary"
              class="login-btn"
              @click="connectWallet"
              :loading="loading"
              size="x-large"
              elevation="6"
            >
              <v-icon left>mdi-wallet</v-icon>
              Connect Wallet
            </v-btn>
            <div class="connect-info mt-6">
              <v-alert type="info" variant="tonal" border="left" class="modern-alert">
                
                Anda harus menghubungkan wallet MetaMask untuk mengakses daftar laporan.
              </v-alert>
            </div>
          </div>
          <div v-else class="connected-section">
            <v-alert type="success" variant="tonal" border="left" class="modern-alert mb-6">
              
              Wallet terhubung
            </v-alert>
            <v-btn
              color="primary"
              class="login-btn"
              size="x-large"
              elevation="6"
              @click="goToReportList"
            >
              <v-icon left>mdi-format-list-bulleted-square</v-icon>
              Lihat Daftar Laporan
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import blockchainService from '../services/blockchain.service';

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const walletConnected = ref(false);
    const walletAddress = ref('');

    const checkWallet = async () => {
      try {
        const isConnected = await blockchainService.isConnected();
        if (isConnected) {
          walletConnected.value = true;
          walletAddress.value = await blockchainService.getWalletAddress();
        } else {
          walletConnected.value = false;
          walletAddress.value = '';
        }
      } catch {
        walletConnected.value = false;
        walletAddress.value = '';
      }
    };

    const connectWallet = async () => {
      loading.value = true;
      try {
        const address = await blockchainService.connect();
        walletConnected.value = true;
        walletAddress.value = address;
      } catch (err) {
        walletConnected.value = false;
        walletAddress.value = '';
      } finally {
        loading.value = false;
      }
    };

    const goToReportList = () => {
      router.push({ name: 'ReportList' });
    };

    onMounted(() => {
      checkWallet();
    });

    return {
      loading,
      walletConnected,
      walletAddress,
      connectWallet,
      goToReportList
    };
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.geometric-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  animation: float 10s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  border-radius: 50%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 15%;
  border-radius: 20px;
  animation-delay: 2s;
}

.shape-3 {
  width: 120px;
  height: 120px;
  top: 30%;
  right: 30%;
  border-radius: 50%;
  animation-delay: 4s;
}

.shape-4 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  border-radius: 15px;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-icon {
  margin-bottom: 20px;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 400px;
  margin: 0 auto;
}

.login-body {
  max-width: 400px;
  margin: 0 auto;
}

.connect-section, .connected-section {
  text-align: center;
}

.login-btn {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  color: white !important;
  border-radius: 15px;
  font-weight: 600;
  padding: 15px 40px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.connect-info {
  margin-top: 30px;
}

.modern-alert {
  border-radius: 12px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 2rem;
  }
  
  .shape {
    display: none;
  }
}
</style> 