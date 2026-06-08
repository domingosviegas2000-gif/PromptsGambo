
const prompts = [
  { id: 1, titulo: "Floresta Magica", prompt: "Uma floresta magica ao por do sol, estilo fantasia, 4k", instrucoes: "Cola no Midjourney. Adiciona --ar 16:9 para widescreen. Funciona melhor com estilo fantastico.", categoria: "Natureza", emoji: "🌲", premium: false, likes: 24 },
  { id: 2, titulo: "Cidade Cyberpunk", prompt: "Cidade futurista a noite com luzes de neon, cyberpunk, ultra realista", instrucoes: "Ideal para Midjourney v6. Adiciona --style raw para mais realismo.", categoria: "Urbano", emoji: "🏙️", premium: false, likes: 41 },
  { id: 3, titulo: "Guerreira Medieval", prompt: "Retrato de guerreira medieval com armadura dourada, detalhado, epico", instrucoes: "Usa no Stable Diffusion. Adiciona Greg Rutkowski para estilo epico. Recomendado --ar 2:3.", categoria: "Fantasia", emoji: "⚔️", premium: true, likes: 89 },
  { id: 4, titulo: "Oceano Profundo", prompt: "Fundo do oceano com criaturas bioluminescentes, misterioso, 8k", instrucoes: "Funciona no DALL-E 3. Adiciona: highly detailed, octane render, cinematic lighting.", categoria: "Natureza", emoji: "🌊", premium: true, likes: 67 },
  { id: 5, titulo: "Dragao de Fogo", prompt: "Dragao gigante a cuspir fogo sobre montanhas nevadas, epico, 8k", instrucoes: "Melhor no Midjourney v6. Adiciona --chaos 20 para variacoes criativas.", categoria: "Fantasia", emoji: "🐉", premium: false, likes: 112 },
  { id: 6, titulo: "Retrato Futurista", prompt: "Retrato de humano com implantes ciberneticos, neon, cyberpunk", instrucoes: "Usa no Midjourney ou SDXL. Adiciona: photorealistic, 8k, sharp focus.", categoria: "Pessoas", emoji: "🤖", premium: true, likes: 55 },
  { id: 7, titulo: "Leao Majestoso", prompt: "Leao majestoso no savana ao por do sol, fotorrealista, 4k", instrucoes: "Excelente para DALL-E 3. Adiciona: golden hour, National Geographic style.", categoria: "Animais", emoji: "🦁", premium: false, likes: 33 },
  { id: 8, titulo: "Galaxia Espiral", prompt: "Galaxia espiral colorida no espaco profundo, nebulosa, 8k", instrucoes: "Ideal para qualquer IA. Adiciona nomes de nebulosas reais para mais detalhe.", categoria: "Espaco", emoji: "🌌", premium: true, likes: 78 },
  { id: 9, titulo: "Praia Tropical", prompt: "Praia tropical paradisiaca com aguas cristalinas, palmeiras, 4k", instrucoes: "Funciona em qualquer IA. Adiciona: aerial view para vista aerea.", categoria: "Natureza", emoji: "🏖️", premium: false, likes: 45 },
  { id: 10, titulo: "Samurai Japones", prompt: "Samurai japones em posicao de combate, cerejeiras ao fundo, arte digital", instrucoes: "Usa no Midjourney com --style expressive para arte mais dramatica.", categoria: "Pessoas", emoji: "⚔️", premium: false, likes: 67 },
];

let utilizadorLogado = JSON.parse(localStorage.getItem("utilizador")) || null;
let utilizadorPremium = localStorage.getItem("premium") === "true";
let categoriaAtual = "todos";
let filtroPremium = "todos";
let likesGuardados = JSON.parse(localStorage.getItem("likes")) || [];

document.addEventListener("DOMContentLoaded", () => {
  atualizarNavbar();
  if (document.getElementById("prompts")) renderizarPrompts(prompts);
  if (document.getElementById("user-nome-display")) carregarPerfil();
  if (document.getElementById("plano-nome")) carregarCheckout();
});

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

