// src/pages/test-simple.js
export const prerender = false;

export async function GET() {
  console.log('🚀 API Test llamada');
  
  return new Response(JSON.stringify({
    message: 'API Test funcionando!',
    timestamp: new Date().toISOString(),
    version: 'test-1.0'
  }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}