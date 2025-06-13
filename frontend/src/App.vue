<script>
export default {
  name: 'App'
};
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none text-white">
          Sistem Pelaporan Kekerasan
        </router-link>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        :to="{ name: 'Home' }"
        variant="text"
        class="text-white"
      >
        Beranda
      </v-btn>
      <v-btn
        :to="{ name: 'ReportForm' }"
        variant="text"
        class="text-white"
      >
        Buat Laporan
      </v-btn>
      <v-btn
        :to="{ name: 'VerifyReport' }"
        variant="text"
        class="text-white"
      >
        Verifikasi
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app class="d-flex flex-column">
      <div class="text-center w-100 py-2">
        &copy; {{ new Date().getFullYear() }} — Sistem Pelaporan Kekerasan Berbasis Blockchain
  </div>
    </v-footer>
  </v-app>
</template>

<style>
.text-decoration-none {
  text-decoration: none;
}
</style>
