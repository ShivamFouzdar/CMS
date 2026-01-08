
const axios = require('axios');

const URL = 'http://localhost:5000/api/services';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTVkMzBmM2NlYWYxODI2ODZhZGE2ZTciLCJlbWFpbCI6ImFkbWluQGNhcmVlcm1hcHNvbHV0aW9ucy5jb20iLCJyb2xlIjoiYWRtaW4iLCJzZXNzaW9uSWQiOiJzZXNzXzRhODk3OTEwLWRiYTktNDM2OS1hZjYxLTZkMWMyYmM5MTU3NiIsImlhdCI6MTc2Nzc3MzEwMCwiZXhwIjoxNzY4Mzc3OTAwfQ.Xm5X0Vmtv1OOIMDDw8Jucin5mmnrhKLG_grBYtS9XAg';

const data = {
    name: 'Test Service',
    slug: 'test-service',
    shortDescription: 'This is a short description of at least 20 characters.',
    description: 'This is a long description of at least 50 characters to ensure it passes the backend validation rules that require a minimum of 50 characters for the full description field.',
    category: 'IT Services',
    icon: 'Briefcase'
};

async function test() {
    try {
        const response = await axios.post(URL, data, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error:', error.response.status, error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

test();
