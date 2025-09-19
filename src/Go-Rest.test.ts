/* eslint-disable prettier/prettier */
import { check, group } from 'k6';
import ResponseCodes from './types/ResponseCodes';
import http from 'k6/http';

const URL = 'https://gorest.co.in';
const AuthToken =
  '7542e82536f4133468187912e2917b401d188d3494c73d72f8760df73d21148a';
const ENDPOINT = {
  newUser: '/public/v2/users',
  getUser: '/public/v2/users',
  getUserDetail: '/public/v2/users/',
  updateUser: '/public/v2/users/',
  deleteUser: '/public/v2/users/',
};

export const options = {
  vus: 1,
  duration: '1s',
  cloud: {
    projectID: 3701727,
    name: 'Test (18/06/2024-10:22:01)',
  },
};

export default function () {
  let randomNum = Math.floor(Math.random() * 9999999);

  const params = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AuthToken}`,
    },
  };

  group('Create User', async () => {
    const create_payload = JSON.stringify({
      name: 'Hifni test ' + randomNum,
      gender: 'male',
      email: `hifni.${randomNum}@berijalan.com`,
      status: 'active',
    });

    const response = http.post(URL + ENDPOINT.newUser, create_payload, params);

    check(response, {
      'Verify success response code 201': (r) =>
        r.status === ResponseCodes.Created,
      'Verify success create user': (r) =>
        r.json().name === JSON.parse(create_payload).name,
    });

    console.log('Create user: ' + response.body);
  });

  group('Get User Detail', async () => {
    const response = http.get(URL + ENDPOINT.getUserDetail + '6969376', params);

    check(response, {
      'Verify success get user detail': (r) => r.status === ResponseCodes.OK,
    });

    console.log('Get user detail: ' + response.body);
  });

  group('Get All User', () => {
    const response = http.get(URL + ENDPOINT.getUser, {
      headers: params.headers,
    });

    check(response, {
      'Verify success get all user': (r) => r.status === ResponseCodes.OK,
    });

    // console.log(response.request);
  });

  group('Update User', () => {
    const update_payload = JSON.stringify({
      name: 'Hifni update ' + new Date().toLocaleString(),
      email : `${randomNum}@berijalan.com`,
      status: 'active',
    });

    const response = http.patch(
      URL + ENDPOINT.updateUser + '6969376',
      update_payload,
      params
    );

    check(response, {
      'Verify success update user': (r) => r.status === ResponseCodes.OK,
    });

    console.log('Update user: ' + response.body);
  });
}
