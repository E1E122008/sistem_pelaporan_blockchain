<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="gradient-text">Sistem Pelaporan Kekerasan</span>
            <br>Berbasis Blockchain
          </h1>
          <p class="hero-subtitle">
            Platform aman dan transparan untuk melaporkan kasus kekerasan dengan teknologi blockchain yang terjamin keasliannya.
          </p>
        </div>
        <div class="hero-stats">
          <div class="stat-card">
            <div class="stat-number">100%</div>
            <div class="stat-label">Aman & Terenkripsi</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Tersedia</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">∞</div>
            <div class="stat-label">Transparan</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Layanan Kami</h2>
        <div class="features-grid">
          <div class="feature-card" @click="$router.push({ name: 'ReportForm' })">
            <div class="feature-icon">
              <v-icon size="48" color="primary">mdi-shield-account</v-icon>
            </div>
            <h3>Buat Laporan Baru</h3>
            <p>Laporkan kasus kekerasan dengan aman dan terjamin kerahasiaannya</p>
            <div class="feature-action">
              <v-btn color="primary" variant="outlined" class="mt-4">
                Mulai Laporan
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="feature-card" @click="$router.push({ name: 'VerifyReport' })">
            <div class="feature-icon">
              <v-icon size="48" color="success">mdi-file-search-outline</v-icon>
            </div>
            <h3>Verifikasi Laporan</h3>
            <p>Periksa keaslian dan validitas laporan yang telah disubmit</p>
            <div class="feature-action">
              <v-btn color="success" variant="outlined" class="mt-4">
                Verifikasi
                <v-icon right>mdi-magnify</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="feature-card" @click="$router.push({ name: 'AdminLogin' })">
            <div class="feature-icon">
              <v-icon size="48" color="info">mdi-account-key</v-icon>
            </div>
            <h3>Akses Admin</h3>
            <p>Kelola dan pantau semua laporan dengan akses khusus admin</p>
            <div class="feature-action">
              <v-btn color="info" variant="outlined" class="mt-4">
                Login Admin
                <v-icon right>mdi-login</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="info-section">
      <div class="container">
        <div class="info-content">
          <div class="info-text">
            <h2>Mengapa Memilih Sistem Kami?</h2>
            <div class="info-points">
              <div class="info-point">
                <v-icon color="primary" class="mr-3">mdi-shield-check</v-icon>
                <span>Keamanan maksimal dengan teknologi blockchain</span>
              </div>
              <div class="info-point">
                <v-icon color="success" class="mr-3">mdi-eye-off</v-icon>
                <span>Kerahasiaan terjamin, data tidak bisa dimanipulasi</span>
              </div>
              <div class="info-point">
                <v-icon color="warning" class="mr-3">mdi-clock-fast</v-icon>
                <span>Proses cepat dan real-time</span>
              </div>
              <div class="info-point">
                <v-icon color="info" class="mr-3">mdi-account-group</v-icon>
                <span>Dapat diakses oleh semua kalangan</span>
              </div>
            </div>
          </div>
          <div class="info-visual">
            <div class="blockchain-visual">
              <div class="block">Block 1</div>
              <div class="chain">🔗</div>
              <div class="block">Block 2</div>
              <div class="chain">🔗</div>
              <div class="block">Block 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  padding: 80px 20px;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 60px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-10px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

.features-section {
  padding: 80px 20px;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 60px;
  color: #1e293b;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1e293b;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.info-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
}

.info-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.info-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
}

.info-points {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-point {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.blockchain-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.block {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 15px;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.chain {
  font-size: 1.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .info-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .blockchain-visual {
    flex-direction: column;
  }
}
</style> 