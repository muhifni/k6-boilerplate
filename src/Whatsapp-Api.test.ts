/* eslint-disable prettier/prettier */
import { check } from 'k6';
import ResponseCodes from './types/ResponseCodes';
import { get } from './helpers/Http';


export const options = {
  discardResponseBodies: true,

  scenarios: {
    contacts: {
      executor: 'ramping-arrival-rate',

      // Start iterations per `timeUnit`
      startRate: 10,

      // Start `startRate` iterations per minute
      timeUnit: '1m',

      // Pre-allocate necessary VUs.
      preAllocatedVUs: 100,

      stages: [
        // Start 300 iterations per `timeUnit` for the first minute.
        { target: 30, duration: '1m' },

        // Linearly ramp-up to starting 600 iterations per `timeUnit` over the following two minutes.
        { target: 60, duration: '2m' },

        // Continue starting 600 iterations per `timeUnit` for the following four minutes.
        { target: 100, duration: '4m' },

        // Linearly ramp-down to starting 60 iterations per `timeUnit` over the last two minutes.
        { target: 60, duration: '2m' },
      ],
    },
  },

  cloud: {
    projectID: 3701667,
    name: 'Test (18/06/2024-10:22:01)'
  }
};

export default async function () {
  const response = await get({
    // Note this can also be set as a env variable and then you do not have to specify it
    baseUrl: 'http://138.2.80.47:3112',
    path: '/',
  });

  check(response, {
    'Check correct response code': (r) => r.status === ResponseCodes.OK,
  }); 
}
