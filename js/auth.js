// ========================================
// Authentication Functions - iNurseApp
// ========================================

// Protect page - redirect if not authenticated
function protectPage() {
    if (!API.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Redirect if already authenticated
function redirectIfAuthenticated() {
    if (API.isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch(API_BASE_URL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Erro ao fazer login');
        }
        
        // Save token and user data
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Register function
async function register(userData) {
    try {
        const response = await fetch(API_BASE_URL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Erro ao criar conta');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user profile
async function getCurrentUser() {
    try {
        const response = await API.get('/auth/me');
        
        if (!response.ok) {
            throw new Error('Erro ao buscar perfil');
        }
        
        const user = await response.json();
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Update user profile
async function updateProfile(userData) {
    try {
        const response = await API.put('/auth/me', userData);
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar perfil');
        }
        
        const user = await response.json();
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Change password
async function changePassword(currentPassword, newPassword) {
    try {
        const response = await API.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword
        });
        
        if (!response.ok) {
            throw new Error('Erro ao alterar senha');
        }
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout function
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('vault_pin');
    window.location.href = 'login.html';
}

// Password strength indicator (0-4)
// Critérios alinhados com o backend (app/schemas/user.py):
//   1 — mínimo 8 caracteres
//   2 — + letra maiúscula
//   3 — + letra minúscula
//   4 — + número
function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    return score;
}
