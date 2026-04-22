/**
 * Dashboard Principal
 * Orquestra todo o fluxo de criação de notas SOAP
 */

console.log('📄 dashboard.js carregado');
console.log('🌍 API_BASE_URL:', typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'NÃO DEFINIDO');

// Estado global da aplicação
const appState = {
    currentStep: 'context',
    selectedEnvironment: null,
    selectedSpecialty: null,
    audioRecorder: null,
    uploadedAudioId: null,
    currentNoteId: null,
    user: null,
    environmentsData: [] // Armazena ambientes + especialidades
};

console.log('✅ appState inicializado:', appState);

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOMContentLoaded event triggered');
    console.log('🔑 Token presente:', !!localStorage.getItem('access_token'));
    
    try {
        await initializeDashboard();
        await verificarVaultSetup();
    } catch (error) {
        console.error('❌ ERRO CRÍTICO ao inicializar dashboard:', error);
        console.error('Stack trace:', error.stack);
        showToast('Erro ao carregar dashboard: ' + error.message, 'error');
    }
});

/**
 * Inicializa o dashboard
 */
async function initializeDashboard() {
    console.log('🎬 initializeDashboard() iniciando...');
    
    // Verificar autenticação
    const token = localStorage.getItem('access_token');
    console.log('🔐 Token verificado:', token ? 'Presente' : 'Ausente');
    
    if (!token) {
        console.log('⚠️ Sem token, redirecionando para login...');
        window.location.href = '/login.html';
        return;
    }

    try {
        // Tentar restaurar estado anterior (proteção contra logout)
        console.log('💾 Tentando restaurar estado anterior...');
        restoreAppStateFromLocalStorage();
        
        // Carregar informações do usuário
        console.log('👤 Passo 1: Carregar usuário...');
        await loadUserInfo();
        console.log('✅ Passo 1 concluído');

        // Carregar contextos clínicos
        console.log('🏥 Passo 2: Carregar contextos...');
        await loadClinicalContexts();
        console.log('✅ Passo 2 concluído');

        // Configurar event listeners
        console.log('🔧 Passo 3: Setup event listeners...');
        setupEventListeners();
        console.log('✅ Passo 3 concluído');

        // Inicializar gravador de áudio
        console.log('🎤 Passo 4: Inicializar gravador...');
        appState.audioRecorder = new AudioRecorder();
        console.log('✅ Passo 4 concluído');

        console.log('🎉 Dashboard inicializado com sucesso!');
        showToast('Dashboard carregado com sucesso', 'success');
    } catch (error) {
        console.error('❌ Erro durante inicialização:', error);
        throw error;
    }
}

/**
 * Carrega informações do usuário
 */
async function loadUserInfo() {
    try {
        console.log('🔄 Carregando informações do usuário...');
        console.log('📡 Token:', localStorage.getItem('access_token')?.substring(0, 20) + '...');
        
        const response = await apiRequest('/auth/me', 'GET');
        console.log('✅ Usuário carregado:', response);
        
        appState.user = response;
        document.getElementById('user-name').textContent = response.full_name || response.name || response.email;
    } catch (error) {
        console.error('❌ Erro ao carregar usuário:', error);
        console.error('📍 Endpoint chamado:', API_BASE_URL + '/auth/me');
        
        // Se falhar, fazer logout
        showToast('Sessão inválida. Faça login novamente.', 'warning');
        setTimeout(() => logout(), 2000);
    }
}

/**
 * Carrega os contextos clínicos (ambientes e especialidades)
 */
async function loadClinicalContexts() {
    try {
        console.log('🔄 Carregando contextos clínicos...');
        const response = await apiRequest('/clinical-context/environments', 'GET');
        console.log('✅ Resposta recebida:', response);
        
        const environments = response.environments;

        const environmentSelect = document.getElementById('environment');
        environmentSelect.innerHTML = '<option value="">Selecione o ambiente</option>';
        
        environments.forEach(env => {
            const option = document.createElement('option');
            option.value = env.value;        // ✅ CORRIGIDO: era env.id
            option.textContent = env.label;  // ✅ CORRIGIDO: era env.name
            environmentSelect.appendChild(option);
            console.log(`  ➕ Ambiente adicionado: ${env.label}`);
        });

        console.log(`✅ ${environments.length} ambientes carregados no select`);

        // Armazenar mapeamento completo
        appState.environmentsData = response.environments;
    } catch (error) {
        console.error('❌ Erro ao carregar contextos:', error);
        showToast('Erro ao carregar ambientes clínicos', 'error');
    }
}

/**
 * Carrega especialidades de um ambiente
 * Usa os dados já carregados em appState.environmentsData (sem fazer nova chamada à API)
 */
