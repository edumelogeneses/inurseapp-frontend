/**
 * SOAP Generator Module
 * Gerencia a exibição, edição e exportação de notas SOAP
 */

class SOAPGenerator {
    constructor() {
        this.currentSOAP = null;
        this.selectedNIC = [];
        this.selectedNOC = [];
        this.includedSystems = [];
    }

    /**
     * Carrega e exibe o resultado SOAP completo
     */
    displaySOAPResult(soapData) {
        this.currentSOAP = soapData;

        // P3: Exibir transcrição original ANTES dos campos SOAP
        this.displayTranscricaoOriginal(
            soapData.transcription_used || soapData.transcricao_usada || null
        );

        // Preencher campos SOAP editáveis
        this.fillSOAPFields(soapData.soap);

        // Exibir sistemas não abordados
        this.displaySistemasNaoAbordados(soapData.sistemas_nao_abordados || []);

        // Exibir diagnósticos NANDA com NIC e NOC
        this.displayDiagnosticosNANDA(soapData.diagnosticos_nanda || []);
    }

    /**
     * P3: Exibe seção "Transcrição Original" antes do SOAP
     * Permite ao profissional conferir se a captura de voz funcionou
     */
    displayTranscricaoOriginal(transcricao) {
        // Reutiliza container existente ou cria dinamicamente antes do SOAP
        let container = document.getElementById('transcricao-original-section');

        if (!transcricao) {
            if (container) container.style.display = 'none';
            return;
        }

        // Criar seção dinamicamente se não existir no HTML
        if (!container) {
            const soapSection = document.getElementById('soap-result') ||
                                document.querySelector('.soap-fields') ||
                                document.querySelector('.soap-section');
            if (!soapSection) return;

            container = document.createElement('div');
            container.id = 'transcricao-original-section';
            container.className = 'transcricao-original-section';
            soapSection.parentNode.insertBefore(container, soapSection);
        }

        container.innerHTML = '';
        container.style.display = 'block';

        // Header
        const header = document.createElement('div');
        header.className = 'transcricao-header';

        const title = this._criarElemento('h3', '📝 Transcrição Original', 'transcricao-title');
        const subtitle = this._criarElemento('p',
            'Verifique se a captura de voz reproduziu corretamente o atendimento antes de confiar na nota gerada.',
            'transcricao-subtitle'
        );

        const btnCopiar = this._criarElemento('button', '📋 Copiar Transcrição', 'btn-copiar-transcricao');
        btnCopiar.addEventListener('click', () => {
            navigator.clipboard.writeText(transcricao).then(() => {
                btnCopiar.textContent = '✓ Copiado!';
                setTimeout(() => { btnCopiar.textContent = '📋 Copiar Transcrição'; }, 2000);
            });
        });

        header.appendChild(title);
        header.appendChild(subtitle);
        header.appendChild(btnCopiar);
        container.appendChild(header);

        // Caixa de texto
        const box = document.createElement('div');
        box.className = 'transcricao-box';
        box.textContent = transcricao; // textContent — seguro contra XSS
        container.appendChild(box);
    }

    /**
     * Preenche os campos SOAP
     */
    fillSOAPFields(soap) {
        document.getElementById('soap-subjective').value = soap.subjetivo || '';
        document.getElementById('soap-objective').value = soap.objetivo || '';
        document.getElementById('soap-assessment').value = soap.avaliacao || '';
        document.getElementById('soap-plan').value = soap.plano || '';
    }

    /**
     * C5: Cria elemento DOM com textContent (seguro contra XSS)
     */
    _criarElemento(tag, texto, className) {
        const el = document.createElement(tag);
        if (texto) el.textContent = texto;
        if (className) el.className = className;
        return el;
    }

