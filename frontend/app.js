
// ===== DADOS DOS PROMPTS =====
let prompts = [
  {
    id: 1, titulo: "Floresta Magica",
    prompt: "Uma floresta magica ao por do sol, estilo fantasia, 4k",
    instrucoes: "Cola este prompt no Midjourney ou Leonardo AI. Adiciona --ar 16:9 no final para formato widescreen. Funciona melhor com estilo fantastico.",
    categoria: "Natureza", emoji: "🌲", premium: false, likes: 24
  },
  {
    id: 2, titulo: "Cidade Cyberpunk",
    prompt: "Cidade futurista a noite com luzes de neon, cyberpunk, ultra realista",
    instrucoes: "Ideal para Midjourney v6. Adiciona --style raw para mais realismo. Experimenta mudar a cor das luzes para azul ou roxo.",
    categoria: "Urbano", emoji: "🏙️", premium: false, likes: 41
  },
  {
    id: 3, titulo: "Guerreira Medieval",
    prompt: "Retrato de guerreira medieval com armadura dourada, detalhado, epico",
    instrucoes: "Usa no Stable Diffusion ou Midjourney. Adiciona o nome de um artista como Greg Rutkowski para estilo epico. Recomendado --ar 2:3.",
    categoria: "Fantasia", emoji: "⚔️", premium: true, likes: 89
  },
  {
    id: 4, titulo: "Oceano Profundo",
    prompt: "Fundo do oceano com criaturas bioluminescentes, misterioso, 8k",
    instrucoes: "Funciona muito bem no DALL-E 3 e Midjourney. Para mais detalhe adiciona: highly detailed, octane render, cinematic lighting.",
    categoria: "Natureza", emoji: "🌊", premium: true, likes: 67
  },
  {
    id: 5, titulo: "Dragao de Fogo",
    prompt: "Dragao gigante a cuspir fogo sobre montanhas nevadas, epico, 8k",
    instrucoes: "Melhor no Midjourney v6. Adiciona --chaos 20 para variacoes criativas. Experimenta diferentes angulos: vista aerea, frontal, lateral.",
    categoria: "Fantasia", emoji: "🐉", premium: false, likes: 112
  },
  {
    id: 6, titulo: "Retrato Futurista",
    prompt: "Retrato de humano com implantes ciberneticos, neon, cyberpunk, ultra realista",
    instrucoes: "Usa no Midjourney ou Stable Diffusion XL. Para melhor qualidade adiciona: photorealistic, 8k, sharp focus, studio lighting.",
    categoria: "Pessoas", emoji: "🤖", premium: true, likes: 55
  },
  {
    id: 7, titulo: "Leao Majestoso",
    prompt: "Leao majestoso no savana ao por do sol, fotorrealista, 4k",
    instrucoes: "Excelente para DALL-E 3 e Midjourney. Adiciona: golden hour, National Geographic style para fotos tipo revista.",
    categoria: "Animais", emoji: "🦁", premium: false, likes: 33
  },
  {
    id: 8, titulo: "Galaxia Espiral",
    prompt: "Galaxia espiral colorida no espaco profundo, nebulosa, 8k",
    instrucoes: "Ideal para qualquer ferramenta IA. Adiciona nomes de nebulosas reais como Orion Nebula para resultados mais detalhados.",
    categoria: "Espaco", emoji: "🌌", premium: true, likes: 78
  },
];