function loadSpecialties(environmentValue) {
    try {
        console.log(`🔄 Carregando especialidades para: ${environmentValue}`);
        
        // Buscar o ambiente nos dados já carregados
        const environmentData = appState.environmentsData.find(env => env.value === environmentValue);
        
        if (!environmentData) {
            console.error('❌ Ambiente não encontrado:', environmentValue);
            showToast('Ambiente não encontrado', 'error');
            return;
        }
        
        console.log('✅ Ambiente encontrado:', environmentData);
        const specialties = environmentData.specialties;

        const specialtySelect = document.getElementById('specialty');
        specialtySelect.innerHTML = '<option value="">Selecione a especialidade</option>';
        specialtySelect.disabled = false;

        specialties.forEach(spec => {
            const option = document.createElement('option');
            option.value = spec.value;
            option.textContent = spec.label;
            specialtySelect.appendChild(option);
            console.log(`  ➕ Especialidade adicionada: ${spec.label}`);
        });
        
        console.log(`✅ ${specialties.length} especialidades carregadas no select`);
    } catch (error) {
        console.error('❌ Erro ao carregar especialidades:', error);
        showToast('Erro ao carregar especialidades', 'error');
    }
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Seleção de contexto
    document.getElementById('environment').addEventListener('change', (e) => {
        const environment = e.target.value;
        appState.selectedEnvironment = environment;
        
        if (environment) {
            loadSpecialties(environment);
        } else {
            document.getElementById('specialty').disabled = true;
            document.getElementById('specialty').innerHTML = '<option value="">Selecione primeiro o ambiente</option>';
            document.getElementById('btn-start-recording').disabled = true;
        }
    });

    document.getElementById('specialty').addEventListener('change', (e) => {
        const specialty = e.target.value;
        appState.selectedSpecialty = specialty;
        
        // Habilitar botão de continuar
        document.getElementById('btn-start-recording').disabled = !specialty;
    });

    // Botões de navegação
    document.getElementById('btn-start-recording').addEventListener('click', () => {
        goToStep('recording');
    });

    // Controles de gravação
    document.getElementById('btn-record').addEventListener('click', handleRecordStart);
    document.getElementById('btn-pause').addEventListener('click', handleRecordPause);
    document.getElementById('btn-stop').addEventListener('click', handleRecordStop);
    document.getElementById('btn-rerecord').addEventListener('click', handleRerecord);
    document.getElementById('btn-upload').addEventListener('click', handleAudioUpload);
    
    // Botão de emergência (pular upload de áudio)
    document.getElementById('btn-skip-to-patient').addEventListener('click', () => {
        console.log('🚨 Modo emergência: pulando upload de áudio');
        showToast('⚠️ Modo teste: sem áudio. Você não poderá gerar SOAP real.', 'warning');
        goToStep('patient');
    });

    // Geração de SOAP
    document.getElementById('btn-generate-soap').addEventListener('click', handleGenerateSOAP);

    // Exportação
    document.getElementById('btn-copy-clipboard').addEventListener('click', () => {
        soapGenerator.copyToClipboard();
    });
    document.getElementById('btn-download-txt').addEventListener('click', () => {
        soapGenerator.downloadTXT();
    });
    document.getElementById('btn-download-pdf').addEventListener('click', () => {
        soapGenerator.downloadPDF();
    });

    // Finalizar nota
    document.getElementById('btn-finalize-note').addEventListener('click', handleFinalizeNote);
    
    // Nova nota
    document.getElementById('btn-new-note').addEventListener('click', handleNewNote);

    // Controles do modal de complemento
    document.getElementById('btn-complement-record').addEventListener('click', handleComplementRecord);
    document.getElementById('btn-complement-stop').addEventListener('click', handleComplementStop);
    document.getElementById('btn-complement-rerecord').addEventListener('click', handleComplementRerecord);
    document.getElementById('btn-complement-send').addEventListener('click', handleComplementSend);

    // Nova nota
    document.getElementById('btn-new-note').addEventListener('click', resetToNewNote);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
}

/**
 * Alterna entre tabs
 */
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if (tabName === 'historico') {
        loadNotesHistory();
    }
}

/**
 * Navega entre steps
 */
