// src/pages/api/newsletter.js - VERSIÓN CORREGIDA
export async function POST({ request }) {
  try {
    console.log('📧 =================================');
    console.log('📧 INICIO DEL ENDPOINT NEWSLETTER');
    console.log('📧 =================================');
    
    const data = await request.json();
    const { email, name = 'Suscriptor Newsletter', source = 'general' } = data;
    
    console.log('📦 Datos recibidos:', { email, name, source });

    // Validación básica
    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido:', email);
      return new Response(JSON.stringify({
        success: false,
        message: 'Email inválido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Configuración de Airtable
    const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
    
    // IDs correctos para la tabla Newsletter
    const TABLE_ID = 'tblZWCfULF2qTJ00Y'; // Newsletter table ID
    const EMAIL_FIELD_ID = 'fld58ulIqtGzDaluO'; // e-mail field ID
    const NOMBRE_FIELD_ID = 'fldx1AOWIuq68Y36A'; // Nombre field ID  
    const SOURCE_FIELD_ID = 'fldm3zhu5rRM8KHLD'; // Source field ID
    const DATE_FIELD_ID = 'fldred5GLJpy0bF0H'; // Date field ID
    const STATUS_FIELD_ID = 'fldWJq6t3bDoTpKRy'; // Status field ID

    console.log('🔑 CONFIGURACIÓN AIRTABLE:');
    console.log('🔑 API Key presente:', !!AIRTABLE_API_KEY);
    console.log('🔑 Base ID presente:', !!AIRTABLE_BASE_ID);
    console.log('🔑 Table ID:', TABLE_ID);

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error('❌ Variables de entorno de Airtable no configuradas');
      return new Response(JSON.stringify({
        success: false,
        message: 'Error de configuración del servidor'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Crear registro en Airtable
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_ID}`;
    
    const payload = {
      fields: {
        [EMAIL_FIELD_ID]: email, // e-mail
        [NOMBRE_FIELD_ID]: name, // Nombre
        [SOURCE_FIELD_ID]: source, // Source
        [DATE_FIELD_ID]: new Date().toISOString(), // Date
        [STATUS_FIELD_ID]: 'Active' // Status
      }
    };
    
    console.log('📤 Payload a enviar:', payload);
    console.log('📤 URL:', airtableUrl);
         
    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('🌐 Response status:', airtableResponse.status);
    
    const responseText = await airtableResponse.text();
    console.log('📥 Response text:', responseText);

    if (!airtableResponse.ok) {
      console.error('❌ Error de Airtable:', responseText);
           
      // Verificar errores específicos
      if (responseText.includes('INVALID_MULTIPLE_CHOICE_OPTIONS') || 
          responseText.includes('duplicate') ||
          airtableResponse.status === 422) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Este email ya está suscrito'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Error de campo inválido o configuración
      if (responseText.includes('INVALID_REQUEST_MISSING_FIELDS') ||
          responseText.includes('NOT_FOUND')) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Error de configuración - verificar campos',
          debug: responseText
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        message: 'Error al procesar la suscripción',
        debug: process.env.NODE_ENV === 'development' ? responseText : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = JSON.parse(responseText);
    console.log('✅ Email agregado a Airtable:', email);
    console.log('✅ Record ID:', result.id);

    return new Response(JSON.stringify({
      success: true,
      message: '¡Suscripción exitosa! Revisa tu email para confirmar.',
      data: result
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('❌ Error en API newsletter:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manejar preflight requests para CORS
export async function OPTIONS() {
  console.log('🔄 OPTIONS request recibido para newsletter');
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}