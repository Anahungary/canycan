// src/pages/api/newsletter.js
export async function POST({ request }) {
  try {
    const data = await request.json();
    const { email, source = 'general' } = data;

    // Validación básica
    if (!email || !email.includes('@')) {
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
    const TABLE_ID = 'tblZWCfULF2qTJ00Y'; // Tu table ID para newsletter
    const EMAIL_FIELD_ID = 'fld58ulIqtGzDaluO'; // Tu field ID para email

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
    
    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          [EMAIL_FIELD_ID]: email,
          // Campos adicionales que puedes agregar
          'Source': source, // De dónde viene la suscripción
          'Date': new Date().toISOString(),
          'Status': 'Active'
        }
      })
    });

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.text();
      console.error('❌ Error de Airtable:', errorData);
      
      // Verificar si ya existe el email
      if (errorData.includes('INVALID_MULTIPLE_CHOICE_OPTIONS') || 
          airtableResponse.status === 422) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Este email ya está suscrito'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        message: 'Error al procesar la suscripción'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await airtableResponse.json();
    console.log('✅ Email agregado a Airtable:', email);

    return new Response(JSON.stringify({
      success: true,
      message: '¡Suscripción exitosa! Revisa tu email para confirmar.',
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en API newsletter:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}