function goToStep(stepName) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step-${stepName}`).classList.add('active');
    appState.currentStep = stepName;
}

/**
 * Handlers de gravação de áudio
 */
async function handleRecordStart() {
    try {
        console.log('🎤 handleRecordStart() chamado');
        console.log('📊 Estado inicial do audioRecorder:', appState.audioRecorder);
        
        if (appState.audioRecorder.isStopped()) {
            console.log('🔄 Inicializando audioRecorder...');
            await appState.audioRecorder.initialize();
            console.log('✅ AudioRecorder inicializado');
        }

        if (appState.audioRecorder.isPaused()) {
            console.log('▶️ Resumindo gravação...');
            appState.audioRecorder.resume();
        } else {
            console.log('🔴 Iniciando gravação...');
            appState.audioRecorder.start();
        }

        updateRecordingUI('recording');
        console.log('✅ Gravação iniciada com sucesso');
    } catch (error) {
        console.error('❌ Erro ao iniciar gravação:', error);
        console.error('Detalhes do erro:', error.message, error.name);
        showToast('❌ Erro ao acessar microfone: ' + error.message, 'error');
    }
}

function handleRecordPause() {
    appState.audioRecorder.pause();
    updateRecordingUI('paused');
}

function handleRecordStop() {
    console.log('🛑 handleRecordStop() chamado');
    console.log('📊 Estado do audioRecorder:', appState.audioRecorder);
    
    appState.audioRecorder.stop();
    updateRecordingUI('stopped');
    
    // Aguardar um pouco para garantir que o blob foi gerado
    setTimeout(() => {
        // Mostrar preview do áudio
        const audioBlob = appState.audioRecorder.getAudioBlob();
        const audioURL = appState.audioRecorder.getAudioURL();
        
        console.log('📦 Audio Blob:', audioBlob);
        console.log('🔗 Audio URL:', audioURL);
        console.log('⏱️ Duração:', appState.audioRecorder.getDuration());
        
        if (audioURL && audioBlob) {
            const audioPlayer = document.getElementById('audio-player');
            audioPlayer.src = audioURL;
            document.getElementById('audio-preview').style.display = 'block';
            console.log('✅ Preview do áudio exibido com sucesso');
        } else {
            console.warn('⚠️ Nenhum áudio gravado para preview');
            console.log('🔧 Mostrando botão de emergência...');
            // Mostrar botão de emergência para pular esta etapa
            document.getElementById('btn-skip-to-patient').style.display = 'block';
            showToast('⚠️ Erro ao gravar áudio. Use o botão de emergência para continuar.', 'warning');
        }
    }, 500); // Aguardar 500ms
}

function handleRerecord() {
    appState.audioRecorder.reset();
    document.getElementById('audio-preview').style.display = 'none';
    updateRecordingUI('idle');
}

function updateRecordingUI(state) {
    const statusElement = document.getElementById('recording-status');
    const btnRecord = document.getElementById('btn-record');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');

    // Reset classes
    statusElement.className = '';
    btnRecord.classList.remove('recording');

    switch (state) {
        case 'recording':
            statusElement.textContent = '🔴 Gravando';
            statusElement.className = 'status-recording';
            btnRecord.classList.add('recording');
            btnRecord.disabled = true;
            btnPause.disabled = false;
            btnStop.disabled = false;
            break;
        
        case 'paused':
            statusElement.textContent = '⏸️ Pausado';
            statusElement.className = 'status-paused';
            btnRecord.disabled = false;
            btnRecord.querySelector('.text').textContent = 'Retomar';
            btnPause.disabled = true;
            btnStop.disabled = false;
            break;
        
        case 'stopped':
            statusElement.textContent = '✅ Gravação finalizada';
            statusElement.className = 'status-stopped';
            btnRecord.disabled = true;
            btnPause.disabled = true;
            btnStop.disabled = true;
            break;
        
        case 'idle':
        default:
            statusElement.textContent = 'Aguardando';
            statusElement.className = 'status-idle';
            btnRecord.disabled = false;
            btnRecord.querySelector('.text').textContent = 'Iniciar Gravação';
            btnPause.disabled = true;
            btnStop.disabled = true;
            break;
    }
}

/**
 * Upload do áudio
 */
async function handleAudioUpload() {
    // Salvar estado antes de upload crítico
    saveAppStateToLocalStorage();
    
    try {
        const audioBlob = appState.audioRecorder.getAudioBlob();
        if (!audioBlob) {
            throw new Error('Nenhum áudio gravado');
        }

        showToast('Enviando áudio...', 'info');

        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('environment', appState.selectedEnvironment);
        formData.append('specialty', appState.selectedSpecialty);

        const response = await apiRequest('/audios/upload', 'POST', formData, true);
        appState.uploadedAudioId = response.id;

        showToast('✅ Áudio enviado com sucesso!', 'success');
        console.log('✅ Áudio enviado! ID:', response.id);
        
        // Habilitar botão de gerar SOAP (agora que temos áudio)
        document.getElementById('btn-generate-soap').disabled = false;
        const soapHint = document.getElementById('soap-hint');
        if (soapHint) {
            soapHint.textContent = '✅ Áudio enviado! Preencha os dados e gere a nota SOAP';
            soapHint.style.color = '#059669';
        }
        
        // Ir para próximo passo
        goToStep('patient');
    } catch (error) {
        console.error('Erro ao enviar áudio:', error);
        showToast('Erro ao enviar áudio: ' + error.message, 'error');
    }
}

/**
 * Verifica se o Vault está configurado e solicita setup se necessário
 */
async function verificarVaultSetup() {
    try {
        const response = await apiRequest('/auth/vault/status', 'GET');
        if (!response.configurado) {
            await mostrarSetupPin();
        }
    } catch (error) {
        console.error('Erro ao verificar vault:', error);
    }
}

/**
 * Modal de configuração inicial do PIN do Vault
 */
async function mostrarSetupPin() {
    const modal = `Configure seu PIN do Vault (6 dígitos).

Este PIN protege os dados dos seus pacientes.
IMPORTANTE: Guarde-o em local seguro.
Se esquecer, TODAS as notas ficam irrecuperáveis.

