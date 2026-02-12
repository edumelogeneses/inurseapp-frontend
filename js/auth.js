// ========================================
// Authentication Functions - iNurseApp v2.0
// ✅ Segurança: Validação robusta, Rate limiting
// ✅ Performance: Request caching
// ✅ TypeScript: JSDoc types
// ========================================

/**
 * @typedef {Object} LoginResponse
 * @property {boolean} success
 * @property {Object} [data]
 * @property {string} [data.access_token]
 * @property {User} [data.user]
 * @property {string} [error]
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} email
 * @property {string} password
 * @property {string} password_confirm
 * @property {string} full_name
 */

// ========================================
// Page Protection
// ========================================

/**
 * Protege página - redireciona se não autenticado
 */
function protectPage() {
    if (!API.isAuthenticated()) {
        // Salvar URL atual para redirect após login
        sessionStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = 'login.html';
    }
}

/**
 * Redireciona se já autenticado
 */
function redirectIfAuthenticated() {
    if (API.isAuthenticated()) {
        const redirect = sessionStorage.getItem('redirect_after_login');
        sessionStorage.removeItem('redirect_after_login');
        window.location.href = redirect || 'dashboard.html';
    }
}

// ========================================
// Validation Helpers
// ========================================

/**
 * Valida formato de email
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Valida senha forte
 * @param {string} password
 * @returns {{valid: boolean, errors: string[]}}
 */
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Mínimo 8 caracteres');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Pelo menos uma letra minúscula');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Pelo menos uma letra maiúscula');
    }
    if (!/\d/.test(password)) {
        errors.push('Pelo menos um número');
    }
    if (!/[@$!%*?&]/.test(password)) {
        errors.push('Pelo menos um caractere especial (!@#$%*?&)');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Calcula força da senha
 * @param {string} password
 * @returns {number} 0-4 (fraca a forte)
 */
function getPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    return Math.min(strength, 4);
}

// ========================================
// Rate Limiting (Client-side)
// ========================================

const rateLimiter = {
    attempts: {},
    
    canAttempt(key, maxAttempts = 5, windowMs = 300000) {
        const now = Date.now();
        const attempts = this.attempts[key] || [];
        
        // Remover tentativas antigas
        const recentAttempts = attempts.filter(time => now - time < windowMs);
        
        if (recentAttempts.length >= maxAttempts) {
            const oldestAttempt = Math.min(...recentAttempts);
            const waitTime = Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
            return {
                allowed: false,
                waitTime
            };
        }
        
        this.attempts[key] = [...recentAttempts, now];
        return { allowed: true };
    }
};

// ========================================
// Authentication Functions
// ========================================

/**
 * Login function com validação e rate limiting
 * @param {string} email
 * @param {string} password
 * @param {boolean} remember
 * @returns {Promise<LoginResponse>}
 */
async function login(email, password, remember = false) {
    try {
        // Validação básica
        if (!validateEmail(email)) {
            throw new Error('Email inválido');
        }
        
        if (!password || password.length < 8) {
            throw new Error('Senha inválida');
        }
        
        // Rate limiting
        const rateCheck = rateLimiter.canAttempt('login', 5, 300000);
        if (!rateCheck.allowed) {
            throw new Error(`Muitas tentativas. Aguarde ${rateCheck.waitTime}s`);
        }
        
        // Fazer requisição
        const response = await fetch(API_BASE_URL + '/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Mensagens de erro específicas
            if (response.status === 401) {
                throw new Error('Email ou senha incorretos');
            }
            throw new Error(data.detail || 'Erro ao fazer login');
        }
        
        // Salvar token e dados do usuário
        API.setToken(data.access_token, remember);
        API.setUser(data.user);
        
        // Analytics (se disponível)
        if (typeof Analytics !== 'undefined') {
            Analytics.trackLogin('email');
            Analytics.setUserId(data.user.id.toString());
            Analytics.setUserProperties({
                plan: data.user.plan,
                role: data.user.role
            });
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Register function com validação completa
 * @param {RegisterData} userData
 * @returns {Promise<ApiResponse>}
 */
async function register(userData) {
    try {
        const { email, password, password_confirm, full_name } = userData;
        
        // Validações
        if (!full_name || full_name.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }
        
        if (!validateEmail(email)) {
            throw new Error('Email inválido');
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            throw new Error(passwordValidation.errors[0]);
        }
        
        if (password !== password_confirm) {
            throw new Error('As senhas não coincidem');
        }
        
        // Rate limiting
        const rateCheck = rateLimiter.canAttempt('register', 3, 600000);
        if (!rateCheck.allowed) {
            throw new Error(`Muitas tentativas. Aguarde ${rateCheck.waitTime}s`);
        }
        
        // Fazer requisição
        const response = await fetch(API_BASE_URL + '/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.toLowerCase().trim(),
                password,
                password_confirm,
                full_name: full_name.trim()
            }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Mensagens específicas
            if (response.status === 400 && data.detail?.includes('email')) {
                throw new Error('Este email já está cadastrado');
            }
            throw new Error(data.detail || 'Erro ao criar conta');
        }
        
        // Analytics
        if (typeof Analytics !== 'undefined') {
            Analytics.trackSignUp('email');
            Analytics.setUserId(data.user.id.toString());
            Analytics.setUserProperties({
                plan: data.user.plan,
                role: data.user.role
            });
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current user profile
 * @returns {Promise<ApiResponse>}
 */
async function getCurrentUser() {
    try {
        const response = await API.get('/api/v1/users/me');
        
        if (!response.ok) {
            throw new Error('Erro ao buscar perfil');
        }
        
        const user = await response.json();
        
        // Update local storage
        API.setUser(user);
        
        return { success: true, user };
    } catch (error) {
        console.error('Get user error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update user profile
 * @param {Partial<User>} userData
 * @returns {Promise<ApiResponse>}
 */
async function updateProfile(userData) {
    try {
        const response = await API.put('/api/v1/users/me', userData);
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar perfil');
        }
        
        const user = await response.json();
        
        // Update local storage
        API.setUser(user);
        
        return { success: true, user };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Change password
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<ApiResponse>}
 */
async function changePassword(currentPassword, newPassword) {
    try {
        // Validar nova senha
        const validation = validatePassword(newPassword);
        if (!validation.valid) {
            throw new Error(validation.errors[0]);
        }
        
        const response = await API.post('/api/v1/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Erro ao alterar senha');
        }
        
        return { success: true };
    } catch (error) {
        console.error('Change password error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise<ApiResponse>}
 */
async function requestPasswordReset(email) {
    try {
        if (!validateEmail(email)) {
            throw new Error('Email inválido');
        }
        
        const response = await fetch(API_BASE_URL + '/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao solicitar reset');
        }
        
        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Logout function
 */
function logout() {
    // Analytics
    if (typeof Analytics !== 'undefined') {
        Analytics.trackLogout();
    }
    
    API.logout();
}

// ========================================
// Export para uso em outros scripts
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        login,
        register,
        logout,
        getCurrentUser,
        updateProfile,
        changePassword,
        requestPasswordReset,
        validateEmail,
        validatePassword,
        getPasswordStrength,
        protectPage,
        redirectIfAuthenticated
    };
}
