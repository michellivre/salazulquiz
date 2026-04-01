/**
 * SCRIPT DE PROTEÇÃO PARA O FUNIL 'TRUQUE DO SAL AZUL'
 * Bloqueio de Clonagem e Espionagem de Código
 */

(function() {
    // 1. TRAVA DE DOMÍNIO (SEGURANÇA MÁXIMA)
    const allowedDomains = ['penseleve.online', 'github.io', 'localhost', '127.0.0.1'];
    const currentHost = window.location.hostname;
    
    const isAllowed = allowedDomains.some(domain => currentHost.includes(domain));
    
    if (!isAllowed) {
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;text-align:center;padding:20px;"><h1>Acesso Não Autorizado.</h1><p>Este domínio não tem permissão para carregar este conteúdo.</p></div>';
        window.location.href = "https://penseleve.online"; 
        return;
    }

    // 2. BLOQUEIO DE CLIQUE DIREITO
    document.addEventListener('contextmenu', event => event.preventDefault());

    // 3. BLOQUEIO DE TECLAS DE ATALHO (F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I, etc.)
    document.onkeydown = function(e) {
        if (
            e.keyCode == 123 || // F12
            (e.ctrlKey && e.shiftKey && e.keyCode == 73) || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && e.keyCode == 74) || // Ctrl+Shift+J
            (e.ctrlKey && e.keyCode == 85) || // Ctrl+U
            (e.ctrlKey && e.keyCode == 83) || // Ctrl+S
            (e.metaKey && e.keyCode == 85) || // Meta+U (Mac)
            (e.metaKey && e.keyCode == 83) || // Meta+S (Mac)
            (e.metaKey && e.altKey && e.keyCode == 73) // Meta+Alt+I (Mac)
        ) {
            return false;
        }
    };

    // 4. ARMADILHA PARA DEBUGGER (TRAVA QUEM TENTA INSPECIONAR)
    // Isso cria um loop que pausa o navegador se o console estiver aberto
    setInterval(function() {
        (function() {
            return false;
        }['constructor']('debugger')['call']());
    }, 50);

    // 5. BLOQUEIO DE SELEÇÃO DE TEXTO VIA JS (BACKUP DO CSS)
    document.onselectstart = function() { return false; };

    console.log("%c⚠️ PROTEÇÃO ATIVA - PROPRIEDADE DE PENSELEVE.ONLINE ⚠️", "color: red; font-size: 20px; font-weight: bold;");
})();
