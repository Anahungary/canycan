// src/pages/api/ping.js
export async function GET() {
  return new Response(JSON.stringify({
    message: 'API funcionando!',
    env: {
      hasAirtableKey: !!import.meta.env.AIRTABLE_API_KEY,
      hasAirtableBase: !!import.meta.env.AIRTABLE_BASE_ID
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}