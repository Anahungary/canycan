export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
  try {
    console.log("📧 =================================");
    console.log("📧 INICIO DEL ENDPOINT NEWSLETTER");
    console.log("📧 =================================");
    const data = await request.json();
    const { email, name = "Suscriptor Newsletter", source = "general" } = data;
    console.log("📦 Datos recibidos:", { email, name, source });
    if (!email || !email.includes("@")) {
      console.error("❌ Email inválido:", email);
      return new Response(JSON.stringify({
        success: false,
        message: "Email inválido"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TABLE_ID = "tblZWCfULF2qTJ00Y";
    const EMAIL_FIELD_ID = "fld58ulIqtGzDaluO";
    const NOMBRE_FIELD_ID = "fldx1AOWIuq68Y36A";
    const SOURCE_FIELD_ID = "fldm3zhu5rRM8KHLD";
    const DATE_FIELD_ID = "fldred5GLJpy0bF0H";
    const STATUS_FIELD_ID = "fldWJq6t3bDoTpKRy";
    console.log("🔑 CONFIGURACIÓN AIRTABLE:");
    console.log("🔑 API Key presente:", !!AIRTABLE_API_KEY);
    console.log("🔑 Base ID presente:", !!AIRTABLE_BASE_ID);
    console.log("🔑 Table ID:", TABLE_ID);
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error("❌ Variables de entorno de Airtable no configuradas");
      return new Response(JSON.stringify({
        success: false,
        message: "Error de configuración del servidor"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_ID}`;
    const payload = {
      fields: {
        [EMAIL_FIELD_ID]: email,
        // e-mail
        [NOMBRE_FIELD_ID]: name,
        // Nombre
        [SOURCE_FIELD_ID]: source,
        // Source
        [DATE_FIELD_ID]: (/* @__PURE__ */ new Date()).toISOString(),
        // Date
        [STATUS_FIELD_ID]: "Active"
        // Status
      }
    };
    console.log("📤 Payload a enviar:", payload);
    console.log("📤 URL:", airtableUrl);
    const airtableResponse = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    console.log("🌐 Response status:", airtableResponse.status);
    const responseText = await airtableResponse.text();
    console.log("📥 Response text:", responseText);
    if (!airtableResponse.ok) {
      console.error("❌ Error de Airtable:", responseText);
      if (responseText.includes("INVALID_MULTIPLE_CHOICE_OPTIONS") || responseText.includes("duplicate") || airtableResponse.status === 422) {
        return new Response(JSON.stringify({
          success: false,
          message: "Este email ya está suscrito"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (responseText.includes("INVALID_REQUEST_MISSING_FIELDS") || responseText.includes("NOT_FOUND")) {
        return new Response(JSON.stringify({
          success: false,
          message: "Error de configuración - verificar campos",
          debug: responseText
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        success: false,
        message: "Error al procesar la suscripción",
        debug: process.env.NODE_ENV === "development" ? responseText : void 0
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = JSON.parse(responseText);
    console.log("✅ Email agregado a Airtable:", email);
    console.log("✅ Record ID:", result.id);
    return new Response(JSON.stringify({
      success: true,
      message: "¡Suscripción exitosa! Revisa tu email para confirmar.",
      data: result
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("❌ Error en API newsletter:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error interno del servidor",
      debug: process.env.NODE_ENV === "development" ? error.message : void 0
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function OPTIONS() {
  console.log("🔄 OPTIONS request recibido para newsletter");
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
