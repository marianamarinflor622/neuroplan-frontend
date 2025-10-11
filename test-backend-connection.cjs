// Test de conexión Backend - NeuroPlan
// Ejecutar con: node test-backend-connection.js

const https = require('http');

const BACKEND_URL = 'localhost';
const BACKEND_PORT = 3001;
const FRONTEND_PORT = 8080;

console.log('🔍 Iniciando test de conexión Backend-Frontend NeuroPlan\n');
console.log(`Frontend: http://localhost:${FRONTEND_PORT}`);
console.log(`Backend:  http://localhost:${BACKEND_PORT}\n`);

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: BACKEND_URL,
      port: BACKEND_PORT,
      path: path,
      method: 'GET',
      headers: {
        'Origin': `http://localhost:${FRONTEND_PORT}`,
        'Content-Type': 'application/json'
      }
    };

    const startTime = Date.now();
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const duration = Date.now() - startTime;
        const corsHeader = res.headers['access-control-allow-origin'];
        
        try {
          const json = JSON.parse(data);
          
          if (res.statusCode === 200) {
            log(`✅ ${description}`, 'green');
            log(`   Status: ${res.statusCode} | Time: ${duration}ms`, 'cyan');
            
            if (corsHeader) {
              if (corsHeader === '*' || corsHeader.includes(FRONTEND_PORT)) {
                log(`   CORS: ✅ Configurado correctamente`, 'green');
              } else {
                log(`   CORS: ⚠️  Configurado pero no incluye puerto ${FRONTEND_PORT}`, 'yellow');
                log(`   Origen permitido: ${corsHeader}`, 'yellow');
              }
            } else {
              log(`   CORS: ❌ No configurado`, 'red');
            }
            
            log(`   Response: ${JSON.stringify(json).substring(0, 100)}...`, 'cyan');
          } else {
            log(`⚠️  ${description}`, 'yellow');
            log(`   Status: ${res.statusCode} | Time: ${duration}ms`, 'yellow');
            log(`   Message: ${json.message || 'No message'}`, 'yellow');
          }
          
          resolve({ success: res.statusCode === 200, cors: !!corsHeader, duration });
        } catch (error) {
          log(`⚠️  ${description}`, 'yellow');
          log(`   Error parsing JSON: ${error.message}`, 'yellow');
          resolve({ success: false, cors: false, duration });
        }
      });
    });
    
    req.on('error', (error) => {
      log(`❌ ${description}`, 'red');
      log(`   Error: ${error.message}`, 'red');
      log(`   Causa: Backend probablemente no está ejecutándose`, 'red');
      resolve({ success: false, cors: false, duration: 0 });
    });
    
    req.end();
    console.log(''); // Línea en blanco
  });
}

async function runTests() {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('PRUEBAS DE ENDPOINTS', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  const tests = [
    { path: '/health', description: 'Health Check' },
    { path: '/api/uploads/students', description: 'Students Module' },
    { path: '/api/peis', description: 'PEIs Module' },
    { path: '/api/elevenlabs/voices', description: 'ElevenLabs Module' },
    { path: '/api/linkup/search/test', description: 'Linkup Module' },
    { path: '/api/n8n/stats', description: 'n8n Module' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    results.push({ ...test, ...result });
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }
  
  // Resumen
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('RESUMEN', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  const corsConfigured = results.filter(r => r.cors).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / total;
  
  log(`Endpoints exitosos: ${successful}/${total} (${((successful/total)*100).toFixed(1)}%)`, 
      successful === total ? 'green' : 'yellow');
  log(`CORS configurado: ${corsConfigured}/${total} endpoints`, 
      corsConfigured > 0 ? 'green' : 'red');
  log(`Tiempo promedio: ${avgDuration.toFixed(0)}ms`, 'cyan');
  
  // Diagnóstico
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('DIAGNÓSTICO', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  if (successful === 0) {
    log('❌ Backend no está ejecutándose', 'red');
    log('   Solución: cd neuroplan-backend && npm run start:dev', 'yellow');
  } else if (corsConfigured === 0) {
    log('⚠️  Backend funciona pero CORS no está configurado para puerto 8080', 'yellow');
    log('   Solución: Agregar http://localhost:8080 en main.ts del backend', 'yellow');
  } else if (successful === total && corsConfigured === total) {
    log('✅ ¡Todo funciona perfectamente!', 'green');
    log('   El frontend puede conectarse sin problemas al backend', 'green');
  } else {
    log('⚠️  Algunos endpoints tienen problemas', 'yellow');
    log('   Revisa los endpoints específicos arriba', 'yellow');
  }
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
}

// Ejecutar tests
runTests().catch(console.error);