    /**
     * C5: Exibe sistemas não abordados com criação segura de DOM
     */
    displaySistemasNaoAbordados(sistemas) {
        const container = document.getElementById('sistemas-nao-abordados');
        container.innerHTML = '';

        // Filtrar sugestões já dispensadas
        const ativos = (sistemas || []).filter(s => !s.dispensada);
        
        if (ativos.length === 0) {
            const p = this._criarElemento('p', '✅ Todos os sistemas relevantes foram abordados na consulta.', 'text-center');
            p.style.color = 'var(--text-medium)';
            container.appendChild(p);
            return;
        }

        ativos.forEach((sistema, index) => {
            // Wrapper do card
            const card = document.createElement('div');
            card.className = 'sistema-item';
            card.dataset.index = index;
            card.dataset.categoria = sistema.categoria || sistema.sistema || '';

            // Conteúdo — C5: textContent escapa HTML automaticamente
            const content = document.createElement('div');
            content.className = 'sistema-content';
            content.appendChild(this._criarElemento('h4', sistema.sistema));
            content.appendChild(this._criarElemento('p', sistema.sugestao));

            // P4: exibir "Texto pronto" se disponível
            if (sistema.texto_sugerido) {
                const textoBox = document.createElement('div');
                textoBox.className = 'texto-sugerido-preview';
                textoBox.textContent = sistema.texto_sugerido;
                content.appendChild(textoBox);
            }
            card.appendChild(content);

            // Botões de ação
            const actions = document.createElement('div');
            actions.className = 'sistema-actions';

            const btnGravar = this._criarElemento('button', '🎤 Gravar Complemento', 'btn-record-complement');
            btnGravar.title = 'Gravar áudio complementar para este sistema';
            btnGravar.addEventListener('click', () => this.iniciarComplemento(sistema.sistema, index, sistema.categoria));

            const btnIncluir = this._criarElemento('button', '✍️ Incluir Texto', 'btn-incluir');
            btnIncluir.title = 'Incluir texto sugerido na nota';
            btnIncluir.addEventListener('click', () => this.incluirSistema(index));

            const btnIgnorar = this._criarElemento('button', '❌ Ignorar', 'btn-ignorar');
            btnIgnorar.title = 'Dispensar esta sugestão';
            btnIgnorar.addEventListener('click', () => this.ignorarSistema(index, sistema.categoria || sistema.sistema));

            // P4: botão "Copiar Texto Pronto" — só aparece se texto_sugerido disponível
            if (sistema.texto_sugerido) {
                const btnCopiar = this._criarElemento('button', '📋 Copiar Texto Pronto', 'btn-copiar-sugestao');
                btnCopiar.title = 'Copiar texto sugerido para área de transferência';
                btnCopiar.addEventListener('click', () => {
                    navigator.clipboard.writeText(sistema.texto_sugerido).then(() => {
                        btnCopiar.textContent = '✓ Copiado!';
                        setTimeout(() => { btnCopiar.textContent = '📋 Copiar Texto Pronto'; }, 2000);
                    });
                });
                actions.appendChild(btnCopiar);
            }

            actions.appendChild(btnGravar);
            actions.appendChild(btnIncluir);
            actions.appendChild(btnIgnorar);
            card.appendChild(actions);

            container.appendChild(card);
        });
    }

    /**
     * C3: Incluir texto na seção correta e persistir no banco via endpoint /complement
     */
    async incluirSistema(index) {
        const sistema = this.currentSOAP.sistemas_nao_abordados.filter(s => !s.dispensada)[index];
        if (!sistema) return;

        // C1: PIN do Vault
        const vaultPin = await obterVaultPin();
        if (!vaultPin) {
            alert("PIN obrigatório para incluir texto na nota.");
            return;
        }

        // Calcular seção destino (C2: reutiliza TARGET_SECTION_MAP do dashboard.js)
        const targetSection = typeof getTargetSection === 'function'
            ? getTargetSection(sistema.categoria || sistema.sistema)
            : 'assessment';

        const textoAdicional = `${sistema.sistema}: ${sistema.sugestao}`;

        // Feedback imediato no DOM
        const sectionFieldMap = {
            'subjective': 'soap-subjective',
            'objective':  'soap-objective',
            'assessment': 'soap-assessment',
            'plan':       'soap-plan',
        };
        const fieldId = sectionFieldMap[targetSection] || 'soap-assessment';
        const field = document.getElementById(fieldId);
        if (field) field.value = (field.value ? field.value + '\n\n' : '') + textoAdicional;

        // Marcar visualmente enquanto persiste
        const element = document.querySelector(`.sistema-item[data-index="${index}"]`);
        if (element) {
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
            const actionsEl = element.querySelector('.sistema-actions');
            if (actionsEl) {
                actionsEl.innerHTML = '';
                const span = document.createElement('span');
                span.style.color = 'var(--secondary-color)';
                span.style.fontWeight = '600';
                span.textContent = '⏳ Salvando...';
                actionsEl.appendChild(span);
            }
        }

        // C3: Persistir no banco via endpoint de complemento
        try {
            const currentNoteId = window.appState?.currentNoteId;
            if (currentNoteId) {
                await apiRequest(
                    `/notes/${currentNoteId}/complement`,
                    'POST',
                    {
                        audio_id: null,
                        tipo: 'texto',
                        conteudo: textoAdicional,
                        systems_to_address: [sistema.sistema],
                        target_section: targetSection,
                    },
                    false,
                    { 'X-Vault-Pin': vaultPin }
                );
            }
            this.includedSystems.push(index);
            if (element) {
                element.style.pointerEvents = 'none';
                const actionsEl = element.querySelector('.sistema-actions');
                if (actionsEl) {
                    actionsEl.innerHTML = '';
                    const span = document.createElement('span');
                    span.style.color = 'var(--secondary-color)';
                    span.style.fontWeight = '600';
                    span.textContent = '✓ Incluído';
                    actionsEl.appendChild(span);
                }
            }
            showToast('Sistema incluído na avaliação', 'success');
        } catch (err) {
            console.error('Erro ao persistir inclusão de sistema:', err);
            showToast('Texto incluído localmente (erro ao salvar no servidor)', 'warning');
            if (element) {
                element.style.opacity = '0.5';
                element.style.pointerEvents = 'none';
            }
        }
    }

