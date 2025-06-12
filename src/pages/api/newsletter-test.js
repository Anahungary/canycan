// src/pages/api/newsletter-test.js  
export const prerender = false;

export async function POST({ request }) {
  try {
    const { email } = await request.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Test exitoso sin Airtable',
      email
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}