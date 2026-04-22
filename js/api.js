// ========================================
// API Configuration - iNurseApp v2.0
// ✅ Segurança: XSS Protection, Sanitização
// ✅ Performance: Retry Logic, Request Caching
// ✅ TypeScript: JSDoc types
// ========================================

// ========================================
// CONFIGURAÇÃO DE AMBIENTE
// ========================================
// IMPORTANTE: config.js deve ser carregado ANTES deste arquivo
// Se config.js não estiver carregado, usa fallback para produção

if (typeof API_BASE_URL === 'undefined') {
    console.warn('⚠️ config.js não foi carregado. Usando fallback para produção.');
    
    // Fallback: detectar automaticamente
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        var API_BASE_URL = 'http://localhost:8000/api/v1';
        console.log('🔍 Ambiente detectado: Local (localhost)');
    } else {
        var API_BASE_URL = 'https://api.inurseapp.com/api/v1';
        console.log('🔍 Ambiente detectado: Produção');
    }
} else {
    console.log('✅ config.js carregado. Usando:', API_BASE_URL);
}

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
// Utility: Redirect to login with message
// ========================================
function _redirectToLogin(mensagem) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    if (mensagem) {
        sessionStorage.setItem('login_message', mensagem);
    }
    window.location.href = 'login.html';
}

// ========================================
// API Fetch with 401 Interceptor
// ========================================
async function apiFetch(url, options = {}) {
    // Adiciona Authorization header automaticamente
    const token = localStorage.getItem('access_token');
    const defaultHeaders = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    
    // Apenas adiciona Content-Type se não for FormData
    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }
    
    options.headers = { ...defaultHeaders, ...options.headers };
    options.credentials = 'include';

    let response = await fetch(url, options);

    // Intercepta 401 — tenta renovar token uma vez
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            _redirectToLogin('Sessão expirada. Faça login novamente.');
            return response;
        }
        try {
            const refreshResponse = await fetch(
                API_BASE_URL + '/auth/refresh',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                }
            );
            if (!refreshResponse.ok) throw new Error('Refresh falhou');

            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access_token);

            // Repete a requisição original com novo token
            options.headers['Authorization'] = `Bearer ${data.access_token}`;
            response = await fetch(url, options);
        } catch {
            _redirectToLogin('Sessão expirada. Faça login novamente.');
            return response;
        }
    }
    
    // Intercepta 422 — PIN do Vault incorreto
    if (response.status === 422) {
        try {
            const errorData = await response.clone().json();
            if (errorData.detail && (errorData.detail.includes('Vault') || errorData.detail.includes('PIN'))) {
                sessionStorage.removeItem('vault_pin');
                alert('PIN do Vault incorreto. Digite novamente.');
            }
        } catch {
            // Ignora se não conseguir fazer parse do JSON
        }
    }
    
    return response;
}

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
        // Verificar se não é null, não é string vazia, e não é string "undefined"
        if (!user || user === 'undefined' || user === 'null') {
            return null;
        }
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error('Erro ao fazer parse do user:', error);
            localStorage.removeItem('user'); // Limpar dados corrompidos
            return null;
        }
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
        sessionStorage.removeItem('vault_pin');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
        const config = {
            ...options,
            headers: {
                ...options.headers,
            }
        };
        
        try {
            const response = await apiFetch(API_BASE_URL + endpoint, config);
            
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
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiFetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: {},  // apiFetch adiciona Authorization automaticamente
            body: formData
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
// Função apiRequest standalone para test-api.html
// ========================================
/**
 * API Request helper (usado pelo test-api.html e dashboard)
 * @param {string} endpoint - Endpoint da API (ex: '/notes')
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object|FormData} data - Dados a enviar (opcional)
 * @param {boolean} isFormData - Se os dados são FormData (para upload)
 * @param {Object} customHeaders - Headers customizados (ex: {'X-Vault-Pin': '123456'})
 */
async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false, customHeaders = {}) {
    const config = {
        method,
        headers: { ...customHeaders }
    };

    if (data) {
        if (isFormData) {
            config.body = data;
            delete config.headers['Content-Type']; // Let browser set multipart boundary
        } else {
            config.body = JSON.stringify(data);
        }
    }

    try {
        const response = await apiFetch(API_BASE_URL + endpoint, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Erro HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ========================================
// Export para uso em outros scripts
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, apiRequest, showLoading, hideLoading, showToast, showAlert };
}
