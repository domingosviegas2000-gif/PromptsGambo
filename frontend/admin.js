
// ===== DADOS INICIAIS (depois vem do Firebase) =====
let prompts = [
  { id: 1, titulo: "Floresta Magica", prompt: "Uma floresta magica ao por do sol, estilo fantasia, 4k", categoria: "Natureza", emoji: "🌲", premium: false },
  { id: 2, titulo: "Cidade Cyberpunk", prompt: "Cidade futurista a noite com luzes de neon, cyberpunk", categoria: "Urbano", emoji: "🏙️", premium: false },
  { id: 3, titulo: "Guerreira Medieval", prompt: "Retrato de guerreira medieval com armadura dourada", categoria: "Fantasia", emoji: "⚔️", premium: true },
  { id: 4, titulo: "Oceano Profundo", prompt: "Fundo do oceano com criaturas bioluminescentes, 8k", categoria: "Natureza", emoji: "🌊", premium: true },
  { id: 5, titulo: "Dragao de Fogo", prompt: "Dragao gigante a cuspir fogo sobre montanhas nevadas", categoria: "Fantasia", emoji: "🐉", premium: false },
  { id: 6, titulo: "Retrato Futurista", prompt: "Retrato de humano com implantes ciberneticos, neon", categoria: "Pessoas", emoji: "🤖", premium: true },
];

let utilizadores = [
  { id: 1, nome: "Joao Silva", email: "joao@email.com", plano: "Premium", data: "2024-01-15" },
  { id: 2, nome: "Maria Santos", email: "maria@email.com", plano: "Gratis", data: "2024-02-20" },
  { id: 3, nome: "Pedro Costa", email: "pedro@email.com", plano: "Anual", data: "2024-03-10" },
];

let pagamentos = [
  { id: 1, utilizador: "Joao Silva", plano: "Premium", metodo: "Visa", valor: "9.99€", data: "2024-01-15", estado: "pago" },
  { id: 2, utilizador: "Pedro Costa", plano: "Anual", metodo: "Multicaixa", valor: "79.99€", data: "2024-03-10", estado: "pago" },
  { id: 3, utilizador: "Ana Lima", plano: "Premium", metodo: "Binance", valor: "9.99€", data: "2024-04-01", estado: "pendente" },
];

let promptEditandoId = null;

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", () => {
  verificarAdmin();
  carregarEstatisticas();
  carregarPrompts();
});

// ===== VERIFICAR ADMIN =====
function verificarAdmin() {
  const admin = localStorage.getItem("adminLogado");
  if (!admin) {
    window.location.href = "login.html";
  }
}

// ===== ESTATISTICAS =====
function carregarEstatisticas() {
  document.getElementById("total-utilizadores").textContent = utilizadores.length;
  document.getElementById("total-premium").textContent = utilizadores.filter(u => u.plano !== "Gratis").length;
  document.getElementById("total-prompts").textContent = prompts.length;
  const receita = pagamentos.filter(p => p.estado === "pago").reduce((acc, p) => acc + parseFloat(p.valor), 0);
  document.getElementById("total-receita").textContent = receita.toFixed(2) + "€";
}

// ===== MOSTRAR SECAO =====
function mostrarSecao(secao) {
  document.querySelectorAll(".admin-secao").forEach(s => s.style.display = "none");
  document.getElementById("secao-" + secao).style.display = "block";
  if (secao === "utilizadores") carregarUtilizadores();
  if (secao === "pagamentos") carregarPagamentos();
}

// ===== PROMPTS =====
function carregarPrompts() {
  const lista = document.getElementById("lista-prompts-admin");
  lista.innerHTML = "";
  prompts.forEach(p => {
    const linha = document.createElement("div");
    linha.className = "tabela-linha";
    linha.innerHTML =
      "<span>" + p.emoji + " " + p.titulo + "</span>" +
      "<span>" + p.categoria + "</span>" +
      "<span class='" + (p.premium ? "badge-premium" : "badge-gratis") + "'>" + (p.premium ? "Premium" : "Gratis") + "</span>" +
      "<span class='acoes'>" +
        "<button class='btn-editar' onclick='editarPrompt(" + p.id + ")'>✏️ Editar</button>" +
        "<button class='btn-apagar' onclick='apagarPrompt(" + p.id + ")'>🗑️ Apagar</button>" +
        "<button class='" + (p.premium ? "btn-tornar-gratis" : "btn-tornar-premium") + "' onclick='togglePremium(" + p.id + ")'>" +
          (p.premium ? "🔓 Tornar Gratis" : "🔒 Tornar Premium") +
        "</button>" +
      "</span>";
    lista.appendChild(linha);
  });
}

