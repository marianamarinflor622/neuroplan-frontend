/**
 * Test Script para n8n Workflow Endpoints
 * 
 * Este script prueba todos los endpoints de n8n en el backend de NeuroPlan
 * 
 * Uso:
 *   node test-n8n-endpoints.cjs
 */

const API_BASE_URL = 'http://localhost:3001/api';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function testEndpoint(name, method, path, body = null) {
  const url = `${API_BASE_URL}${path}`;
  console.log(`\n${colors.cyan}Probando:${colors.reset} ${colors.bright}${name}${colors.reset}`);
  console.log(`${colors.blue}${method}${colors.reset} ${url}`);

  const startTime = Date.now();

  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
      console.log(`${colors.yellow}Body:${colors.reset}`, JSON.stringify(body, null, 2));
    }

    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    console.log(`${colors.yellow}Status:${colors.reset} ${response.status} ${response.statusText}`);
    console.log(`${colors.yellow}Tiempo:${colors.reset} ${duration}ms`);

    if (response.ok) {
      const data = await response.json();
      console.log(`${colors.green}✓ Éxito${colors.reset}`);
      console.log(`${colors.yellow}Respuesta:${colors.reset}`);
      console.log(JSON.stringify(data, null, 2));
      return { success: true, status: response.status, data, duration };
    } else {
      const errorText = await response.text();
      console.log(`${colors.red}✗ Error${colors.reset}`);
      console.log(`${colors.red}Detalles:${colors.reset} ${errorText}`);
      return { success: false, status: response.status, error: errorText, duration };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`${colors.red}✗ Excepción${colors.reset}`);
    console.log(`${colors.red}Error:${colors.reset} ${error.message}`);
    return { success: false, error: error.message, duration };
  }
}

async function runTests() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.bright}${colors.cyan}   N8N WORKFLOW ENDPOINTS - TEST SUITE${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`${colors.yellow}Backend:${colors.reset} ${API_BASE_URL}`);
  console.log(`${colors.yellow}Fecha:${colors.reset} ${new Date().toLocaleString()}`);
  console.log(`${'='.repeat(70)}`);

  const results = [];

  // Test 1: Health Check
  results.push(
    await testEndpoint('Health Check', 'GET', '/health')
  );

  // Test 2: Get n8n Stats
  results.push(
    await testEndpoint('n8n Estadísticas', 'GET', '/n8n/stats')
  );

  // Test 3: Trigger Custom Workflow
  results.push(
    await testEndpoint(
      'Trigger Workflow Personalizado',
      'POST',
      '/n8n/trigger-workflow',
      {
        workflowName: 'test-notification',
        data: {
          message: 'Prueba desde test script',
          timestamp: new Date().toISOString(),
          source: 'automated-test',
        },
      }
    )
  );

  // Test 4: Notify PEI Generated
  results.push(
    await testEndpoint('Notificar PEI Generado', 'POST', '/n8n/pei/1/generated')
  );

  // Test 5: Notify PEI Approved
  results.push(
    await testEndpoint('Notificar PEI Aprobado', 'POST', '/n8n/pei/1/approved')
  );

  // Test 6: Trigger Email Workflow
  results.push(
    await testEndpoint(
      'Workflow de Email',
      'POST',
      '/n8n/trigger-workflow',
      {
        workflowName: 'send-email-notification',
        data: {
          email: 'test@neuroplan.com',
          subject: 'Prueba de Workflow',
          body: 'Este es un email de prueba generado por el test script',
          priority: 'high',
        },
      }
    )
  );

  // Resumen
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.bright}${colors.cyan}   RESUMEN DE RESULTADOS${colors.reset}`);
  console.log(`${'='.repeat(70)}\n`);

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const total = results.length;
  const avgDuration =
    results.reduce((sum, r) => sum + (r.duration || 0), 0) / total;

  console.log(`${colors.green}Exitosos:${colors.reset}     ${successful}/${total}`);
  console.log(`${colors.red}Fallidos:${colors.reset}      ${failed}/${total}`);
  console.log(
    `${colors.yellow}Tiempo promedio:${colors.reset} ${avgDuration.toFixed(0)}ms`
  );

  const successRate = ((successful / total) * 100).toFixed(1);
  console.log(
    `${colors.cyan}Tasa de éxito:${colors.reset}   ${successRate}%`
  );

  console.log(`\n${'='.repeat(70)}`);

  // Salir con código de error si hay fallos
  if (failed > 0) {
    console.log(
      `\n${colors.red}${colors.bright}⚠ ALGUNOS TESTS FALLARON${colors.reset}\n`
    );
    process.exit(1);
  } else {
    console.log(
      `\n${colors.green}${colors.bright}✓ TODOS LOS TESTS PASARON${colors.reset}\n`
    );
    process.exit(0);
  }
}

// Ejecutar tests
console.log(`\n${colors.bright}Iniciando tests de n8n workflows...${colors.reset}`);
runTests().catch((error) => {
  console.error(`\n${colors.red}Error fatal:${colors.reset}`, error);
  process.exit(1);
});
