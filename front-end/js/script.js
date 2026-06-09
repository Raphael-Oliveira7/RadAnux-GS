/**
 * Rad Anux - Landing Page Javascript Behavior
 * Projetado para alunos de 1º semestre - Código limpo e estruturado.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. ATUALIZAÇÃO DO DISPLAY DE RADIAÇÃO (SLIDER)
    // ----------------------------------------------------
    const radInput = document.getElementById("sim-radiation");
    const radDisplay = document.getElementById("rad-val-display");

    if (radInput && radDisplay) {
        radInput.addEventListener("input", (e) => {
            radDisplay.textContent = e.target.value;
        });
    }

    // ----------------------------------------------------
    // 2. SCROLL SPY - DEIXAR CLARO A SEÇÃO ATUAL NO MENU
    // ----------------------------------------------------
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    function scrollSpy() {
        let currentSectionId = "";
        
        // Verifica qual seção está mais visível na viewport
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Se o scroll atual ultrapassou o início da seção (menos uma margem do cabeçalho)
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute("id");
            }
        });

        // Atualiza a classe active nos links de navegação
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }

    // Executa no scroll da página
    window.addEventListener("scroll", scrollSpy);
    // Executa uma vez no início caso o usuário recarregue no meio da página
    scrollSpy();

    // ----------------------------------------------------
    // 3. SIMULADOR INTERATIVO DE BIT-FLIPS
    // ----------------------------------------------------
    const btnRunSim = document.getElementById("btn-run-sim");
    const terminal = document.getElementById("sim-terminal");
    const ledGreen = document.getElementById("led-green");
    const ledRed = document.getElementById("led-red");
    const simScore = document.getElementById("sim-score");

    if (btnRunSim && terminal && ledGreen && ledRed && simScore) {
        btnRunSim.addEventListener("click", () => {
            // Desativa o botão durante a simulação
            btnRunSim.disabled = true;
            btnRunSim.textContent = "Simulando...";
            btnRunSim.style.opacity = "0.6";

            // Limpa o terminal e desliga os LEDs
            terminal.innerHTML = "";
            ledGreen.classList.remove("active");
            ledRed.classList.remove("active");
            simScore.textContent = "--%";

            // Lê o valor atual do coeficiente k
            const k = parseFloat(radInput.value);

            // Sequência de logs simulados representando as etapas do User Flow
            const logs = [
                { text: "[INÍCIO] Conectando à esteira CI/CD...", delay: 500, type: "info" },
                { text: "[TELA] Dashboard de testes inicializado.", delay: 1000, type: "info" },
                { text: `[CONFIG] Cenário de teste: Órbita com Fator de Radiação k = ${k}`, delay: 1600, type: "info" },
                { text: "[SISTEMA] Iniciando bombardeio de radiação simulada...", delay: 2400, type: "warning" },
                { text: "[TESTE 1] Injetando Bit-Flip na variável 'velocidade_propulsor'...", delay: 3200, type: "warning" }
            ];

            // Executa os logs iniciais
            logs.forEach(log => {
                setTimeout(() => {
                    printLog(log.text, log.type === "warning");
                }, log.delay);
            });

            // Etapa de decisão com base no fator de radiação 'k'
            // Se k for maior que 0.07, simulamos que uma das variáveis críticas sofre falha total (Crash)
            const systemCrashed = k > 0.07;

            // Teste 1: Recuperação (Sempre sucesso no primeiro teste)
            setTimeout(() => {
                ledGreen.classList.add("active");
                printLog("[LOG] Watchdog ativado: 'velocidade_propulsor' recuperada com sucesso em 14ms.", false);
            }, 3800);

            // Teste 2: Injeção crítica
            setTimeout(() => {
                ledGreen.classList.remove("active");
                printLog("[TESTE 2] Injetando Bit-Flip na variável 'angulo_direcionamento'...", true);
            }, 4600);

            setTimeout(() => {
                if (systemCrashed) {
                    ledRed.classList.add("active");
                    printLog("[CRITICAL FAIL] Crash do sistema detectado! Transbordo de memória no propulsor.", true);
                } else {
                    ledGreen.classList.add("active");
                    printLog("[LOG] Autocorreção: 'angulo_direcionamento' restaurado em 26ms via tripla redundância.", false);
                }
            }, 5300);

            // Finalização do teste
            setTimeout(() => {
                printLog("[PROCESSAMENTO] Finalizando testes. Gerando relatório exponencial...", false);
            }, 6200);

            setTimeout(() => {
                // Cálculo de score simulado
                let finalScore = 100;
                if (systemCrashed) {
                    // Se quebrou, score cai muito
                    finalScore = Math.round(95 - (k * 700));
                    if (finalScore < 0) finalScore = 0;
                    
                    ledGreen.classList.remove("active");
                    ledRed.classList.add("active");
                    printLog(`[CONCLUÍDO] Score de resiliência baixo. Teste reprovado.`, true);
                } else {
                    // Se passou, score fica alto
                    finalScore = Math.round(100 - (k * 100));
                    
                    ledGreen.classList.add("active");
                    ledRed.classList.remove("active");
                    printLog(`[CONCLUÍDO] Score de resiliência ideal. Satélite pronto para órbita.`, false);
                }

                simScore.textContent = `${finalScore}%`;

                // Reabilita o botão
                btnRunSim.disabled = false;
                btnRunSim.textContent = "Iniciar Teste";
                btnRunSim.style.opacity = "1";
            }, 7000);
        });
    }

    // Função auxiliar para printar linhas no terminal simulado
    function printLog(text, isError) {
        const line = document.createElement("div");
        line.classList.add("terminal-line");
        if (isError) {
            line.classList.add("error");
        }
        line.textContent = `> ${text}`;
        terminal.appendChild(line);
        // Rola o terminal para o fim
        terminal.scrollTop = terminal.scrollHeight;
    }
});