// ===== ESTADO =====
let utilizadorLogado = JSON.parse(localStorage.getItem("utilizador")) || null;
let utilizadorPremium = localStorage.getItem("premium") === "true";
let categoriaAtual = "todos";
let filtroPremium = "todos";
let likesGuardados = JSON.parse(localStorage.getItem("likes")) || [];

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", () => {
  atualizarNavbar();
  if (document.getElementById("prompts")) {
    renderizarPrompts(prompts);
  }
  if (document.getElementById("user-nome-display")) {
    carregarPerfil();
  }
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
    const bloqueado = p.premium && !utilizadorPremium;
    const jaCurtiu = likesGuardados.includes(p.id);

    const card = document.createElement("div");
    card.className = "prompt-card" + (bloqueado ? " bloqueado" : "");
    card.id = "card-" + p.id;

    card.innerHTML =
      "<div class='card-badge " + (p.premium ? "premium-badge" : "") + "'>" + (p.premium ? "PREMIUM" : "GRATIS") + "</div>" +
      "<div class='card-emoji'>" + p.emoji + "</div>" +
      "<h3>" + p.titulo + "</h3>" +
      "<p class='prompt-texto'>" + (bloqueado ? "🔒 Disponivel no plano Premium" : p.prompt) + "</p>" +
      "<span class='categoria-tag'>" + p.categoria + "</span>" +

      (bloqueado ?
        "<button class='btn-premium' onclick="window.location.href='checkout.html?plano=premium'">🔓 Desbloquear</button>"
      :
        "<div class='card-acoes'>" +
          "<button class='btn-copiar' onclick='copiar(this, " + JSON.stringify(p.prompt) + ")'>▶ Copiar</button>" +
          "<button class='btn-like " + (jaCurtiu ? "liked" : "") + "' id='like-" + p.id + "' onclick='toggleLike(" + p.id + ")'>" +
            "❤️ <span id='likes-count-" + p.id + "'>" + (p.likes + (jaCurtiu ? 1 : 0)) + "</span>" +
          "</button>" +
        "</div>" +
        "<button class='btn-instrucoes' onclick='toggleInstrucoes(" + p.id + ")'>📖 Como usar este prompt</button>" +
        "<div class='instrucoes-box' id='instrucoes-" + p.id + "'>" +
          "<h4>📖 Como Usar</h4>" +
          "<p>" + p.instrucoes + "</p>" +
        "</div>"
      );

    grid.appendChild(card);
  });
}

// ===== COPIAR =====
function copiar(btn, texto) {
  navigator.clipboard.writeText(texto).then(() => {
    btn.textContent = "✅ Copiado!";
    btn.style.background = "#22c55e";
    setTimeout(() => {
      btn.textContent = "▶ Copiar";
      btn.style.background = "#e50914";
    }, 2000);
  });
}

// ===== LIKE =====
function toggleLike(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;

  const jaCurtiu = likesGuardados.includes(id);
  const btn = document.getElementById("like-" + id);
  const contador = document.getElementById("likes-count-" + id);

  if (jaCurtiu) {
    likesGuardados = likesGuardados.filter(l => l !== id);
    prompt.likes--;
    btn.classList.remove("liked");
  } else {
    likesGuardados.push(id);
    prompt.likes++;
    btn.classList.add("liked");
  }

  contador.textContent = prompt.likes + (jaCurtiu ? 0 : 0);
  localStorage.setItem("likes", JSON.stringify(likesGuardados));
}

// ===== INSTRUCOES =====
function toggleInstrucoes(id) {
  const box = document.getElementById("instrucoes-" + id);
  box.classList.toggle("aberto");
}

// ===== FILTRAR CATEGORIA =====
function filtrar(el, categoria) {
  document.querySelectorAll(".cat").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  categoriaAtual = categoria;
  aplicarFiltros();
}

// ===== FILTRAR PREMIUM =====
function filtrarPremium(el, tipo) {
  document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  filtroPremium = tipo;
  aplicarFiltros();
}

// ===== PESQUISAR =====
function pesquisar() { aplicarFiltros(); }