    /**
     * C4: Ignorar sistema — persiste no banco via endpoint dismiss-suggestion
     */
    async ignorarSistema(index, categoria) {
        const element = document.querySelector(`.sistema-item[data-index="${index}"]`);
        
        // Ocultar imediatamente para UX responsiva
        if (element) element.style.display = 'none';
        showToast('Sistema ignorado', 'info');

        // C4: Persistir dispensa no banco (audit trail)
        try {
            const currentNoteId = window.appState?.currentNoteId;
            if (currentNoteId && categoria) {
                await apiRequest(
                    `/notes/${currentNoteId}/dismiss-suggestion`,
                    'POST',
                    { categoria }
                );
            }
        } catch (err) {
            console.error('Erro ao persistir dispensa de sistema:', err);
        }
    }

    /**
     * Inicia gravação de complemento para um sistema específico
     * @param {string} sistemaNome  - Nome exibível do sistema
     * @param {number} index        - Índice no array de sistemas ativos
     * @param {string} [categoria]  - Categoria normalizada para TARGET_SECTION_MAP
     */
    iniciarComplemento(sistemaNome, index, categoria) {
        console.log(`🎤 Iniciando complemento para: ${sistemaNome}`);
        
        // Armazenar qual sistema está sendo complementado (inclui categoria para C2)
        this.complementingSystem = {
            nome: sistemaNome,
            index: index,
            categoria: categoria || sistemaNome
        };
        
        // Mostrar modal de gravação de complemento
        if (typeof showComplementRecordingModal === 'function') {
            showComplementRecordingModal(sistemaNome);
        } else {
            showToast(`🎤 Grave um áudio complementando: ${sistemaNome}`, 'info');
            window.dispatchEvent(new CustomEvent('startComplement', { 
                detail: { sistema: sistemaNome, index: index, categoria }
            }));
        }
    }

    /**
     * Exibe diagnósticos NANDA com NIC e NOC integrados
     */
    displayDiagnosticosNANDA(diagnosticos) {
        const container = document.getElementById('diagnosticos-nanda');
        
        if (diagnosticos.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--text-medium);">Nenhum diagnóstico de enfermagem identificado.</p>';
            return;
        }

        container.innerHTML = diagnosticos.map((diag, diagIndex) => `
            <div class="diagnostico-item" data-diag-index="${diagIndex}">
                <div class="diagnostico-header">
                    <span class="diagnostico-codigo">${diag.codigo}</span>
                    <h3 class="diagnostico-title">${diag.diagnostico}</h3>
                </div>
                
                <div class="diagnostico-details">
                    <div class="detail-row">
                        <div class="detail-label">Relacionado a:</div>
                        <div class="detail-value">${diag.relacionado_a || 'Não especificado'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Evidenciado por:</div>
                        <div class="detail-value">${diag.evidenciado_por || 'Não especificado'}</div>
                    </div>
                </div>

                ${this.renderNICList(diag.nic || [], diagIndex)}
                ${this.renderNOCList(diag.noc || [], diagIndex)}
            </div>
        `).join('');

