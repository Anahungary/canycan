// public/scripts/netlify-identity.js
// Configuración de Netlify Identity para Balto

(function() {
  'use strict';

  // Esperar a que Netlify Identity esté cargado
  function waitForNetlifyIdentity() {
    return new Promise((resolve) => {
      if (window.netlifyIdentity) {
        resolve(window.netlifyIdentity);
      } else {
        const checkIdentity = setInterval(() => {
          if (window.netlifyIdentity) {
            clearInterval(checkIdentity);
            resolve(window.netlifyIdentity);
          }
        }, 100);
      }
    });
  }

  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', async function() {
    const identity = await waitForNetlifyIdentity();
    
    // Configuración inicial
    identity.on('init', user => {
      console.log('Netlify Identity inicializado', user ? 'con usuario' : 'sin usuario');
      
      if (!user) {
        // Configurar eventos para usuarios no logueados
        identity.on('login', () => {
          console.log('Usuario logueado, redirigiendo...');
          document.location.href = '/admin/';
        });
      }
    });

    // Manejar confirmación de email desde URL
    handleEmailConfirmation(identity);
    
    // Manejar recuperación de contraseña
    handlePasswordRecovery(identity);
  });

  // Función para manejar tokens de confirmación
  function handleEmailConfirmation(identity) {
    const hash = window.location.hash;
    if (!hash) return;

    // Buscar token de confirmación
    const params = new URLSearchParams(hash.substring(1));
    const confirmationToken = params.get('confirmation_token');
    
    if (confirmationToken) {
      console.log('Token de confirmación encontrado, procesando...');
      
      identity.confirm(confirmationToken)
        .then(() => {
          console.log('✅ Email confirmado exitosamente');
          
          // Mostrar mensaje de éxito
          showNotification('¡Email confirmado exitosamente! Ya puedes acceder al panel de administración.', 'success');
          
          // Limpiar URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            window.location.href = '/admin/';
          }, 2000);
        })
        .catch(error => {
          console.error('❌ Error al confirmar email:', error);
          showNotification('Error al confirmar el email. Por favor, intenta nuevamente.', 'error');
        });
    }
  }

  // Función para manejar recuperación de contraseña
  function handlePasswordRecovery(identity) {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const recoveryToken = params.get('recovery_token');
    
    if (recoveryToken) {
      console.log('Token de recuperación encontrado');
      // Netlify Identity maneja esto automáticamente
      // Solo necesitamos limpiar la URL después
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 1000);
    }
  }

  // Función para mostrar notificaciones
  function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `netlify-notification netlify-notification--${type}`;
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        animation: slideIn 0.3s ease-out;
      ">
        ${message}
      </div>
    `;
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('netlify-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'netlify-notification-styles';
      styles.innerHTML = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Exponer funciones útiles globalmente
  window.BaltoAuth = {
    openAuth: () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.open();
      }
    },
    
    getCurrentUser: () => {
      return window.netlifyIdentity ? window.netlifyIdentity.currentUser() : null;
    },
    
    logout: () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.logout();
      }
    }
  };

})();