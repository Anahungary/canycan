// src/pages/api/ping.js
export const prerender = false;

export async function GET() {
  console.log('🚀 Ping API called');
  
  return new Response(JSON.stringify({
    status: 'success',
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}