        // Adicionar event listeners para checkboxes
        this.attachCheckboxListeners();
    }

    /**
     * Renderiza lista de intervenções NIC
     */
    renderNICList(nicList, diagIndex) {
        if (nicList.length === 0) {
            return '<div class="interventions-section"><p style="color: var(--text-medium); font-size: 0.875rem;">Nenhuma intervenção NIC sugerida.</p></div>';
        }

        return `
            <div class="interventions-section">
                <h4 class="section-title">🩺 Intervenções de Enfermagem (NIC)</h4>
                <div class="nic-list">
                    ${nicList.map((nic, nicIndex) => `
                        <div class="nic-item ${nic.selecionado ? 'selected' : ''}" 
                             data-diag-index="${diagIndex}" 
                             data-nic-index="${nicIndex}">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" 
                                       class="checkbox nic-checkbox" 
                                       ${nic.selecionado ? 'checked' : ''}
                                       data-diag-index="${diagIndex}"
                                       data-nic-index="${nicIndex}">
                            </div>
                            <div class="item-content">
                                <span class="item-codigo">NIC ${nic.codigo}</span>
                                <div class="item-text">${nic.intervencao}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza lista de resultados NOC
     */
    renderNOCList(nocList, diagIndex) {
        if (nocList.length === 0) {
            return '<div class="outcomes-section"><p style="color: var(--text-medium); font-size: 0.875rem;">Nenhum resultado NOC sugerido.</p></div>';
        }

        return `
            <div class="outcomes-section">
                <h4 class="section-title">🎯 Resultados Esperados (NOC)</h4>
                <div class="noc-list">
                    ${nocList.map((noc, nocIndex) => `
                        <div class="noc-item ${noc.selecionado ? 'selected' : ''}" 
                             data-diag-index="${diagIndex}" 
                             data-noc-index="${nocIndex}">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" 
                                       class="checkbox noc-checkbox" 
                                       ${noc.selecionado ? 'checked' : ''}
                                       data-diag-index="${diagIndex}"
                                       data-noc-index="${nocIndex}">
                            </div>
                            <div class="item-content">
                                <span class="item-codigo">NOC ${noc.codigo}</span>
                                <div class="item-text">${noc.resultado}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Adiciona listeners aos checkboxes
     */
    attachCheckboxListeners() {
        // NIC checkboxes
        document.querySelectorAll('.nic-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const diagIndex = parseInt(e.target.dataset.diagIndex);
                const nicIndex = parseInt(e.target.dataset.nicIndex);
                const isChecked = e.target.checked;
                
                // Atualizar estado no objeto
                this.currentSOAP.diagnosticos_nanda[diagIndex].nic[nicIndex].selecionado = isChecked;
                
                // Atualizar visual
                const nicItem = e.target.closest('.nic-item');
                if (isChecked) {
                    nicItem.classList.add('selected');
                } else {
                    nicItem.classList.remove('selected');
                }
            });
        });

        // NOC checkboxes
        document.querySelectorAll('.noc-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const diagIndex = parseInt(e.target.dataset.diagIndex);
                const nocIndex = parseInt(e.target.dataset.nocIndex);
                const isChecked = e.target.checked;
                
                // Atualizar estado no objeto
                this.currentSOAP.diagnosticos_nanda[diagIndex].noc[nocIndex].selecionado = isChecked;
                
                // Atualizar visual
                const nocItem = e.target.closest('.noc-item');
                if (isChecked) {
                    nocItem.classList.add('selected');
                } else {
                    nocItem.classList.remove('selected');
                }
            });
        });
    }

    /**
     * Monta o texto final da nota para exportação
     */
    buildFinalNote() {
        const soap = {
            subjetivo: document.getElementById('soap-subjective').value,
            objetivo: document.getElementById('soap-objective').value,
            avaliacao: document.getElementById('soap-assessment').value,
            plano: document.getElementById('soap-plan').value
        };

        let finalText = '';
        
        // SOAP
        finalText += '═══════════════════════════════════════════════════\n';
        finalText += '                    NOTA SOAP                      \n';
        finalText += '═══════════════════════════════════════════════════\n\n';
        
        finalText += '📝 SUBJETIVO\n';
        finalText += '─────────────────────────────────────────────────\n';
        finalText += soap.subjetivo + '\n\n';
        
        finalText += '🔍 OBJETIVO\n';
        finalText += '─────────────────────────────────────────────────\n';
        finalText += soap.objetivo + '\n\n';
        
        finalText += '💡 AVALIAÇÃO\n';
        finalText += '─────────────────────────────────────────────────\n';
        finalText += soap.avaliacao + '\n\n';
        
        finalText += '📋 PLANO\n';
        finalText += '─────────────────────────────────────────────────\n';
        finalText += soap.plano + '\n\n';

        // Diagnósticos NANDA selecionados
        const selectedDiagnostics = this.getSelectedDiagnostics();
        if (selectedDiagnostics.length > 0) {
            finalText += '═══════════════════════════════════════════════════\n';
            finalText += '        DIAGNÓSTICOS DE ENFERMAGEM (NANDA-I)       \n';
            finalText += '═══════════════════════════════════════════════════\n\n';

            selectedDiagnostics.forEach((diag, index) => {
                finalText += `${index + 1}. ${diag.codigo} - ${diag.diagnostico}\n`;
                if (diag.relacionado_a) {
                    finalText += `   Relacionado a: ${diag.relacionado_a}\n`;
                }
                if (diag.evidenciado_por) {
                    finalText += `   Evidenciado por: ${diag.evidenciado_por}\n`;
                }
                
                // NIC selecionadas
                const selectedNIC = diag.nic.filter(n => n.selecionado);
                if (selectedNIC.length > 0) {
                    finalText += '\n   INTERVENÇÕES (NIC):\n';
                    selectedNIC.forEach(nic => {
                        finalText += `   • ${nic.codigo} - ${nic.intervencao}\n`;
                    });
                }
                
                // NOC selecionados
                const selectedNOC = diag.noc.filter(n => n.selecionado);
                if (selectedNOC.length > 0) {
                    finalText += '\n   RESULTADOS ESPERADOS (NOC):\n';
                    selectedNOC.forEach(noc => {
                        finalText += `   • ${noc.codigo} - ${noc.resultado}\n`;
                    });
                }
                
                finalText += '\n';
            });
        }

        finalText += '═══════════════════════════════════════════════════\n';
        finalText += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
        finalText += 'iNurseApp - Sistema de Documentação de Enfermagem\n';
        finalText += '═══════════════════════════════════════════════════\n';

        return finalText;
    }

    /**
     * Retorna apenas os diagnósticos que têm ao menos uma NIC ou NOC selecionada
     */
    getSelectedDiagnostics() {
        if (!this.currentSOAP || !this.currentSOAP.diagnosticos_nanda) {
            return [];
        }

        return this.currentSOAP.diagnosticos_nanda.filter(diag => {
            const hasSelectedNIC = diag.nic.some(n => n.selecionado);
            const hasSelectedNOC = diag.noc.some(n => n.selecionado);
            return hasSelectedNIC || hasSelectedNOC;
        });
    }

    /**
     * Copia nota para clipboard (formato e-SUS limpo)
     */
    copyToClipboard() {
        const finalNote = this.buildFinalNote();
        
        navigator.clipboard.writeText(finalNote).then(() => {
            showToast('✅ Nota copiada para área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            showToast('Erro ao copiar nota', 'error');
        });
    }

    /**
     * Download TXT
     */
    downloadTXT() {
        const finalNote = this.buildFinalNote();
        const blob = new Blob([finalNote], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nota-soap-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('📄 Nota baixada em TXT', 'success');
    }

    /**
     * Download PDF (simples)
     */
    downloadPDF() {
        const finalNote = this.buildFinalNote();
        
        // Criar PDF simples usando window.print com estilo customizado
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Nota SOAP - iNurseApp</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        padding: 40px;
                        font-size: 12px;
                        line-height: 1.6;
                    }
                    pre {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                </style>
            </head>
            <body>
                <pre>${finalNote}</pre>
            </body>
            </html>
        `);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
        
        showToast('📑 Abrindo para impressão/salvar PDF', 'info');
    }

    /**
     * Reset para nova nota
     */
    reset() {
        this.currentSOAP = null;
        this.selectedNIC = [];
        this.selectedNOC = [];
        this.includedSystems = [];
    }
}

// Instância global
const soapGenerator = new SOAPGenerator();
window.soapGenerator = soapGenerator;
