import http from 'k6/http';
import { check, sleep } from 'k6';


export let options = {
    stages: [
        { duration: '20s', target: 500 },
        { duration: '30s', target: 1000 },
        { duration: '10s', target: 100 },
    ],
};

const BASE_URL = 'https://bootcamp.ciput.fun';

export default function () {
    const user = {
        email: 'admin@simpeja.com',
        password: 'admin123'
    }


    // 1. Login as admin to get token
    const loginRes = http.post(`${BASE_URL}/api/auth/login`,
        user
    );

    check(loginRes, {
        'login status is 200': (r) => r.status === 200,
        'login response has token': (r) => !!(r.json('data.token')),
        // 'debugg': (r) => (console.log(r)),
    });

    const token = loginRes.json('data.token');
    if (!token) {
        return;
    }

    // 2. Create new supplier
    const newSupplier = {
        name: 'Test sekali lagi',
        email: 'supplier@example.com',
        phone: '1234567890',
        address: '123 Supplier St, Supplier City, SC 12345',
        contact_person: 'John Doe',
    };

    const createRes = http.post(
        `${BASE_URL}/api/supplier`,
        JSON.stringify(newSupplier),
        {
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );

    check(createRes, {
        'create supplier status is 200': (r) => r.status === 200,
        'create supplier success': (r) => r.json('success') === true,
    });

    const supplierId = createRes.json('data.supplier_id');
    if (!supplierId) {
        return;
    }

    // 3. Delete the created supplier
    const deleteRes = http.del(
        `${BASE_URL}/api/supplier/${supplierId}`,
        null,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    check(deleteRes, {
        'delete supplier status is 200': (r) => r.status === 200,
        'delete supplier success': (r) => r.json('success') === true,
        'delete supplier message': (r) => r.json('message') === 'Supplier deleted successfully',
    });

    sleep(1);

}