Digite um PIN de 6 dígitos:`;

    let pin = prompt(modal);
    if (!pin || !/^\d{6}$/.test(pin)) {
        alert("PIN deve ter exatamente 6 dígitos numéricos.");
        return mostrarSetupPin();
    }

    const confirmar = prompt("Digite o PIN novamente para confirmar:");
    if (confirmar !== pin) {
        alert("PINs não conferem.");
        return mostrarSetupPin();
    }

    try {
        await apiRequest('/auth/vault/setup', 'POST', { pin });
        sessionStorage.setItem('vault_pin', pin);
        alert("✅ PIN configurado com sucesso!");
    } catch (error) {
        alert("Erro ao configurar PIN: " + error.message);
        throw error;
    }
}

/**
 * Obtém o PIN do Vault (solicita ao usuário se necessário)
 * @returns {Promise<string|null>} PIN de 6 dígitos ou null se inválido/cancelado
 */
async function obterVaultPin() {
    // Tenta recuperar da sessão atual
    let pin = sessionStorage.getItem('vault_pin');
    if (pin) return pin;

    // Solicita ao usuário
    pin = prompt(
        "Digite seu PIN de 6 dígitos do Vault:\n" +
        "(Este PIN protege os dados dos seus pacientes e " +
        "é necessário para gerar notas)"
    );

    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
        alert("PIN inválido. Deve conter exatamente 6 dígitos.");
        return null;
    }

    // Salva na sessão (apagado ao fechar a aba)
    sessionStorage.setItem('vault_pin', pin);
    return pin;
}

/**
 * Limpa o PIN do Vault da sessão
 */
function limparVaultPin() {
    sessionStorage.removeItem('vault_pin');
}

/**
 * Gera nota SOAP
 */
async function handleGenerateSOAP() {
    try {
        // Verificar se o áudio foi enviado
        if (!appState.uploadedAudioId) {
            showToast('❌ Você precisa gravar e enviar um áudio primeiro! Volte para a etapa de gravação.', 'error');
            console.error('Tentativa de gerar SOAP sem áudio enviado. uploadedAudioId:', appState.uploadedAudioId);
            return;
        }

        const patientName = document.getElementById('patient-name').value;
        const patientAge = document.getElementById('patient-age').value;
        const patientGender = document.getElementById('patient-gender').value;
        const chiefComplaint = document.getElementById('chief-complaint').value;

        if (!patientName) {
            showToast('Por favor, informe o nome do paciente', 'warning');
            return;
        }

        // Mostrar indicador de processamento
        document.getElementById('processing-status').style.display = 'block';
        document.getElementById('btn-generate-soap').disabled = true;

        // Passo 1: Buscar status do áudio
        console.log('🔍 Verificando status do áudio...');
        const audioInfo = await apiRequest(`/audios/${appState.uploadedAudioId}`, 'GET');
        console.log('📊 Status do áudio:', audioInfo.status);

        // Só transcrever se ainda não foi transcrito
        if (audioInfo.status === 'uploaded' || audioInfo.status === 'error') {
            console.log('🎤 Iniciando transcrição...');
            document.getElementById('status-transcribing').style.display = 'block';
            await apiRequest(`/audios/${appState.uploadedAudioId}/transcribe`, 'POST');
            console.log('✅ Áudio transcrito com sucesso');
        } else {
            console.log('✅ Áudio já foi transcrito anteriormente, pulando transcrição');
        }
        
        // Passo 2: Obter PIN do Vault
        const vaultPin = await obterVaultPin();
        if (!vaultPin) {
            alert("PIN obrigatório para gerar a nota.");
            document.getElementById('processing-status').style.display = 'none';
            document.getElementById('btn-generate-soap').disabled = false;
            return;
        }
        
        // Passo 3: Gerar SOAP
        document.getElementById('status-transcribing').style.display = 'none';
        document.getElementById('status-generating').style.display = 'block';

        const noteData = {
            audio_id: appState.uploadedAudioId,
            patient_name: patientName,
            patient_age: patientAge ? parseInt(patientAge) : null,
            patient_gender: patientGender || null,
            chief_complaint: chiefComplaint || null
        };

        const response = await apiRequest(
            '/notes/',
            'POST',
            noteData,
            false,
            { 'X-Vault-Pin': vaultPin }
        );
        appState.currentNoteId = response.id;

        showToast('✅ Nota SOAP gerada com sucesso!', 'success');

        // Processar e exibir resultado
        const soapData = {
            soap: {
                subjetivo: response.subjective,
                objetivo: response.objective,
                avaliacao: response.assessment,
                plano: response.plan
            },
            sistemas_nao_abordados: response.sistemas_nao_abordados || [],
            diagnosticos_nanda: response.nanda_diagnoses || []
        };

        soapGenerator.displaySOAPResult(soapData);
        
        // Habilitar botão de finalizar (agora que a nota foi criada)
        document.getElementById('btn-finalize-note').disabled = false;
        
        // Ir para step final
        goToStep('soap');
    } catch (error) {
        console.error('Erro ao gerar SOAP:', error);
        
        // Melhorar mensagem de erro
        let errorMessage = 'Erro desconhecido';
        if (error.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (error.detail) {
            errorMessage = error.detail;
        }
        
        showToast('❌ Erro ao gerar nota SOAP: ' + errorMessage, 'error');
    } finally {
        document.getElementById('processing-status').style.display = 'none';
        document.getElementById('btn-generate-soap').disabled = false;
    }
}

/**
 * Finaliza nota e vai para histórico
 */
async function handleFinalizeNote() {
    try {
        console.log('🏁 handleFinalizeNote() iniciado');
        console.log('📝 currentNoteId:', appState.currentNoteId);
        
        if (!appState.currentNoteId) {
            showToast('❌ Você precisa gerar a nota SOAP primeiro! Clique em "Gerar Nota SOAP" no passo anterior.', 'error');
            return;
        }

        showToast('Salvando edições...', 'info');

        // Coletar valores editados dos campos SOAP
        const updatedData = {
            subjective: document.getElementById('soap-subjective').value,
            objective: document.getElementById('soap-objective').value,
            assessment: document.getElementById('soap-assessment').value,
            plan: document.getElementById('soap-plan').value
        };
        
        console.log('📦 Dados para atualizar:', updatedData);
        console.log('🔗 URL:', `/notes/${appState.currentNoteId}`);

        // Salvar edições
        console.log('📡 Enviando requisição PUT...');
        await apiRequest(`/notes/${appState.currentNoteId}`, 'PUT', updatedData);
        console.log('✅ Requisição PUT bem-sucedida');

        showToast('✅ Nota finalizada com sucesso!', 'success');

        // Resetar estado
        appState.currentNoteId = null;
        appState.uploadedAudioId = null;
        appState.audioRecorder?.reset();
        soapGenerator.reset();

        // Ir para histórico
        switchTab('historico');
        
        // loadNotesHistory() já é chamado automaticamente pelo switchTab

    } catch (error) {
        console.error('Erro ao finalizar nota:', error);
        showToast('Erro ao finalizar nota: ' + error.message, 'error');
    }
}

/**
 * Inicia uma nova nota (volta ao início do fluxo)
 */
function handleNewNote() {
    // Resetar estado
    appState.currentNoteId = null;
    appState.uploadedAudioId = null;
    appState.selectedEnvironment = null;
    appState.selectedSpecialty = null;
    appState.audioRecorder?.reset();
    soapGenerator.reset();

    // Limpar formulários
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-age').value = '';
    document.getElementById('patient-gender').value = '';
    document.getElementById('chief-complaint').value = '';
    
    document.getElementById('environment').value = '';
    document.getElementById('specialty').value = '';
    document.getElementById('specialty').disabled = true;

    // Desabilitar botões (nota e áudio ainda não foram criados)
    document.getElementById('btn-finalize-note').disabled = true;
    document.getElementById('btn-generate-soap').disabled = true;
    
    const soapHint = document.getElementById('soap-hint');
    if (soapHint) {
        soapHint.textContent = '⚠️ Você precisa gravar e enviar um áudio primeiro';
        soapHint.style.color = '#666';
    }

    // Voltar para o primeiro step
    goToStep('context');
    
    showToast('Pronto para criar nova nota!', 'info');
}

/**
 * Carrega histórico de notas
 */
async function loadNotesHistory() {
    console.log('📚 loadNotesHistory() iniciado');
    const container = document.getElementById('notes-history');
    container.innerHTML = '<p class="loading">Carregando histórico...</p>';

    try {
        console.log('📡 Buscando notas do servidor...');
        const response = await apiRequest('/notes/', 'GET');
        console.log('✅ Resposta recebida:', response);
        const notes = response.notes || [];
        console.log(`📊 Total de notas: ${notes.length}`);

        if (notes.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--text-medium); padding: 2rem;">Nenhuma nota criada ainda.</p>';
            return;
        }

        container.innerHTML = notes.map(note => `
            <div class="note-card" onclick="viewNote(${note.id})">
                <div class="note-header">
                    <span class="note-date">${new Date(note.created_at).toLocaleString('pt-BR')}</span>
                    <span class="note-status ${note.status}">${note.status}</span>
                </div>
                <h3 class="note-patient">${note.patient_name}</h3>
                <div class="note-context">
                    ${note.environment || 'Sem ambiente'} • ${note.specialty || 'Sem especialidade'}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        container.innerHTML = '<p class="text-center" style="color: var(--danger-color);">Erro ao carregar histórico.</p>';
    }
}

