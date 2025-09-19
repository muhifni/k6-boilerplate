/* eslint-disable prettier/prettier */
import { check } from 'k6';
import ResponseCodes from './types/ResponseCodes';
import { get } from './helpers/Http';


export const options = {
  vus: 3,
  duration: '1s',
  // iterations: 1,
  cloud: {
    // Project: Default project
    projectID: 3701667,
    // Test runs with the same name groups test runs together.
    name: 'Test (18/06/2024-10:22:01)'
  }
};

export default async function () {
  const response = await get({
    // Note this can also be set as a env variable and then you do not have to specify it
    baseUrl: 'https://test-api.k6.io',
    path: '/public/crocodiles/',
  });

  check(response, {
    'Check correct response code': (r) => r.status === ResponseCodes.OK,
  });
}
