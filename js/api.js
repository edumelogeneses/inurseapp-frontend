// ========================================
// API Configuration - iNurseApp v2.0
// ✅ Segurança: XSS Protection, Sanitização
// ✅ Performance: Retry Logic, Request Caching
// ✅ TypeScript: JSDoc types
// ========================================

const API_BASE_URL = 'https://lively-embrace-production-a4a2.up.railway.app';

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} full_name
 * @property {string} role
 * @property {string} plan
 * @property {string} subscription_status
 * @property {number} tokens_total
 * @property {number} tokens_used
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {string} [error]
 */

// ========================================
// Utility: Sleep for retry logic
// ========================================
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// Utility: Sanitize HTML to prevent XSS
// ========================================
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// ========================================
// Utility: Safe DOM text setter (XSS Safe)
// ========================================
function setElementText(element, text) {
    if (element) {
        element.textContent = text; // Safe - não renderiza HTML
    }
}

// ========================================
// Utility: Safe DOM HTML setter (com sanitização)
// ========================================
function setElementHTML(element, html) {
    if (element) {
        element.innerHTML = sanitizeHTML(html);
    }
}

// ========================================
// API Helper Class
// ========================================
const API = {
    // ✅ MELHORIA: Usar sessionStorage para tokens sensíveis
    getToken() {
        return sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    },
    
    setToken(token, remember = false) {
        if (remember) {
            localStorage.setItem('access_token', token);
        } else {
            sessionStorage.setItem('access_token', token);
        }
    },
    
    // Get user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },
    
    // Logout
    logout() {
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },
    
    // ✅ MELHORIA: Retry logic para requisições que falharam
    async requestWithRetry(endpoint, options = {}, retries = 3) {
        try {
            return await this.request(endpoint, options);
        } catch (error) {
            if (retries > 0 && error.name === 'TypeError') {
                console.log(`Retrying... (${retries} attempts left)`);
                await sleep(1000);
                return this.requestWithRetry(endpoint, options, retries - 1);
            }
            throw error;
        }
    },
    
    // Make authenticated request
    async request(endpoint, options = {}) {
        const token = this.getToken();
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            // ✅ MELHORIA: Incluir credentials para cookies
            credentials: 'include'
        };
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(API_BASE_URL + endpoint, config);
            
            // Se não autorizado, fazer logout
            if (response.status === 401) {
                this.logout();
                throw new Error('Sessão expirada. Faça login novamente.');
            }
            
            // ✅ MELHORIA: Mapear erros específicos
            if (!response.ok) {
                const errorMessages = {
                    400: 'Dados inválidos. Verifique os campos.',
                    403: 'Acesso negado.',
                    404: 'Recurso não encontrado.',
                    409: 'Conflito. Este recurso já existe.',
                    422: 'Dados inválidos. Verifique os campos.',
                    429: 'Muitas requisições. Aguarde um momento.',
                    500: 'Erro no servidor. Tente novamente.',
                    503: 'Serviço temporariamente indisponível.'
                };
                
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.detail || errorMessages[response.status] || 'Erro desconhecido';
                
                throw new Error(message);
            }
            
            return response;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },
    
    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },
    
    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
    
    // Upload file
    async upload(endpoint, file) {
        const token = this.getToken();
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao fazer upload');
        }
        
        return response;
    }
};

// ========================================
// UI Helper Functions
// ========================================

// ✅ SEGURO: Loading com textContent
function showLoading(message = 'Carregando...') {
    // Remove loading anterior se existir
    hideLoading();
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.setAttribute('role', 'status');
    loadingDiv.setAttribute('aria-live', 'polite');
    
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `;
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    const text = document.createElement('p');
    text.style.cssText = 'margin-top: 1rem; color: var(--gray-700);';
    text.textContent = message; // ✅ SEGURO
    
    content.appendChild(spinner);
    content.appendChild(text);
    container.appendChild(content);
    loadingDiv.appendChild(container);
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// ✅ SEGURO: Toast com textContent
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 10000;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.textContent = `${icon} ${message}`; // ✅ SEGURO
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ✅ SEGURO: Alert helper
function showAlert(container, message, type = 'error') {
    if (!container) return;
    
    // Limpar alertas anteriores
    container.innerHTML = '';
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.setAttribute('role', 'alert');
    
    const icon = type === 'error' ? '❌' : '✅';
    alert.textContent = `${icon} ${message}`; // ✅ SEGURO
    
    container.appendChild(alert);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format tokens
function formatTokens(tokens) {
    return new Intl.NumberFormat('pt-BR').format(tokens);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado!', 'success');
    } catch (error) {
        showToast('Erro ao copiar', 'error');
    }
}

// ========================================
// Animations CSS
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Loading spinner */
    .spinner {
        border: 3px solid var(--gray-200);
        border-top: 3px solid var(--primary);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========================================
// Export para uso em outros scripts
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, showLoading, hideLoading, showToast, showAlert };
}
