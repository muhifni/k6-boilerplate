import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfigurasi jumlah virtual user dan durasi pengujian
export let options = {
    vus: 5, // 5 virtual user
    duration: '30s', // Jalankan selama 30 detik
};

export default function() {
    let baseUrl = 'https://bootcamp.ciput.fun';
    
    // Test 1: Memuat halaman login
    let response = http.get(`${baseUrl}/login`);
    
    // Melakukan pengecekan pada response halaman login
    check(response, {
        'status is 200': (r) => r.status === 200, // Status harus 200
        'page title is correct': (r) => r.body.includes('SIMPEJA: Login Page'), // Judul halaman sesuai
        'email input exists': (r) => r.body.includes('data-test="email-input"'), // Input email ada
        'password input exists': (r) => r.body.includes('data-test="password-input"'), // Input password ada
        'login button exists': (r) => r.body.includes('data-test="login-btn"'), // Tombol login ada
    });

    // Test 2: Menguji validasi form dengan field kosong
    let emptyLoginResponse = http.post(`${baseUrl}/login`, {});
    
    // Mengecek apakah form kosong ditangani dengan benar
    check(emptyLoginResponse, {
        'empty form handled': (r) => r.status >= 400 || r.body.includes('error'),
    });

    // Test 3: Menguji login dengan kredensial yang valid
    let validLogin = http.post(`${baseUrl}/login`, {
        email: 'admin@simpeja.com',
        password: 'admin123'
    });

    // Mengecek apakah login valid diproses dengan benar
    check(validLogin, {
        'valid login processed': (r) => r.status === 200 || r.status === 302,
    });

    // Tunggu selama 2 detik sebelum iterasi berikutnya
    sleep(2);
}