// ===== TOGGLE PREMIUM =====
function togglePremium(id) {
  const prompt = prompts.find(p => p.id === id);
  if (prompt) {
    prompt.premium = !prompt.premium;
    carregarPrompts();
    carregarEstatisticas();
    alert((prompt.premium ? "🔒 Prompt tornado Premium!" : "🔓 Prompt tornado Gratis!"));
  }
}

// ===== EDITAR PROMPT =====
function editarPrompt(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;
  promptEditandoId = id;
  document.getElementById("prompt-titulo").value = prompt.titulo;
  document.getElementById("prompt-texto").value = prompt.prompt;
  document.getElementById("prompt-emoji").value = prompt.emoji;
  document.getElementById("prompt-categoria").value = prompt.categoria;
  document.getElementById("prompt-premium").checked = prompt.premium;
  document.getElementById("modal-titulo").textContent = "Editar Prompt";
  abrirModalPrompt();
}

// ===== APAGAR PROMPT =====
function apagarPrompt(id) {
  if (confirm("Tens a certeza que queres apagar este prompt?")) {
    prompts = prompts.filter(p => p.id !== id);
    carregarPrompts();
    carregarEstatisticas();
    alert("🗑️ Prompt apagado!");
  }
}

// ===== GUARDAR PROMPT =====
function guardarPrompt() {
  const titulo = document.getElementById("prompt-titulo").value;
  const texto = document.getElementById("prompt-texto").value;
  const emoji = document.getElementById("prompt-emoji").value;
  const categoria = document.getElementById("prompt-categoria").value;
  const premium = document.getElementById("prompt-premium").checked;

  if (!titulo || !texto || !categoria) {
    alert("Preenche todos os campos!");
    return;
  }

  if (promptEditandoId) {
    const prompt = prompts.find(p => p.id === promptEditandoId);
    prompt.titulo = titulo;
    prompt.prompt = texto;
    prompt.emoji = emoji || "✨";
    prompt.categoria = categoria;
    prompt.premium = premium;
    alert("✅ Prompt atualizado!");
  } else {
    const novoId = prompts.length + 1;
    prompts.push({ id: novoId, titulo, prompt: texto, emoji: emoji || "✨", categoria, premium });
    alert("✅ Prompt adicionado!");
  }

  promptEditandoId = null;
  fecharModal();
  carregarPrompts();
  carregarEstatisticas();
}

// ===== UTILIZADORES =====
function carregarUtilizadores() {
  const lista = document.getElementById("lista-utilizadores-admin");
  lista.innerHTML = "";
  utilizadores.forEach(u => {
    const linha = document.createElement("div");
    linha.className = "tabela-linha";
    linha.innerHTML =
      "<span>" + u.nome + "</span>" +
      "<span>" + u.email + "</span>" +
      "<span class='" + (u.plano !== "Gratis" ? "badge-premium" : "badge-gratis") + "'>" + u.plano + "</span>" +
      "<span class='acoes'>" +
        "<button class='btn-apagar' onclick='apagarUtilizador(" + u.id + ")'>🗑️ Remover</button>" +
      "</span>";
    lista.appendChild(linha);
  });
}

function apagarUtilizador(id) {
  if (confirm("Tens a certeza que queres remover este utilizador?")) {
    utilizadores = utilizadores.filter(u => u.id !== id);
    carregarUtilizadores();
    carregarEstatisticas();
    alert("🗑️ Utilizador removido!");
  }
}

// ===== PAGAMENTOS =====
function carregarPagamentos() {
  const lista = document.getElementById("lista-pagamentos-admin");
  lista.innerHTML = "";
  pagamentos.forEach(p => {
    const linha = document.createElement("div");
    linha.className = "tabela-linha";
    linha.innerHTML =
      "<span>" + p.utilizador + "</span>" +
      "<span>" + p.plano + "</span>" +
      "<span>" + p.metodo + "</span>" +
      "<span>" + p.valor + "</span>" +
      "<span>" + p.data + "</span>" +
      "<span class='" + (p.estado === "pago" ? "badge-premium" : "badge-pendente") + "'>" + p.estado + "</span>";
    lista.appendChild(linha);
  });
}

// ===== MODAL =====
function abrirModalPrompt() {
  document.getElementById("modal-prompt").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("modal-prompt").classList.remove("ativo");
  document.getElementById("overlay").classList.remove("ativo");
  document.getElementById("prompt-titulo").value = "";
  document.getElementById("prompt-texto").value = "";
  document.getElementById("prompt-emoji").value = "";
  document.getElementById("prompt-categoria").value = "";
  document.getElementById("prompt-premium").checked = false;
  document.getElementById("modal-titulo").textContent = "Adicionar Prompt";
  promptEditandoId = null;
}

// ===== LOGOUT ADMIN =====
function logoutAdmin() {
  localStorage.removeItem("adminLogado");
  window.location.href = "login.html";
}
