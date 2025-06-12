
cat > netlify/functions/newsletter.js << 'EOF'
exports.handler = async (event, context) => {
  console.log('📧 Netlify Function Newsletter llamada');
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { email, name = 'Suscriptor', source = 'website' } = JSON.parse(event.body);
    
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Email inválido'
        })
      };
    }

    // Variables de entorno
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error('Variables de entorno faltantes');
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Configuración del servidor incompleta'
        })
      };
    }

    // Tu lógica de Airtable aquí (copia de tu código original)
    const TABLE_ID = 'tblZWCfULF2qTJ00Y';
    const EMAIL_FIELD_ID = 'fld58ulIqtGzDaluO';
    const NOMBRE_FIELD_ID = 'fldx1AOWIuq68Y36A';
    const SOURCE_FIELD_ID = 'fldm3zhu5rRM8KHLD';
    const DATE_FIELD_ID = 'fldred5GLJpy0bF0H';
    const STATUS_FIELD_ID = 'fldWJq6t3bDoTpKRy';

    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_ID}`;
    
    const payload = {
      fields: {
        [EMAIL_FIELD_ID]: email,
        [NOMBRE_FIELD_ID]: name,
        [SOURCE_FIELD_ID]: source,
        [DATE_FIELD_ID]: new Date().toISOString(),
        [STATUS_FIELD_ID]: 'Active'
      }
    };
         
    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text();
      console.error('Error Airtable:', errorText);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Error al procesar la suscripción'
        })
      };
    }

    const result = await airtableResponse.json();
    console.log('✅ Suscripción exitosa:', email);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: '¡Suscripción exitosa! Revisa tu email para confirmar.',
        data: result
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Error interno del servidor'
      })
    };
  }
};
