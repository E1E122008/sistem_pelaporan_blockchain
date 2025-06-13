<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mt-5">
          <v-card-title class="text-center text-h4 py-4">
            Sistem Pelaporan Kekerasan Berbasis Blockchain
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-body-1 mb-4">
              Sistem ini bertujuan untuk memberikan mekanisme pelaporan kekerasan yang aman, 
              transparan, dan terjamin keasliannya melalui teknologi blockchain.
            </p>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              :to="{ name: 'ReportForm' }"
              class="mx-2"
            >
              Buat Laporan Baru
            </v-btn>
            <v-btn
              color="secondary"
              variant="elevated"
              size="large"
              :to="{ name: 'VerifyReport' }"
              class="mx-2"
            >
              Verifikasi Laporan
            </v-btn>
            <v-btn
              color="info"
              variant="elevated"
              size="large"
              :to="{ name: 'AdminLogin' }"
              class="mx-2"
            >
              Login Admin
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home'
}
</script> 