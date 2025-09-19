import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 15 }, // Naikkan user hingga 10 dalam 5 detik
        { duration: '10s', target: 30 }, // Tetap di 10 user selama 10 detik
        { duration: '5s', target: 0 },  // Turunkan user ke 0 dalam 5 detik
    ],
};

export default function() {
  let res = http.get('https://bootcamp.ciput.fun');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}
