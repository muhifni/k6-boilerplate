import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfigurasi pengujian stress
export let options = {
    stages: [
        { duration: '1m', target: 20 },   // Naikkan user hingga 20 dalam 1 menit
        { duration: '3m', target: 50 },   // Naikkan user hingga 50 dalam 3 menit
        { duration: '1m', target: 100 },  // Spike ke 100 user dalam 1 menit
        { duration: '2m', target: 50 },   // Turunkan kembali ke 50 user dalam 2 menit
        { duration: '1m', target: 0 },    // Turunkan ke 0 user dalam 1 menit
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% request harus di bawah 500ms
        http_req_failed: ['rate<0.1'],    // Error rate harus di bawah 10%
    },
};

// Fungsi utama yang akan dijalankan oleh setiap virtual user
export default function () {
    let baseUrl = 'https://bootcamp.ciput.fun';

    // Simulasi user membuka halaman login
    let loginPage = http.get(`${baseUrl}/login`);

    // Cek apakah halaman login berhasil dimuat dan response time sesuai
    check(loginPage, {
        'login page loads': (r) => r.status === 200,
        'response time OK': (r) => r.timings.duration < 1000,
    });

    // Daftar user dummy untuk pengujian login
    let users = [
        {
            email: "admin@simpeja.com",
            password: "admin123"
        },
        {
            email: "user@simpeja.com",
            password: "user1234"
        },
        {
            email: "belajar@cypress.com",
            password: "belajar123"
        }
    ];

    // Pilih user secara acak dari daftar
    let randomUser = users[Math.floor(Math.random() * users.length)];

    // Simulasi user melakukan login dengan data acak
    let loginAttempt = http.post(`${baseUrl}/login`, randomUser);

    // Cek apakah request login berhasil dikirim
    check(loginAttempt, {
        'login attempt made': (r) => r.status !== 0,
    });

    // Tunggu antara 1-3 detik sebelum melakukan aksi berikutnya (simulasi user delay)
    sleep(Math.random() * 2 + 1);
}