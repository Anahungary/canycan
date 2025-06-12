exports.handler = async (event, context) => {
  console.log('🚀 Newsletter Debug llamada');
  console.log('Method:', event.httpMethod);
  console.log('Body:', event.body);
  
  // Verificar variables de entorno
  const hasAirtableKey = !!process.env.AIRTABLE_API_KEY;
  const hasAirtableBase = !!process.env.AIRTABLE_BASE_ID;
  
  console.log('Env check:', { hasAirtableKey, hasAirtableBase });
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Debug exitoso',
        received: data,
        env: {
          hasAirtableKey,
          hasAirtableBase,
          nodeEnv: process.env.NODE_ENV
        }
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message,
        stack: error.stack
      })
    };
  }
};
