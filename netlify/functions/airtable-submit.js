// netlify/functions/airtable-submit.js - VERSIÓN NETLIFY FUNCTION
exports.handler = async (event, context) => {
  try {
    console.log('🚀 =================================');
    console.log('📧 INICIO DEL ENDPOINT AIRTABLE (Netlify Function)');
    console.log('🚀 =================================');
    console.log('📧 Method:', event.httpMethod);
    console.log('📧 Headers:', JSON.stringify(event.headers, null, 2));
    
    // Manejar CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      console.log('🔄 OPTIONS request recibido');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: ''
      };
    }
    
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
      console.log('❌ Method no permitido:', event.httpMethod);
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Method not allowed. Use POST.',
          received: event.httpMethod 
        })
      };
    }
    
    // 1. Leer el body del request
    let body;
    try {
      console.log('📦 Raw body:', event.body);
      body = JSON.parse(event.body || '{}');
      console.log('📦 Body recibido exitosamente');
      console.log('📦 Estructura del body:', {
        hasRecords: !!body.records,
        recordsLength: body.records?.length,
        firstRecordKeys: body.records?.[0] ? Object.keys(body.records[0]) : 'no records'
      });
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message 
        })
      };
    }
    
    // 2. Validar estructura del body
    if (!body.records || !Array.isArray(body.records)) {
      console.error('❌ Estructura de body inválida');
      console.log('❌ Body recibido:', body);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Invalid data format - records array required',
          received: body
        })
      };
    }
    
    // 3. Verificar variables de entorno
    console.log('🔍 VERIFICANDO VARIABLES DE ENTORNO:');
    console.log('🔍 process.env keys:', Object.keys(process.env).filter(key => key.includes('AIRTABLE')));
    
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    console.log('🔑 API Key presente:', !!AIRTABLE_API_KEY);
    console.log('🔑 API Key length:', AIRTABLE_API_KEY?.length);
    
    if (AIRTABLE_API_KEY) {
      console.log('🔑 API Key comienza con:', AIRTABLE_API_KEY.substring(0, 10));
      console.log('🔑 API Key termina con:', AIRTABLE_API_KEY.substring(AIRTABLE_API_KEY.length - 10));
    }
    
    if (!AIRTABLE_API_KEY) {
      console.error('❌ AIRTABLE_API_KEY no encontrada');
      console.log('❌ Variables disponibles:', Object.keys(process.env).filter(key => !key.includes('SECRET')));
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Server configuration error - API key not found',
          availableEnvVars: Object.keys(process.env).filter(key => !key.includes('SECRET'))
        })
      };
    }
    
    // 4. Configuración de Airtable
    const AIRTABLE_BASE_ID = 'app63Hyc9eyV1Gx5T';
    const AIRTABLE_TABLE_ID = 'tblb7S8h7xSjVQKPT';
    
    console.log('📋 CONFIGURACIÓN AIRTABLE:');
    console.log('📋 Base ID:', AIRTABLE_BASE_ID);
    console.log('📋 Table ID:', AIRTABLE_TABLE_ID);
    
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
    console.log('📋 URL completa:', airtableUrl);
    
    // 5. Preparar payload para Airtable
    console.log('📤 PREPARANDO PAYLOAD:');
    console.log('📤 Records a enviar:', body.records.length);
    console.log('📤 Primer record fields:', Object.keys(body.records[0]?.fields || {}));
    console.log('📤 Primer record valores:', body.records[0]?.fields);
    
    // 6. Hacer request a Airtable
    console.log('🌐 ENVIANDO REQUEST A AIRTABLE...');
    
    let airtableResponse;
    try {
      airtableResponse = await fetch(airtableUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      console.log('🌐 Response status:', airtableResponse.status);
      console.log('🌐 Response headers:', Object.fromEntries(airtableResponse.headers.entries()));
      
    } catch (fetchError) {
      console.error('❌ Error en fetch a Airtable:', fetchError);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Network error calling Airtable',
          details: fetchError.message 
        })
      };
    }
    
    // 7. Procesar respuesta de Airtable
    let airtableData;
    try {
      const responseText = await airtableResponse.text();
      console.log('📥 Response text:', responseText);
      
      if (responseText) {
        airtableData = JSON.parse(responseText);
        console.log('📥 Response JSON:', airtableData);
      }
    } catch (jsonError) {
      console.error('❌ Error parseando respuesta de Airtable:', jsonError);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Invalid JSON response from Airtable',
          status: airtableResponse.status,
          responseText: responseText
        })
      };
    }
    
    // 8. Verificar si fue exitoso
    if (!airtableResponse.ok) {
      console.error('❌ AIRTABLE ERROR:');
      console.error('❌ Status:', airtableResponse.status);
      console.error('❌ Status Text:', airtableResponse.statusText);
      console.error('❌ Error Data:', airtableData);
      
      return {
        statusCode: airtableResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Airtable API error',
          status: airtableResponse.status,
          statusText: airtableResponse.statusText,
          airtableError: airtableData 
        })
      };
    }
    
    // 9. Éxito!
    console.log('✅ ¡ÉXITO! Datos guardados en Airtable');
    console.log('✅ Records creados:', airtableData?.records?.length || 0);
    console.log('🚀 =================================');
    console.log('✅ FIN DEL ENDPOINT - SUCCESS');
    console.log('🚀 =================================');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Data saved successfully to Airtable',
        recordsCreated: airtableData?.records?.length || 0,
        airtableResponse: airtableData
      })
    };

  } catch (error) {
    console.error('🚨 ERROR GENERAL DEL ENDPOINT:');
    console.error('🚨 Error message:', error.message);
    console.error('🚨 Error stack:', error.stack);
    console.error('🚨 Error name:', error.name);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};