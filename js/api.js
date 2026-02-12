// ========================================
// API Configuration - iNurseApp
// ========================================

const API_BASE_URL = 'https://lively-embrace-production-a4a2.up.railway.app';

// API Helper Functions
const API = {
    // Get auth token
    getToken() {
        return localStorage.getItem('access_token');
    },
    
    // Get user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },
    
    // Logout
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },
    
    // Make authenticated request
    async request(endpoint, options = {}) {
        const token = this.getToken();
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        };
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(API_BASE_URL + endpoint, config);
        
        // Se não autorizado, fazer logout
        if (response.status === 401) {
            this.logout();
            return;
        }
        
        return response;
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
            body: formData
        });
        
        return response;
    }
};

// Show loading spinner
function showLoading(message = 'Carregando...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div style="
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
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
            ">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; color: var(--gray-700);">${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

// Hide loading spinner
function hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 10000;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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

// Animations
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
`;
document.head.appendChild(style);