function renderizarPrompts(lista) {
  const grid = document.getElementById("prompts");
  if (!grid) return;
  grid.innerHTML = "";
  if (lista.length === 0) { grid.innerHTML = "<div class='sem-resultados'>Nenhum prompt encontrado</div>"; return; }

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
        "<a href='checkout.html?plano=premium'><button class='btn-premium'>🔓 Desbloquear</button></a>"
      :
        "<div class='card-acoes'>" +
          "<button class='btn-copiar' onclick='copiar(this, " + JSON.stringify(p.prompt) + ")'>▶ Copiar</button>" +
          "<button class='btn-like " + (jaCurtiu ? "liked" : "") + "' onclick='toggleLike(" + p.id + ")'>❤️ <span id='likes-" + p.id + "'>" + p.likes + "</span></button>" +
        "</div>" +
        "<button class='btn-instrucoes' onclick='toggleInstrucoes(" + p.id + ")'>📖 Como usar</button>" +
        "<div class='instrucoes-box' id='instrucoes-" + p.id + "'><h4>📖 Como Usar</h4><p>" + p.instrucoes + "</p></div>"
      );
    grid.appendChild(card);
  });
}

function copiar(btn, texto) {
  navigator.clipboard.writeText(texto).then(() => {
    btn.textContent = "✅ Copiado!";
    btn.style.background = "#22c55e";
    setTimeout(() => { btn.textContent = "▶ Copiar"; btn.style.background = "#e50914"; }, 2000);
  });
}

function toggleLike(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;
  const jaCurtiu = likesGuardados.includes(id);
  const contador = document.getElementById("likes-" + id);
  const btn = contador ? contador.parentElement : null;
  if (jaCurtiu) {
    likesGuardados = likesGuardados.filter(l => l !== id);
    prompt.likes--;
    if (btn) btn.classList.remove("liked");
  } else {
    likesGuardados.push(id);
    prompt.likes++;
    if (btn) btn.classList.add("liked");
  }
  if (contador) contador.textContent = prompt.likes;
  localStorage.setItem("likes", JSON.stringify(likesGuardados));
}

function toggleInstrucoes(id) {
  const box = document.getElementById("instrucoes-" + id);
  if (box) box.classList.toggle("aberto");
}

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

function carregarPerfil() {
  if (!utilizadorLogado) { window.location.href = "login-cliente.html"; return; }
  const nomeEl = document.getElementById("user-nome");
  if (nomeEl) nomeEl.textContent = "Ola, " + utilizadorLogado.nome;
  document.getElementById("user-nome-display").textContent = utilizadorLogado.nome;
  document.getElementById("user-email-display").textContent = utilizadorLogado.email;
  document.getElementById("user-plano").textContent = utilizadorPremium ? "Plano Premium" : "Plano Gratis";
  document.getElementById("total-copiados").textContent = localStorage.getItem("copiados") || 0;
  document.getElementById("total-favoritos").textContent = likesGuardados.length;
  const dataRegisto = new Date(localStorage.getItem("dataRegisto") || Date.now());
  document.getElementById("dias-membro").textContent = Math.floor((Date.now() - dataRegisto) / 86400000);
}

function carregarCheckout() {
  const params = new URLSearchParams(window.location.search);
  const plano = params.get("plano") || "premium";
  const precos = { premium: { nome: "Premium", preco: "9.99€/mes", total: "9.99€" }, anual: { nome: "Anual", preco: "79.99€/ano", total: "79.99€" } };
  const p = precos[plano] || precos.premium;
  document.getElementById("plano-nome").textContent = p.nome;
  document.getElementById("plano-preco").textContent = p.preco;
  document.getElementById("plano-total").textContent = p.total;
}

function logout() {
  localStorage.removeItem("utilizador");
  localStorage.removeItem("premium");
  window.location.href = "../index.html";
}

let metodoSelecionado = null;

function selecionarMetodo(el, metodo) {
  document.querySelectorAll(".metodo-card").forEach(c => c.classList.remove("selecionado"));
  el.classList.add("selecionado");
  metodoSelecionado = metodo;
  document.querySelectorAll(".metodo-detalhes").forEach(d => d.style.display = "none");
  document.getElementById("detalhes-" + metodo).style.display = "block";
}

function processarPagamento() {
  if (!metodoSelecionado) { alert("Seleciona um metodo de pagamento!"); return; }
  if (metodoSelecionado === "visa") {
    const nome = document.getElementById("card-nome").value;
    const numero = document.getElementById("card-numero").value;
    if (!nome || !numero) { alert("Preenche os dados do cartao!"); return; }
    alert("💳 Pagamento Visa processado!");
  } else if (metodoSelecionado === "multicaixa") {
    const numero = document.getElementById("multicaixa-numero").value;
    if (!numero) { alert("Introduz o teu numero Multicaixa!"); return; }
    alert("📱 Notificacao enviada para " + numero);
  } else if (metodoSelecionado === "binance") {
    alert("🟡 A redirecionar para Binance Pay...");
  }
  localStorage.setItem("premium", "true");
  setTimeout(() => { window.location.href = "cliente.html"; }, 2000);
}
