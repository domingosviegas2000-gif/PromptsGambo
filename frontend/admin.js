
let prompts = [
  { id: 1, titulo: "Floresta Magica", prompt: "Uma floresta magica ao por do sol, estilo fantasia, 4k", instrucoes: "Cola no Midjourney. Adiciona --ar 16:9 para widescreen.", categoria: "Natureza", emoji: "🌲", premium: false, likes: 24 },
  { id: 2, titulo: "Cidade Cyberpunk", prompt: "Cidade futurista a noite com luzes de neon, cyberpunk", instrucoes: "Ideal para Midjourney v6. Adiciona --style raw para mais realismo.", categoria: "Urbano", emoji: "🏙️", premium: false, likes: 41 },
  { id: 3, titulo: "Guerreira Medieval", prompt: "Retrato de guerreira medieval com armadura dourada", instrucoes: "Usa no Stable Diffusion. Adiciona Greg Rutkowski para estilo epico.", categoria: "Fantasia", emoji: "⚔️", premium: true, likes: 89 },
  { id: 4, titulo: "Oceano Profundo", prompt: "Fundo do oceano com criaturas bioluminescentes, 8k", instrucoes: "Funciona no DALL-E 3. Adiciona: highly detailed, cinematic lighting.", categoria: "Natureza", emoji: "🌊", premium: true, likes: 67 },
  { id: 5, titulo: "Dragao de Fogo", prompt: "Dragao gigante a cuspir fogo sobre montanhas nevadas", instrucoes: "Melhor no Midjourney v6. Adiciona --chaos 20 para variacoes.", categoria: "Fantasia", emoji: "🐉", premium: false, likes: 112 },
  { id: 6, titulo: "Retrato Futurista", prompt: "Retrato de humano com implantes ciberneticos, neon", instrucoes: "Usa no Midjourney ou SDXL. Adiciona: photorealistic, 8k, sharp focus.", categoria: "Pessoas", emoji: "🤖", premium: true, likes: 55 },
  { id: 7, titulo: "Leao Majestoso", prompt: "Leao majestoso no savana ao por do sol, fotorrealista", instrucoes: "Excelente para DALL-E 3. Adiciona: golden hour, National Geographic style.", categoria: "Animais", emoji: "🦁", premium: false, likes: 33 },
  { id: 8, titulo: "Galaxia Espiral", prompt: "Galaxia espiral colorida no espaco profundo, nebulosa, 8k", instrucoes: "Ideal para qualquer IA. Adiciona nomes de nebulosas reais para mais detalhe.", categoria: "Espaco", emoji: "🌌", premium: true, likes: 78 },
];

let utilizadores = [
  { id: 1, nome: "Joao Silva", email: "joao@email.com", plano: "Premium" },
  { id: 2, nome: "Maria Santos", email: "maria@email.com", plano: "Gratis" },
];

let pagamentos = [
  { id: 1, utilizador: "Joao Silva", plano: "Premium", metodo: "Visa", valor: "9.99€", estado: "pago" },
  { id: 2, utilizador: "Pedro Costa", plano: "Anual", metodo: "Multicaixa", valor: "79.99€", estado: "pago" },
];

let promptEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
  verificarAdmin();
  carregarEstatisticas();
  carregarPrompts();
});

function verificarAdmin() {
  if (!localStorage.getItem("adminLogado")) {
    window.location.href = "login.html";
  }
}

function carregarEstatisticas() {
  document.getElementById("total-utilizadores").textContent = utilizadores.length;
  document.getElementById("total-premium").textContent = utilizadores.filter(u => u.plano !== "Gratis").length;
  document.getElementById("total-prompts").textContent = prompts.length;
  document.getElementById("total-receita").textContent = "89.97€";
}

function mostrarSecao(secao) {
  document.querySelectorAll(".admin-secao").forEach(s => s.style.display = "none");
  document.getElementById("secao-" + secao).style.display = "block";
  if (secao === "utilizadores") carregarUtilizadores();
  if (secao === "pagamentos") carregarPagamentos();
}

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
        "<button class='btn-editar' onclick='editarPrompt(" + p.id + ")'>✏️</button>" +
        "<button class='btn-apagar' onclick='apagarPrompt(" + p.id + ")'>🗑️</button>" +
        "<button class='" + (p.premium ? "btn-tornar-gratis" : "btn-tornar-premium") + "' onclick='togglePremium(" + p.id + ")'>" +
          (p.premium ? "🔓 Gratis" : "🔒 Premium") +
        "</button>" +
      "</span>";
    lista.appendChild(linha);
  });
}

function togglePremium(id) {
  const prompt = prompts.find(p => p.id === id);
  if (prompt) {
    prompt.premium = !prompt.premium;
    carregarPrompts();
    alert(prompt.premium ? "🔒 Tornado Premium!" : "🔓 Tornado Gratis!");
  }
}

function editarPrompt(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;
  promptEditandoId = id;
  document.getElementById("prompt-titulo").value = prompt.titulo;
  document.getElementById("prompt-texto").value = prompt.prompt;
  document.getElementById("prompt-instrucoes").value = prompt.instrucoes || "";
  document.getElementById("prompt-emoji").value = prompt.emoji;
  document.getElementById("prompt-categoria").value = prompt.categoria;
  document.getElementById("prompt-premium").checked = prompt.premium;
  document.getElementById("modal-titulo").textContent = "Editar Prompt";
  abrirModalPrompt();
}

function apagarPrompt(id) {
  if (confirm("Apagar este prompt?")) {
    prompts = prompts.filter(p => p.id !== id);
    carregarPrompts();
    carregarEstatisticas();
  }
}

function guardarPrompt() {
  const titulo = document.getElementById("prompt-titulo").value;
  const texto = document.getElementById("prompt-texto").value;
  const instrucoes = document.getElementById("prompt-instrucoes").value;
  const emoji = document.getElementById("prompt-emoji").value || "✨";
  const categoria = document.getElementById("prompt-categoria").value;
  const premium = document.getElementById("prompt-premium").checked;

  if (!titulo || !texto || !categoria) { alert("Preenche todos os campos!"); return; }

  if (promptEditandoId) {
    const prompt = prompts.find(p => p.id === promptEditandoId);
    Object.assign(prompt, { titulo, prompt: texto, instrucoes, emoji, categoria, premium });
    alert("✅ Prompt atualizado!");
  } else {
    prompts.push({ id: prompts.length + 1, titulo, prompt: texto, instrucoes, emoji, categoria, premium, likes: 0 });
    alert("✅ Prompt adicionado!");
  }

  promptEditandoId = null;
  fecharModal();
  carregarPrompts();
  carregarEstatisticas();
}

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
      "<span><button class='btn-apagar' onclick='apagarUtilizador(" + u.id + ")'>🗑️</button></span>";
    lista.appendChild(linha);
  });
}

function apagarUtilizador(id) {
  if (confirm("Remover utilizador?")) {
    utilizadores = utilizadores.filter(u => u.id !== id);
    carregarUtilizadores();
    carregarEstatisticas();
  }
}

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
      "<span class='" + (p.estado === "pago" ? "badge-gratis" : "badge-pendente") + "'>" + p.estado + "</span>";
    lista.appendChild(linha);
  });
}

function abrirModalPrompt() {
  document.getElementById("modal-prompt").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("modal-prompt").classList.remove("ativo");
  document.getElementById("overlay").classList.remove("ativo");
  promptEditandoId = null;
}

function logoutAdmin() {
  localStorage.removeItem("adminLogado");
  window.location.href = "login.html";
}