/**
 * Visualiza uma nota do histórico em modal
 */
async function viewNote(noteId) {
    try {
        showToast('Carregando nota...', 'info');
        const note = await apiRequest(`/notes/${noteId}`, 'GET');
        showNoteModal(note);
    } catch (error) {
        showToast('Erro ao carregar nota: ' + error.message, 'error');
    }
}
window.viewNote = viewNote;

/**
 * Exibe modal com a nota completa
 */
function showNoteModal(note) {
    const statusLabels = {
        draft: 'Rascunho',
        generated: 'Gerada',
        reviewed: 'Revisada',
        finalized: 'Finalizada',
        archived: 'Arquivada'
    };

    // Montar seções NANDA
    const nandaHtml = (note.nanda_diagnoses || []).map(d => `
        <div class="modal-nanda-item">
            <strong>${d.codigo} — ${d.diagnostico}</strong>
            ${d.relacionado_a ? `<p>Relacionado a: ${d.relacionado_a}</p>` : ''}
            ${d.evidenciado_por ? `<p>Evidenciado por: ${d.evidenciado_por}</p>` : ''}
        </div>
    `).join('') || '<p style="color:#6b7280">Nenhum diagnóstico registrado.</p>';

    // Montar sistemas não abordados
    const sistemasHtml = (note.sistemas_nao_abordados || []).map(s => `
        <span class="sistema-tag">${s.sistema}</span>
    `).join('') || '<p style="color:#6b7280">Todos os sistemas foram abordados.</p>';

    const modal = document.createElement('div');
    modal.id = 'note-view-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:700px">
            <div class="modal-header">
                <div>
                    <h2 style="margin:0">${note.patient_name || 'Paciente sem nome'}</h2>
                    <small style="color:#6b7280">
                        ${note.environment || ''} ${note.specialty ? '• ' + note.specialty : ''} &nbsp;|&nbsp;
                        ${new Date(note.created_at).toLocaleString('pt-BR')} &nbsp;|&nbsp;
                        <span class="note-status ${note.status}">${statusLabels[note.status] || note.status}</span>
                    </small>
                </div>
                <button class="modal-close" onclick="closeNoteModal()">✕</button>
            </div>
            <div class="modal-body">
                <!-- SOAP -->
                <div class="soap-section">
                    <h3>📋 SOAP</h3>
                    <div class="soap-field">
                        <label>S — Subjetivo</label>
                        <p>${note.subjective || '<em>Não preenchido</em>'}</p>
                    </div>
                    <div class="soap-field">
                        <label>O — Objetivo</label>
                        <p>${note.objective || '<em>Não preenchido</em>'}</p>
                    </div>
                    <div class="soap-field">
                        <label>A — Avaliação</label>
                        <p>${note.assessment || '<em>Não preenchido</em>'}</p>
                    </div>
                    <div class="soap-field">
                        <label>P — Plano</label>
                        <p>${note.plan || '<em>Não preenchido</em>'}</p>
                    </div>
                </div>

                <!-- NANDA -->
                <div class="soap-section">
                    <h3>🔬 Diagnósticos NANDA</h3>
                    ${nandaHtml}
                </div>

                <!-- Sistemas não abordados -->
                <div class="soap-section">
                    <h3>⚠️ Sistemas Não Abordados</h3>
                    <div style="display:flex;flex-wrap:wrap;gap:8px">${sistemasHtml}</div>
                </div>

                <!-- Ações -->
                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;flex-wrap:wrap">
                    <button class="btn-secondary" onclick="copyNoteToClipboard(${note.id})">📋 Copiar</button>
                    <button class="btn-secondary" onclick="downloadNoteTxt(${note.id})">📄 TXT</button>
                    <button class="btn-primary" onclick="closeNoteModal()">Fechar</button>
                </div>
            </div>
        </div>
    `;

    // Guardar nota para uso nos botões de exportação
    modal._noteData = note;
    document.body.appendChild(modal);

    // Fechar ao clicar fora
    modal.addEventListener('click', e => {
        if (e.target === modal) closeNoteModal();
    });
}

function closeNoteModal() {
    const modal = document.getElementById('note-view-modal');
    if (modal) modal.remove();
}
window.closeNoteModal = closeNoteModal;
window.copyNoteToClipboard = copyNoteToClipboard;
window.downloadNoteTxt = downloadNoteTxt;

/**
 * Copia nota formatada para clipboard (formato e-SUS)
 */
async function copyNoteToClipboard(noteId) {
    try {
        const note = await apiRequest(`/notes/${noteId}`, 'GET');
        const text = formatNoteAsText(note);
        await navigator.clipboard.writeText(text);
        showToast('✅ Nota copiada para área de transferência!', 'success');
    } catch (error) {
        showToast('Erro ao copiar: ' + error.message, 'error');
    }
}

/**
 * Faz download da nota como TXT
 */
async function downloadNoteTxt(noteId) {
    try {
        const note = await apiRequest(`/notes/${noteId}`, 'GET');
        const text = formatNoteAsText(note);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nota_${note.patient_name || 'paciente'}_${new Date(note.created_at).toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('✅ Download iniciado!', 'success');
    } catch (error) {
        showToast('Erro ao baixar: ' + error.message, 'error');
    }
}

/**
 * Formata nota como texto limpo (para e-SUS e TXT)
 */
function formatNoteAsText(note) {
    const date = new Date(note.created_at).toLocaleString('pt-BR');
    const lines = [
        '╔══════════════════════════════════════╗',
        '║         NOTA DE ENFERMAGEM           ║',
        '╚══════════════════════════════════════╝',
        '',
        `Data: ${date}`,
        `Paciente: ${note.patient_name || 'Não informado'}`,
        note.patient_age ? `Idade: ${note.patient_age} anos` : '',
        note.patient_gender ? `Sexo: ${note.patient_gender}` : '',
        note.environment ? `Ambiente: ${note.environment}` : '',
        note.specialty ? `Especialidade: ${note.specialty}` : '',
        '',
        '──────────────────────────────────────',
        'SOAP',
        '──────────────────────────────────────',
        '',
        'S — SUBJETIVO:',
        note.subjective || 'Não preenchido',
        '',
        'O — OBJETIVO:',
        note.objective || 'Não preenchido',
        '',
        'A — AVALIAÇÃO:',
        note.assessment || 'Não preenchido',
        '',
        'P — PLANO:',
        note.plan || 'Não preenchido',
    ];

    // Diagnósticos NANDA
    if (note.nanda_diagnoses && note.nanda_diagnoses.length > 0) {
        lines.push('', '──────────────────────────────────────');
        lines.push('DIAGNÓSTICOS DE ENFERMAGEM (NANDA)');
        lines.push('──────────────────────────────────────');
        note.nanda_diagnoses.forEach((d, i) => {
            lines.push(`\n${i + 1}. ${d.codigo} — ${d.diagnostico}`);
            if (d.relacionado_a) lines.push(`   Relacionado a: ${d.relacionado_a}`);
            if (d.evidenciado_por) lines.push(`   Evidenciado por: ${d.evidenciado_por}`);
        });
    }

    lines.push('', '──────────────────────────────────────');
    lines.push('Gerado pelo iNurseApp');

    return lines.filter(l => l !== undefined).join('\n');
}

/* ==================== FUNCIONALIDADE DE COMPLEMENTO ==================== */

// Estado do complemento
const complementState = {
    sistemaNome: null,
    sistemaIndex: null,
    audioRecorder: null,
    audioId: null
};

/**
 * Mostra modal de gravação de complemento
 */
function showComplementRecordingModal(sistemaNome) {
    complementState.sistemaNome = sistemaNome;
    
    document.getElementById('complement-system-name').textContent = sistemaNome;
    document.getElementById('complement-modal').style.display = 'flex';
    
    // Inicializar gravador de complemento se necessário
    if (!complementState.audioRecorder) {
        complementState.audioRecorder = new AudioRecorder();
        complementState.audioRecorder.canvas = document.getElementById('complement-visualizer');
    }
    
    console.log(`🎤 Modal de complemento aberto para: ${sistemaNome}`);
}

/**
 * Fecha modal de complemento
 */
function closeComplementModal() {
    document.getElementById('complement-modal').style.display = 'none';
    complementState.audioRecorder?.reset();
    document.getElementById('complement-preview').style.display = 'none';
    document.getElementById('btn-complement-record').style.display = 'block';
    document.getElementById('btn-complement-stop').style.display = 'none';
    document.getElementById('complement-duration').style.display = 'none';
}

/**
 * Inicia gravação de complemento
 */
async function handleComplementRecord() {
    try {
        console.log('🎤 Iniciando gravação de complemento...');
        
        if (!complementState.audioRecorder.stream) {
            await complementState.audioRecorder.initialize();
        }
        
        complementState.audioRecorder.start();
        
        document.getElementById('btn-complement-record').style.display = 'none';
        document.getElementById('btn-complement-stop').style.display = 'block';
        document.getElementById('complement-duration').style.display = 'block';
        
        // Iniciar timer
        complementState.startTime = Date.now();
        complementState.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - complementState.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('complement-timer').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao gravar complemento:', error);
        showToast('Erro ao acessar microfone: ' + error.message, 'error');
    }
}

/**
 * Para gravação de complemento
 */
function handleComplementStop() {
    console.log('⏹️ Parando gravação de complemento...');
    
    complementState.audioRecorder.stop();
    clearInterval(complementState.timerInterval);
    
    document.getElementById('btn-complement-record').style.display = 'block';
    document.getElementById('btn-complement-stop').style.display = 'none';
    document.getElementById('complement-duration').style.display = 'none';
    
    // Mostrar preview
    setTimeout(() => {
        const audioURL = complementState.audioRecorder.getAudioURL();
        if (audioURL) {
            document.getElementById('complement-audio-player').src = audioURL;
            document.getElementById('complement-preview').style.display = 'block';
        }
    }, 500);
}

/**
 * Regrava complemento
 */
function handleComplementRerecord() {
    complementState.audioRecorder.reset();
    document.getElementById('complement-preview').style.display = 'none';
    document.getElementById('btn-complement-record').style.display = 'block';
}

/**
 * Envia áudio de complemento e atualiza SOAP
 */
async function handleComplementSend() {
    try {
        // SALVAR ESTADO ANTES DE ENVIAR (proteção contra expiração de sessão)
        saveAppStateToLocalStorage();
        
        const audioBlob = complementState.audioRecorder.getAudioBlob();
        if (!audioBlob) {
            throw new Error('Nenhum áudio gravado');
        }
        
        document.getElementById('complement-processing').style.display = 'block';
        document.getElementById('btn-complement-send').disabled = true;
        
        showToast('📤 Enviando áudio complementar...', 'info');
        
        // Upload do áudio complementar
        const formData = new FormData();
        formData.append('file', audioBlob, 'complement.webm');
        formData.append('environment', appState.selectedEnvironment);
        formData.append('specialty', appState.selectedSpecialty);
        
        const uploadResponse = await apiRequest('/audios/upload', 'POST', formData, true);
        complementState.audioId = uploadResponse.id;
        
        console.log(`✅ Áudio complementar enviado! ID: ${uploadResponse.id}`);
        
        // Transcrever
        showToast('🎤 Transcrevendo complemento...', 'info');
        await apiRequest(`/audios/${uploadResponse.id}/transcribe`, 'POST');
        
        console.log('✅ Complemento transcrito');
        
        // Gerar complemento (economizando tokens!)
        showToast('🤖 Gerando complemento otimizado...', 'info');
        
        const complementData = {
            audio_id: uploadResponse.id,
            systems_to_address: [complementState.sistemaNome],
            target_section: 'assessment'
        };
        
        const complementResponse = await apiRequest(
            `/notes/${appState.currentNoteId}/complement`, 
            'POST', 
            complementData
        );
        
        console.log('✅ Complemento gerado:', complementResponse);
        
        // Atualizar o campo de Avaliação na interface
        document.getElementById('soap-assessment').value = complementResponse.assessment;
        
        showToast(`✅ Complemento adicionado! Economia: ~${complementResponse.tokens_saved || 2500} tokens`, 'success');
        
        // Fechar modal
        closeComplementModal();
        
        // Marcar sistema como incluído
        const element = document.querySelector(`.sistema-item[data-index="${soapGenerator.complementingSystem?.index}"]`);
        if (element) {
            element.style.opacity = '0.6';
            element.querySelector('.sistema-actions').innerHTML = '<span style="color: var(--secondary-color); font-weight: 600;">✓ Complemento Gravado</span>';
        }
        
    } catch (error) {
        console.error('Erro ao processar complemento:', error);
        showToast('Erro ao processar complemento: ' + error.message, 'error');
    } finally {
        document.getElementById('complement-processing').style.display = 'none';
        document.getElementById('btn-complement-send').disabled = false;
    }
}

// Tornar função global
window.showComplementRecordingModal = showComplementRecordingModal;
window.closeComplementModal = closeComplementModal;

/* ==================== PERSISTÊNCIA DE ESTADO ==================== */

/**
 * Salva estado da aplicação no localStorage (proteção contra expiração)
 */
function saveAppStateToLocalStorage() {
    try {
        const stateToSave = {
            currentNoteId: appState.currentNoteId,
            uploadedAudioId: appState.uploadedAudioId,
            selectedEnvironment: appState.selectedEnvironment,
            selectedSpecialty: appState.selectedSpecialty,
            currentStep: appState.currentStep,
            timestamp: Date.now()
        };
        
        localStorage.setItem('inurseapp_state', JSON.stringify(stateToSave));
        console.log('💾 Estado salvo:', stateToSave);
    } catch (error) {
        console.error('Erro ao salvar estado:', error);
    }
}

/**
 * Recupera estado da aplicação (após relogin)
 */
function restoreAppStateFromLocalStorage() {
    try {
        const savedState = localStorage.getItem('inurseapp_state');
        if (!savedState || savedState === 'undefined' || savedState === 'null') return false;
        
        const state = JSON.parse(savedState);
        
        // Verificar se não é muito antigo (máximo 1 hora)
        const age = Date.now() - state.timestamp;
        if (age > 60 * 60 * 1000) {
            localStorage.removeItem('inurseapp_state');
            return false;
        }
        
        // Restaurar estado
        appState.currentNoteId = state.currentNoteId;
        appState.uploadedAudioId = state.uploadedAudioId;
        appState.selectedEnvironment = state.selectedEnvironment;
        appState.selectedSpecialty = state.selectedSpecialty;
        
        console.log('✅ Estado restaurado:', state);
        
        // Mostrar mensagem ao usuário
        if (state.currentNoteId) {
            showToast('⚠️ Sessão restaurada! Você pode continuar de onde parou.', 'info');
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao restaurar estado:', error);
        return false;
    }
}

/**
 * Auto-save periódico
 */
setInterval(() => {
    if (appState.currentNoteId || appState.uploadedAudioId) {
        saveAppStateToLocalStorage();
    }
}, 30000); // Salva a cada 30 segundos

/**
 * Reseta para criar nova nota
 */
function resetToNewNote() {
    // Limpar estado
    appState.currentStep = 'context';
    appState.uploadedAudioId = null;
    appState.currentNoteId = null;

    // Limpar formulários
    document.getElementById('environment').value = '';
    document.getElementById('specialty').value = '';
    document.getElementById('specialty').disabled = true;
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-age').value = '';
    document.getElementById('patient-gender').value = '';
    document.getElementById('chief-complaint').value = '';

    // Limpar áudio
    if (appState.audioRecorder) {
        appState.audioRecorder.reset();
    }
    document.getElementById('audio-preview').style.display = 'none';
    updateRecordingUI('idle');

    // Limpar SOAP
    soapGenerator.reset();

    // Voltar ao primeiro step
    goToStep('context');

    showToast('Pronto para nova nota', 'success');
}

/**
 * Logout
 */
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('vault_pin');
    window.location.href = '/login.html';
}

/**
 * Exibe toast notification
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
