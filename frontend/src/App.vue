<script>
import { ref, onMounted, onUnmounted } from 'vue';
import blockchainService from './services/blockchain.service';

export default {
  name: 'App',
  setup() {
    const loading = ref(false);
    const connecting = ref(false);
    const walletAddress = ref('');
    const isScrolled = ref(false);

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
    };

    const connectWallet = async () => {
      if (walletAddress.value) return;
      
      connecting.value = true;
      try {
        const address = await blockchainService.connect();
        walletAddress.value = address;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      } finally {
        connecting.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      
      // Check if wallet is already connected
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress) {
        walletAddress.value = savedAddress;
      }
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      loading,
      connecting,
      walletAddress,
      isScrolled,
      connectWallet
    };
  }
};
</script>

<template>
  <v-app>
    <!-- Navigation Header -->
    <v-app-bar
      app
      elevation="0"
      class="modern-navbar"
      :class="{ 'navbar-scrolled': isScrolled }"
    >
      <div class="navbar-content">
        <div class="navbar-brand" @click="$router.push({ name: 'Home' })">
          <v-icon size="32" color="primary" class="mr-3">mdi-shield-account</v-icon>
          <span class="brand-text">Sistem Pelaporan Kekerasan</span>
        </div>
        
        <div class="navbar-menu">
          <v-btn
            variant="text"
            @click="$router.push({ name: 'Home' })"
            class="nav-btn"
            :class="{ 'active': $route.name === 'Home' }"
          >
            <v-icon left>mdi-home</v-icon>
            Beranda
          </v-btn>
          
          <v-btn
            variant="text"
            @click="$router.push({ name: 'ReportForm' })"
            class="nav-btn"
            :class="{ 'active': $route.name === 'ReportForm' }"
          >
            <v-icon left>mdi-plus-circle</v-icon>
            Buat Laporan
          </v-btn>
          
          <v-btn
            variant="text"
            @click="$router.push({ name: 'VerifyReport' })"
            class="nav-btn"
            :class="{ 'active': $route.name === 'VerifyReport' }"
          >
            <v-icon left>mdi-magnify</v-icon>
            Verifikasi
          </v-btn>
          
          <v-btn
            variant="text"
            @click="$router.push({ name: 'AdminLogin' })"
            class="nav-btn"
            :class="{ 'active': $route.name === 'AdminLogin' }"
          >
            <v-icon left>mdi-file-document-outline</v-icon>
            Daftar Laporan
          </v-btn>
        </div>
        
        <div class="navbar-actions">
          <v-btn
            color="primary"
            variant="elevated"
            @click="$router.push({ name: 'ReportList' })"
            class="connect-btn"
          >
            <v-icon left>mdi-wallet</v-icon>
            {{ walletAddress ? 'Connected' : 'Not Connected' }}
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer class="modern-footer" style="display: flex; justify-content: center; align-items: center; min-height: 56px;">
      <div class="footer-bottom" style="width:100%; display: flex; justify-content: center; align-items: center;">
        <p style="margin: 0; text-align: center;">&copy; 2025 – Sistem Pelaporan Kekerasan Berbasis Blockchain</p>
      </div>
    </v-footer>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
/* Navigation Styles */
.modern-navbar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease !important;
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-menu {
  display: flex;
  gap: 10px;
}

.nav-btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  color: #64748b !important;
}

.nav-btn:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  color: #667eea !important;
  transform: translateY(-2px) !important;
}

.nav-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  color: white !important;
}

.connect-btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  color: white !important;
  transition: all 0.3s ease !important;
}

.connect-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
}

/* Main Content */
.main-content {
  background: #f8fafc !important;
  min-height: calc(100vh - 140px) !important;
}

/* Footer Styles */
.modern-footer {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
  color: white !important;
  padding: 40px 20px 20px 20px !important;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 30px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 20px;
}

.footer-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #e2e8f0;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  font-size: 0.9rem;
}

.footer-divider {
  border-color: rgba(255, 255, 255, 0.1) !important;
  margin: 20px 0 !important;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 600;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 15px;
    padding: 10px 20px;
  }
  
  .navbar-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .brand-text {
    font-size: 1rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .navbar-menu {
    flex-direction: column;
    width: 100%;
  }
  
  .nav-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
