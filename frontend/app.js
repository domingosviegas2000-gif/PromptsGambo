app_js = '''
// ===== PROMPTS LOCAIS (fallback se Firebase falhar) =====
const promptsLocais = [
  { id: "1", titulo: "Floresta Magica", prompt: "Uma floresta magica ao por do sol, estilo fantasia, 4k", instrucoes: "Cola no Midjourney. Adiciona --ar 16:9 para widescreen.", categoria: "Natureza", emoji: "🌲", premium: false, likes: 24, preco: 0, precoUSD: 0 },
  { id: "2", titulo: "Cidade Cyberpunk", prompt: "Cidade futurista a noite com luzes de neon, cyberpunk, ultra realista", instrucoes: "Ideal para Midjourney v6. Adiciona --style raw para mais realismo.", categoria: "Urbano", emoji: "🏙️", premium: false, likes: 41, preco: 0, precoUSD: 0 },
  { id: "3", titulo: "Guerreira Medieval", prompt: "Retrato de guerreira medieval com armadura dourada, detalhado, epico", instrucoes: "Usa no Stable Diffusion. Adiciona Greg Rutkowski para estilo epico.", categoria: "Fantasia", emoji: "⚔️", premium: true, likes: 89, preco: 500, precoUSD: 0.99 },
  { id: "4", titulo: "Oceano Profundo", prompt: "Fundo do oceano com criaturas bioluminescentes, misterioso, 8k", instrucoes: "Funciona no DALL-E 3. Adiciona: highly detailed, cinematic lighting.", categoria: "Natureza", emoji: "🌊", premium: true, likes: 67, preco: 500, precoUSD: 0.99 },
  { id: "5", titulo: "Dragao de Fogo", prompt: "Dragao gigante a cuspir fogo sobre montanhas nevadas, epico, 8k", instrucoes: "Melhor no Midjourney v6. Adiciona --chaos 20 para variacoes.", categoria: "Fantasia", emoji: "🐉", premium: false, likes: 112, preco: 0, precoUSD: 0 },
  { id: "6", titulo: "Retrato Futurista", prompt: "Retrato de humano com implantes ciberneticos, neon, cyberpunk", instrucoes: "Usa no Midjourney ou SDXL. Adiciona: photorealistic, 8k.", categoria: "Pessoas", emoji: "🤖", premium: true, likes: 55, preco: 500, precoUSD: 0.99 },
  { id: "7", titulo: "Leao Majestoso", prompt: "Leao majestoso no savana ao por do sol, fotorrealista, 4k", instrucoes: "Excelente para DALL-E 3. Adiciona: golden hour, National Geographic style.", categoria: "Animais", emoji: "🦁", premium: false, likes: 33, preco: 0, precoUSD: 0 },
  { id: "8", titulo: "Galaxia Espiral", prompt: "Galaxia espiral colorida no espaco profundo, nebulosa, 8k", instrucoes: "Adiciona nomes de nebulosas reais para mais detalhe.", categoria: "Espaco", emoji: "🌌", premium: true, likes: 78, preco: 500, precoUSD: 0.99 },
  { id: "9", titulo: "Praia Tropical", prompt: "Praia tropical paradisiaca com aguas cristalinas, palmeiras, 4k", instrucoes: "Funciona em qualquer IA. Adiciona: aerial view para vista aerea.", categoria: "Natureza", emoji: "🏖️", premium: false, likes: 45, preco: 0, precoUSD: 0 },
  { id: "10", titulo: "Samurai Japones", prompt: "Samurai japones em posicao de combate, cerejeiras ao fundo, arte digital", instrucoes: "Usa no Midjourney com --style expressive para arte mais dramatica.", categoria: "Pessoas", emoji: "⚔️", premium: false, likes: 67, preco: 0, precoUSD: 0 },
];

// ===== ESTADO =====
let todosPrompts = [...promptsLocais];
let utilizadorLogado = JSON.parse(localStorage.getItem("utilizador")) || null;
let utilizadorPremium = localStorage.getItem("premium") === "true";
let promptsDesbloqueados = JSON.parse(localStorage.getItem("promptsDesbloqueados")) || [];
let likesGuardados = JSON.parse(localStorage.getItem("likes")) || [];
let categoriaAtual = "todos";
let filtroPremium = "todos";

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", async () => {
  atualizarNavbar();

  // Tentar buscar prompts do Firebase
  if (window.buscarPrompts) {
    const promptsFirebase = await window.buscarPrompts();
    if (promptsFirebase && promptsFirebase.length > 0) {
      todosPrompts = promptsFirebase;
    }
  }

  if (document.getElementById("prompts")) renderizarPrompts(todosPrompts);
  if (document.getElementById("user-nome-display")) carregarPerfil();
  if (document.getElementById("plano-nome")) carregarCheckout();
});

// ===== NAVBAR =====
function atualizarNavbar() {
  const navAuth = document.getElementById("nav-auth");
  if (!navAuth) return;
  if (utilizadorLogado) {
    navAuth.innerHTML =
      "<span class='user-nome'>Ola, " + utilizadorLogado.nome + "</span>" +
      "<a href='cliente.html'><button class='btn-register'>Minha Area</button></a>" +
      "<button class='btn-login' onclick='logout()'>Sair</button>";
  }
}

// ===== RENDERIZAR PROMPTS =====
function renderizarPrompts(lista) {
  const grid = document.getElementById("prompts");
  if (!grid) return;
  grid.innerHTML = "";
  if (lista.length === 0) {
    grid.innerHTML = "<div class='sem-resultados'>Nenhum prompt encontrado</div>";
    return;
  }

  lista.forEach(p => {
    const desbloqueado = promptsDesbloqueados.includes(p.id) || promptsDesbloqueados.includes(String(p.id));
    const bloqueado = p.premium && !utilizadorPremium && !desbloqueado;
    const jaCurtiu = likesGuardados.includes(p.id) || likesGuardados.includes(String(p.id));

    const card = document.createElement("div");
    card.className = "prompt-card" + (bloqueado ? " bloqueado" : "");
    card.id = "card-" + p.id;

    let imagemHtml = "";
    if (p.imagem) {
      imagemHtml = "<img src='" + p.imagem + "' class='prompt-img' alt='" + p.titulo + "'>";
    }

    card.innerHTML =
      "<div class='card-badge " + (p.premium ? "premium-badge" : "") + "'>" + (p.premium ? "PREMIUM" : "GRATIS") + "</div>" +
      imagemHtml +
      "<div class='card-emoji'>" + (p.emoji || "✨") + "</div>" +
      "<h3>" + p.titulo + "</h3>" +
      "<p class='prompt-texto'>" + (bloqueado ? "🔒 Prompt Premium — desbloqueia para aceder" : p.prompt) + "</p>" +
      "<span class='categoria-tag'>" + p.categoria + "</span>" +
      (bloqueado ?
        "<button class='btn-premium' onclick='abrirVenda(\"" + p.id + "\")'>🔓 Desbloquear — $" + (p.precoUSD || "0.99") + "</button>"
      :
        "<div class='card-acoes'>" +
          "<button class='btn-copiar' onclick='copiar(this, " + JSON.stringify(p.prompt) + ")'>▶ Copiar</button>" +
          "<button class='btn-like " + (jaCurtiu ? "liked" : "") + "' onclick='toggleLike(\"" + p.id + "\")'>❤️ <span id='likes-" + p.id + "'>" + (p.likes || 0) + "</span></button>" +
        "</div>" +
        "<button class='btn-instrucoes' onclick='toggleInstrucoes(\"" + p.id + "\")'>📖 Como usar</button>" +
        "<div class='instrucoes-box' id='instrucoes-" + p.id + "'><h4>📖 Como Usar</h4><p>" + (p.instrucoes || "Sem instrucoes disponiveis.") + "</p></div>"
      );

    grid.appendChild(card);
  });
}

// ===== COPIAR =====
function copiar(btn, texto) {
  navigator.clipboard.writeText(texto).then(() => {
    btn.textContent = "✅ Copiado!";
    btn.style.background = "linear-gradient(90deg, #22c55e, #16a34a)";
    let copiados = parseInt(localStorage.getItem("copiados") || 0) + 1;
    localStorage.setItem("copiados", copiados);
    setTimeout(() => {
      btn.textContent = "▶ Copiar";
      btn.style.background = "linear-gradient(90deg, #e50914, #A855F7)";
    }, 2000);
  });
}

// ===== LIKE =====
function toggleLike(id) {
  id = String(id);
  const prompt = todosPrompts.find(p => String(p.id) === id);
  if (!prompt) return;
  const jaCurtiu = likesGuardados.includes(id);
  const contador = document.getElementById("likes-" + id);
  const btn = contador ? contador.parentElement : null;

  if (jaCurtiu) {
    likesGuardados = likesGuardados.filter(l => String(l) !== id);
    prompt.likes = Math.max(0, (prompt.likes || 0) - 1);
    if (btn) btn.classList.remove("liked");
  } else {
    likesGuardados.push(id);
    prompt.likes = (prompt.likes || 0) + 1;
    if (btn) btn.classList.add("liked");
  }
  if (contador) contador.textContent = prompt.likes;
  localStorage.setItem("likes", JSON.stringify(likesGuardados));

  // Guardar no Firebase se estiver logado
  if (window.guardarLike && utilizadorLogado) {
    window.guardarLike(id, !jaCurtiu);
  }
}

// ===== INSTRUCOES =====
function toggleInstrucoes(id) {
  const box = document.getElementById("instrucoes-" + id);
  if (box) box.classList.toggle("aberto");
}

// ===== ABRIR VENDA =====
function abrirVenda(id) {
  window.location.href = "venda.html?id=" + id;
}

// ===== FILTRAR =====
function filtrar(el, categoria) {
  document.querySelectorAll(".cat").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  categoriaAtual = categoria;
  aplicarFiltros();
}

function filtrarPremium(el, tipo) {
  document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  filtroPremium = tipo;
  aplicarFiltros();
}

function pesquisar() { aplicarFiltros(); }

function aplicarFiltros() {
  const input = document.getElementById("pesquisa");
  const pesquisa = input ? input.value.toLowerCase() : "";
  let resultado = todosPrompts;
  if (categoriaAtual !== "todos") resultado = resultado.filter(p => p.categoria === categoriaAtual);
  if (filtroPremium === "gratis") resultado = resultado.filter(p => !p.premium);
  else if (filtroPremium === "premium") resultado = resultado.filter(p => p.premium);
  if (pesquisa) resultado = resultado.filter(p =>
    p.titulo.toLowerCase().includes(pesquisa) ||
    p.prompt.toLowerCase().includes(pesquisa) ||
    p.categoria.toLowerCase().includes(pesquisa)
  );
  renderizarPrompts(resultado);
}

// ===== PERFIL =====
function carregarPerfil() {
  if (!utilizadorLogado) { window.location.href = "login-cliente.html"; return; }
  const nomeEl = document.getElementById("user-nome");
  if (nomeEl) nomeEl.textContent = "Ola, " + utilizadorLogado.nome;
  const nomeDisplay = document.getElementById("user-nome-display");
  if (nomeDisplay) nomeDisplay.textContent = utilizadorLogado.nome;
  const emailDisplay = document.getElementById("user-email-display");
  if (emailDisplay) emailDisplay.textContent = utilizadorLogado.email;
  const planoEl = document.getElementById("user-plano");
  if (planoEl) planoEl.textContent = utilizadorPremium ? "Membro Premium" : "Membro";
  const copiadosEl = document.getElementById("total-copiados");
  if (copiadosEl) copiadosEl.textContent = localStorage.getItem("copiados") || 0;
  const favoritosEl = document.getElementById("total-favoritos");
  if (favoritosEl) favoritosEl.textContent = likesGuardados.length;
  const diasEl = document.getElementById("dias-membro");
  if (diasEl) {
    const dataRegisto = new Date(localStorage.getItem("dataRegisto") || Date.now());
    diasEl.textContent = Math.floor((Date.now() - dataRegisto) / 86400000);
  }

  // Carregar prompts no painel
  const gridCliente = document.getElementById("prompts-cliente");
  if (gridCliente) {
    renderizarPromptsCliente();
  }
}

// ===== PROMPTS NO PAINEL DO CLIENTE =====
async function renderizarPromptsCliente() {
  const grid = document.getElementById("prompts-cliente");
  if (!grid) return;

  let lista = todosPrompts;

  // Tentar buscar do Firebase
  if (window.buscarPrompts) {
    const promptsFirebase = await window.buscarPrompts();
    if (promptsFirebase && promptsFirebase.length > 0) {
      lista = promptsFirebase;
      todosPrompts = promptsFirebase;
    }
  }

  grid.innerHTML = "";
  lista.forEach(p => {
    const desbloqueado = promptsDesbloqueados.includes(String(p.id));
    const bloqueado = p.premium && !utilizadorPremium && !desbloqueado;
    const jaCurtiu = likesGuardados.includes(String(p.id));

    const card = document.createElement("div");
    card.className = "prompt-card" + (bloqueado ? " bloqueado" : "");

    let imagemHtml = "";
    if (p.imagem) imagemHtml = "<img src='" + p.imagem + "' class='prompt-img' alt='" + p.titulo + "'>";

    card.innerHTML =
      "<div class='card-badge " + (p.premium ? "premium-badge" : "") + "'>" + (p.premium ? "PREMIUM" : "GRATIS") + "</div>" +
      imagemHtml +
      "<div class='card-emoji'>" + (p.emoji || "✨") + "</div>" +
      "<h3>" + p.titulo + "</h3>" +
      "<p class='prompt-texto'>" + (bloqueado ? "🔒 Desbloqueia este prompt" : p.prompt) + "</p>" +
      "<span class='categoria-tag'>" + p.categoria + "</span>" +
      (bloqueado ?
        "<button class='btn-premium' onclick='abrirVenda(\"" + p.id + "\")'>🔓 $" + (p.precoUSD || "0.99") + "</button>"
      :
        "<div class='card-acoes'>" +
          "<button class='btn-copiar' onclick='copiar(this, " + JSON.stringify(p.prompt) + ")'>▶ Copiar</button>" +
          "<button class='btn-like " + (jaCurtiu ? "liked" : "") + "' onclick='toggleLike(\"" + p.id + "\")'>❤️ <span id='likes-c-" + p.id + "'>" + (p.likes || 0) + "</span></button>" +
        "</div>" +
        "<button class='btn-instrucoes' onclick='toggleInstrucoes(\"" + p.id + "\")'>📖 Como usar</button>" +
        "<div class='instrucoes-box' id='instrucoes-" + p.id + "'><h4>📖 Como Usar</h4><p>" + (p.instrucoes || "") + "</p></div>"
      );

    grid.appendChild(card);
  });
}

// ===== TABS DASHBOARD =====
function mostrarTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("ativo"));
  document.getElementById("tab-" + tab).classList.add("ativo");
  event.target.classList.add("active");
}

// ===== CHECKOUT =====
function carregarCheckout() {
  const params = new URLSearchParams(window.location.search);
  const plano = params.get("plano") || "premium";
  const precos = {
    premium: { nome: "Premium Mensal", preco: "$9.99/mes", total: "$9.99" },
    anual: { nome: "Premium Anual", preco: "$79.99/ano", total: "$79.99" }
  };
  const p = precos[plano] || precos.premium;
  const nomeEl = document.getElementById("plano-nome");
  const precoEl = document.getElementById("plano-preco");
  const totalEl = document.getElementById("plano-total");
  if (nomeEl) nomeEl.textContent = p.nome;
  if (precoEl) precoEl.textContent = p.preco;
  if (totalEl) totalEl.textContent = p.total;
}

// ===== LOGOUT =====
function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

// ===== PAGAMENTO =====
let metodoSelecionado = null;

function selecionarMetodo(el, metodo) {
  document.querySelectorAll(".metodo-card").forEach(c => c.classList.remove("selecionado"));
  el.classList.add("selecionado");
  metodoSelecionado = metodo;
  document.querySelectorAll(".metodo-detalhes").forEach(d => d.style.display = "none");
  const detalhes = document.getElementById("detalhes-" + metodo);
  if (detalhes) detalhes.style.display = "block";
}

function processarPagamento() {
  if (!metodoSelecionado) { alert("Seleciona um metodo de pagamento!"); return; }
  if (metodoSelecionado === "visa") {
    const nome = document.getElementById("card-nome") ? document.getElementById("card-nome").value : "";
    const numero = document.getElementById("card-numero") ? document.getElementById("card-numero").value : "";
    if (!nome || !numero) { alert("Preenche os dados do cartao!"); return; }
    alert("💳 Pagamento Visa processado!");
  } else if (metodoSelecionado === "multicaixa") {
    const numero = document.getElementById("multicaixa-numero") ? document.getElementById("multicaixa-numero").value : "";
    if (!numero) { alert("Introduz o teu numero Multicaixa!"); return; }
    alert("📱 Notificacao enviada para " + numero);
  } else if (metodoSelecionado === "binance") {
    alert("🟡 A redirecionar para Binance Pay...");
  }
  localStorage.setItem("premium", "true");
  setTimeout(() => { window.location.href = "cliente.html"; }, 2000);
}
'''

with open("prompts-ia-site/frontend/app.js", "w") as f:
    f.write(app_js)

print("✅ app.js atualizado com interligacao Firebase!")
