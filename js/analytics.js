/**
 * Google Analytics Configuration
 * iNurseApp v2.0
 * 
 * Features:
 * - Page views tracking
 * - Custom events
 * - User properties
 * - E-commerce tracking ready
 * - Error tracking
 * - Performance metrics
 */

// ============================================
// CONFIGURATION
// ============================================

const GA_CONFIG = {
    // Google Analytics ID
    measurementId: 'G-5F3XF8G5KN',
    
    // Opções
    options: {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
    },
    
    // Debug mode (apenas desenvolvimento)
    debug: window.location.hostname === 'localhost'
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Inicializa o Google Analytics
 */
function initAnalytics() {
    if (!GA_CONFIG.measurementId || GA_CONFIG.measurementId === 'G-XXXXXXXXXX') {
        console.warn('⚠️ Google Analytics não configurado. Defina measurementId em js/analytics.js');
        return;
    }
    
    // Log de debug
    if (GA_CONFIG.debug) {
        console.log('📊 Google Analytics iniciado (debug mode)');
    }
    
    // Configurar propriedades do usuário
    const user = API?.getUser();
    if (user) {
        setUserProperties({
            user_id: user.id,
            plan: user.plan,
            role: user.role
        });
    }
    
    // Rastrear erros
    trackErrors();
    
    // Rastrear performance
    trackPerformance();
}

// ============================================
// PAGE TRACKING
// ============================================

/**
 * Rastrear visualização de página
 * @param {string} pagePath - Caminho da página
 * @param {string} pageTitle - Título da página
 */
function trackPageView(pagePath, pageTitle) {
    if (typeof gtag !== 'function') return;
    
    gtag('event', 'page_view', {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title,
        page_location: window.location.href
    });
    
    if (GA_CONFIG.debug) {
        console.log('📄 Page view:', pagePath || window.location.pathname);
    }
}

// ============================================
// CUSTOM EVENTS
// ============================================

/**
 * Rastrear evento customizado
 * @param {string} eventName - Nome do evento
 * @param {object} params - Parâmetros do evento
 */
function trackEvent(eventName, params = {}) {
    if (typeof gtag !== 'function') return;
    
    gtag('event', eventName, params);
    
    if (GA_CONFIG.debug) {
        console.log('📊 Event:', eventName, params);
    }
}

// ============================================
// USER EVENTS
// ============================================

/**
 * Rastrear registro de usuário
 * @param {string} method - Método de registro (email, google, etc)
 */
function trackSignUp(method = 'email') {
    trackEvent('sign_up', {
        method: method,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrear login
 * @param {string} method - Método de login
 */
function trackLogin(method = 'email') {
    trackEvent('login', {
        method: method,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrear logout
 */
function trackLogout() {
    trackEvent('logout', {
        timestamp: new Date().toISOString()
    });
}

// ============================================
// SUBSCRIPTION EVENTS
// ============================================

/**
 * Rastrear visualização de plano
 * @param {string} plan - Nome do plano (FREE, PRO, ENTERPRISE)
 */
function trackViewPlan(plan) {
    trackEvent('view_plan', {
        plan: plan,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrear início de checkout
 * @param {string} plan - Nome do plano
 * @param {number} value - Valor do plano
 */
function trackBeginCheckout(plan, value) {
    trackEvent('begin_checkout', {
        plan: plan,
        value: value,
        currency: 'BRL',
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrear compra concluída
 * @param {string} plan - Nome do plano
 * @param {number} value - Valor da compra
 * @param {string} transactionId - ID da transação
 */
function trackPurchase(plan, value, transactionId) {
    trackEvent('purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'BRL',
        plan: plan,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrear cancelamento de assinatura
 * @param {string} plan - Plano cancelado
 * @param {string} reason - Motivo do cancelamento
 */
function trackCancelSubscription(plan, reason = '') {
    trackEvent('cancel_subscription', {
        plan: plan,
        reason: reason,
        timestamp: new Date().toISOString()
    });
}

// ============================================
// FEATURE USAGE EVENTS
// ============================================

/**
 * Rastrear gravação de consulta
 * @param {number} duration - Duração em segundos
 */
function trackRecordConsultation(duration) {
    trackEvent('record_consultation', {
        duration_seconds: duration,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrear geração de SOAP
 * @param {boolean} success - Se foi bem-sucedido
 * @param {number} tokensUsed - Tokens utilizados
 */
function trackGenerateSOAP(success, tokensUsed) {
    trackEvent('generate_soap', {
        success: success,
        tokens_used: tokensUsed,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrear download de prontuário
 * @param {string} format - Formato (PDF, DOCX)
 */
function trackDownloadRecord(format) {
    trackEvent('download_record', {
        format: format,
        timestamp: new Date().toISOString()
    });
}

// ============================================
// USER PROPERTIES
// ============================================

/**
 * Definir propriedades do usuário
 * @param {object} properties - Propriedades customizadas
 */
function setUserProperties(properties) {
    if (typeof gtag !== 'function') return;
    
    gtag('set', 'user_properties', properties);
    
    if (GA_CONFIG.debug) {
        console.log('👤 User properties:', properties);
    }
}

/**
 * Definir ID do usuário
 * @param {string} userId - ID único do usuário
 */
function setUserId(userId) {
    if (typeof gtag !== 'function') return;
    
    gtag('set', { user_id: userId });
    
    if (GA_CONFIG.debug) {
        console.log('👤 User ID:', userId);
    }
}

// ============================================
// ERROR TRACKING
// ============================================

/**
 * Rastrear erros JavaScript
 */
function trackErrors() {
    window.addEventListener('error', (event) => {
        trackEvent('exception', {
            description: `${event.message} at ${event.filename}:${event.lineno}`,
            fatal: false
        });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        trackEvent('exception', {
            description: `Unhandled Promise: ${event.reason}`,
            fatal: false
        });
    });
}

/**
 * Rastrear erro customizado
 * @param {string} description - Descrição do erro
 * @param {boolean} fatal - Se é um erro fatal
 */
function trackError(description, fatal = false) {
    trackEvent('exception', {
        description: description,
        fatal: fatal
    });
}

// ============================================
// PERFORMANCE TRACKING
// ============================================

/**
 * Rastrear métricas de performance
 */
function trackPerformance() {
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            trackEvent('web_vitals', {
                metric_name: 'LCP',
                value: lastEntry.renderTime || lastEntry.loadTime,
                metric_rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs_improvement' : 'poor'
            });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const firstInput = list.getEntries()[0];
            const fid = firstInput.processingStart - firstInput.startTime;
            
            trackEvent('web_vitals', {
                metric_name: 'FID',
                value: fid,
                metric_rating: fid < 100 ? 'good' : fid < 300 ? 'needs_improvement' : 'poor'
            });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
    }
    
    // Cumulative Layout Shift (CLS)
    if ('LayoutShift' in window) {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                }
            }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // Enviar CLS quando a página for escondida
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                trackEvent('web_vitals', {
                    metric_name: 'CLS',
                    value: clsScore,
                    metric_rating: clsScore < 0.1 ? 'good' : clsScore < 0.25 ? 'needs_improvement' : 'poor'
                });
            }
        });
    }
}

/**
 * Rastrear timing customizado
 * @param {string} name - Nome da métrica
 * @param {number} value - Valor em milissegundos
 * @param {string} category - Categoria
 */
function trackTiming(name, value, category = 'Performance') {
    trackEvent('timing_complete', {
        name: name,
        value: value,
        event_category: category
    });
}

// ============================================
// ENGAGEMENT
// ============================================

/**
 * Rastrear scroll profundidade
 */
function trackScrollDepth() {
    const depths = [25, 50, 75, 100];
    const triggered = new Set();
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        depths.forEach(depth => {
            if (scrollPercent >= depth && !triggered.has(depth)) {
                trackEvent('scroll', {
                    percent_scrolled: depth
                });
                triggered.add(depth);
            }
        });
    });
}

/**
 * Rastrear tempo na página
 */
function trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        
        trackEvent('time_on_page', {
            seconds: timeSpent,
            page: window.location.pathname
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// Rastrear scroll e tempo (opcional)
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    trackScrollDepth();
    trackTimeOnPage();
}

// ============================================
// EXPORTS (para uso global)
// ============================================

window.Analytics = {
    init: initAnalytics,
    trackPageView,
    trackEvent,
    trackSignUp,
    trackLogin,
    trackLogout,
    trackViewPlan,
    trackBeginCheckout,
    trackPurchase,
    trackCancelSubscription,
    trackRecordConsultation,
    trackGenerateSOAP,
    trackDownloadRecord,
    setUserProperties,
    setUserId,
    trackError,
    trackTiming
};
