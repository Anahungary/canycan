// src/api/addsent/subscribe.js - ENDPOINT PRINCIPAL PARA ADDSENT
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validar datos
    if (!data.email || !data.firstName) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email y nombre son requeridos'
      }), { status: 400 });
    }
    
    // Configuración AddSent
    const addSentConfig = {
      apiKey: import.meta.env.ADDSENT_API_KEY,
      listId: import.meta.env.ADDSENT_LIST_ID,
      apiUrl: 'https://api.addsent.com/v1'
    };
    
    // Preparar datos para AddSent
    const subscriberData = {
      email: data.email.toLowerCase().trim(),
      first_name: data.firstName.trim(),
      last_name: data.lastName?.trim() || '',
      tags: data.tags || [],
      custom_fields: {
        source: data.customFields?.leadSource || 'website',
        quiz_completed: data.customFields?.quizCompletedAt || null,
        pet_preference: data.customFields?.petTypePreference || null,
        experience_level: data.customFields?.experienceLevel || null,
        ...data.customFields
      }
    };
    
    // Enviar a AddSent
    const response = await fetch(`${addSentConfig.apiUrl}/subscribers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${addSentConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        list_id: addSentConfig.listId,
        subscriber: subscriberData
      })
    });
    
    if (!response.ok) {
      throw new Error(`AddSent API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Suscripción exitosa',
      data: result
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error en API AddSent:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Error procesando suscripción',
      error: error.message
    }), { status: 500 });
  }
}