// ===== APLICAR FILTROS =====
function aplicarFiltros() {
  const inputPesquisa = document.getElementById("pesquisa");
  const pesquisa = inputPesquisa ? inputPesquisa.value.toLowerCase() : "";
  let resultado = prompts;

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

// ===== PERFIL CLIENTE =====
function carregarPerfil() {
  if (!utilizadorLogado) { window.location.href = "login-cliente.html"; return; }
  document.getElementById("user-nome").textContent = "Ola, " + utilizadorLogado.nome;
  document.getElementById("user-nome-display").textContent = utilizadorLogado.nome;
  document.getElementById("user-email-display").textContent = utilizadorLogado.email;
  document.getElementById("user-plano").textContent = utilizadorPremium ? "Plano Premium" : "Plano Gratis";
  document.getElementById("total-copiados").textContent = localStorage.getItem("copiados") || 0;
  document.getElementById("total-favoritos").textContent = likesGuardados.length;
  const dataRegisto = new Date(localStorage.getItem("dataRegisto") || Date.now());
  const dias = Math.floor((Date.now() - dataRegisto) / (1000 * 60 * 60 * 24));
  document.getElementById("dias-membro").textContent = dias;
}

// ===== LOGIN CLIENTE =====
function loginCliente() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) { alert("Preenche todos os campos!"); return; }
  const usuario = { nome: email.split("@")[0], email };
  localStorage.setItem("utilizador", JSON.stringify(usuario));
  alert("✅ Login efetuado!");
  window.location.href = "cliente.html";
}

// ===== REGISTAR =====
function registar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmar = document.getElementById("confirmar").value;
  if (!nome || !email || !password || !confirmar) { alert("Preenche todos os campos!"); return; }
  if (password !== confirmar) { alert("As passwords nao coincidem!"); return; }
  if (password.length < 6) { alert("A password deve ter pelo menos 6 caracteres!"); return; }
  localStorage.setItem("utilizador", JSON.stringify({ nome, email }));
  localStorage.setItem("dataRegisto", Date.now());
  alert("✅ Conta criada com sucesso!");
  window.location.href = "cliente.html";
}

// ===== LOGIN GOOGLE =====
function loginGoogle() { alert("Login com Google (Firebase em breve)"); }
function registarGoogle() { alert("Registo com Google (Firebase em breve)"); }

// ===== LOGIN ADMIN =====
function loginAdmin() {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  if (!email || !password) { alert("Preenche todos os campos!"); return; }
  if (email === "admin@promptsgambo.com" && password === "admin123") {
    localStorage.setItem("adminLogado", "true");
    window.location.href = "admin.html";
  } else {
    alert("❌ Credenciais incorretas!");
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("utilizador");
  localStorage.removeItem("premium");
  window.location.href = "index.html";
}

// ===== PAGAMENTO =====
let metodoSelecionado = null;

function selecionarMetodo(el, metodo) {
  document.querySelectorAll(".metodo-card").forEach(c => c.classList.remove("selecionado"));
  el.classList.add("selecionado");
  metodoSelecionado = metodo;
  document.querySelectorAll(".metodo-detalhes").forEach(d => d.style.display = "none");
  document.getElementById("detalhes-" + metodo).style.display = "block";
}

function formatarCartao(input) {
  let valor = input.value.replace(/[^0-9]/g, "");
  valor = valor.replace(/(.{4})/g, "$1 ").trim();
  input.value = valor;
}

function processarPagamento() {
  if (!metodoSelecionado) { alert("Seleciona um metodo de pagamento!"); return; }
  if (metodoSelecionado === "visa") {
    const nome = document.getElementById("card-nome").value;
    const numero = document.getElementById("card-numero").value;
    const validade = document.getElementById("card-validade").value;
    const cvv = document.getElementById("card-cvv").value;
    if (!nome || !numero || !validade || !cvv) { alert("Preenche os dados do cartao!"); return; }
    alert("💳 Pagamento Visa processado! (Stripe em breve)");
  } else if (metodoSelecionado === "multicaixa") {
    const numero = document.getElementById("multicaixa-numero").value;
    if (!numero) { alert("Introduz o teu numero Multicaixa Express!"); return; }
    alert("📱 Notificacao enviada para " + numero + "! Confirma no teu telemovel.");
  } else if (metodoSelecionado === "binance") {
    alert("🟡 A redirecionar para Binance Pay...");
  }
  localStorage.setItem("premium", "true");
  setTimeout(() => { window.location.href = "cliente.html"; }, 2000);
}
