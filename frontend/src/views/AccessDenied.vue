<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="mt-5">
          <v-card-title class="text-center text-h5 py-4 text-error">
            Akses Ditolak
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-body-1 mb-4">
              Maaf, Anda tidak memiliki akses ke halaman ini. 
              Halaman ini hanya dapat diakses oleh admin yang terdaftar.
            </p>
            <v-btn
              color="primary"
              :to="{ name: 'Home' }"
              class="mt-4"
            >
              Kembali ke Beranda
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AccessDenied'
}
</script> 