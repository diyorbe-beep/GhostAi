// Test script to check backend connectivity
// Run with: node test-backend.js

const https = require('https');

const BACKEND_URL = 'https://gemini-backen.onrender.com';

// Test direct connection
function testDirectConnection() {
    console.log('🔍 Testing direct connection to backend...');
    
    const options = {
        hostname: 'gemini-backen.onrender.com',
        port: 443,
        path: '/api/test-gemini',
        method: 'GET',
        headers: {
            'User-Agent': 'Node.js Test Script'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`✅ Direct connection successful! Status: ${res.statusCode}`);
        console.log('Headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Response:', jsonData);
            } catch (e) {
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Direct connection failed:', error.message);
    });

    req.end();
}

// Test CORS headers
function testCORSHeaders() {
    console.log('\n🔍 Testing CORS headers...');
    
    const options = {
        hostname: 'gemini-backen.onrender.com',
        port: 443,
        path: '/api/test-gemini',
        method: 'OPTIONS',
        headers: {
            'Origin': 'http://localhost:5173',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`✅ OPTIONS request successful! Status: ${res.statusCode}`);
        console.log('CORS Headers:');
        console.log('  Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
        console.log('  Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
        console.log('  Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
        console.log('  Access-Control-Allow-Credentials:', res.headers['access-control-allow-credentials']);
    });

    req.on('error', (error) => {
        console.error('❌ OPTIONS request failed:', error.message);
    });

    req.end();
}

// Test chat endpoint
function testChatEndpoint() {
    console.log('\n🔍 Testing chat endpoint...');
    
    const postData = JSON.stringify({
        message: 'Hello, this is a test message'
    });

    const options = {
        hostname: 'gemini-backen.onrender.com',
        port: 443,
        path: '/api/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Node.js Test Script'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`✅ Chat endpoint test successful! Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Chat Response:', jsonData);
            } catch (e) {
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Chat endpoint test failed:', error.message);
    });

    req.write(postData);
    req.end();
}

// Run all tests
console.log('🚀 Starting backend connectivity tests...\n');

testDirectConnection();
setTimeout(testCORSHeaders, 1000);
setTimeout(testChatEndpoint, 2000);

console.log('\n📝 Note: If you see CORS errors in the browser but these tests pass,');
console.log('   the issue is with CORS headers, not backend connectivity.');
console.log('   You need to add proper CORS configuration to your backend.');
