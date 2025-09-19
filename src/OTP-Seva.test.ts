import http from 'k6/http';
import { check } from 'k6';
import ResponseCodes from './types/ResponseCodes';

export const options = {
  cloud: {
    projectID: 3711250,
    name: 'Test (27/08/2024-14:28:31)',
    distribution: {
      'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
    },
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 10, duration: '15s' },
        { target: 10, duration: '15s' },
        { target: 0, duration: '15s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
    Scenario_2: {
      executor: 'constant-arrival-rate',
      rate: 2,
      timeUnit: '30s',
      duration: '120s',
      preAllocatedVUs: 4,
      maxVUs: 10,
      exec: 'scenario_2',
    },
  },
};

let url = 'https://api.sevaio.xyz/auth/otp';
let headers = {
  accept: 'application/json, text/plain, /',
  'content-type': 'application/json',
  referer: 'https://dev.sevaio.xyz/masuk-akun',
};
let data = {
  phoneNumber: '+6285292478852',
};

export function scenario_1() {
  let res = http.post(url, JSON.stringify(data), { headers: headers });

  check(res, {
    'status is 200': (r) => r.status === ResponseCodes.OK,
    'verify message is OTP Sent Success': (r) =>
      JSON.parse(r.body).message === 'OTP Sent Success',
    // 'log': (r) => console.log(r),
  });
}

export function scenario_2() {
  let res = http.post(url, JSON.stringify(data), { headers: headers });

  check(res, {
    'status was 200': (r) => r.status === 200,
    'rate limit hit': (r) => r.status === 429,  // 429 biasanya adalah status code untuk rate limit
  });
}
