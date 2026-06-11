admin_js = '''
// ===== DADOS =====
let prompts = [
  { id: "1", titulo: "Floresta Magica", prompt: "Uma floresta magica ao por do sol, estilo fantasia, 4k", instrucoes: "Cola no Midjourney. Adiciona --ar 16:9 para widescreen.", categoria: "Natureza", emoji: "🌲", premium: false, likes: 24, precoUSD: 0 },
  { id: "2", titulo: "Cidade Cyberpunk", prompt: "Cidade futurista a noite com luzes de neon, cyberpunk", instrucoes: "Ideal para Midjourney v6.", categoria: "Urbano", emoji: "🏙️", premium: false, likes: 41, precoUSD: 0 },
  { id: "3", titulo: "Guerreira Medieval", prompt: "Retrato de guerreira medieval com armadura dourada", instrucoes: "Usa no Stable Diffusion.", categoria: "Fantasia", emoji: "⚔️", premium: true, likes: 89, precoUSD: 0.99 },
  { id: "4", titulo: "Oceano Profundo", prompt: "Fundo do oceano com criaturas bioluminescentes, 8k", instrucoes: "Funciona no DALL-E 3.", categoria: "Natureza", emoji: "🌊", premium: true, likes: 67, precoUSD: 0.99 },
  { id: "5", titulo: "Dragao de Fogo", prompt: "Dragao gigante a cuspir fogo sobre montanhas nevadas", instrucoes: "Melhor no Midjourney v6.", categoria: "Fantasia", emoji: "🐉", premium: false, likes: 112, precoUSD: 0 },
  { id: "6", titulo: "Retrato Futurista", prompt: "Retrato de humano com implantes ciberneticos, neon", instrucoes: "Usa no Midjourney ou SDXL.", categoria: "Pessoas", emoji: "🤖", premium: true, likes: 55, precoUSD: 0.99 },
  { id: "7", titulo: "Leao Majestoso", prompt: "Leao majestoso no savana ao por do sol, fotorrealista", instrucoes: "Excelente para DALL-E 3.", categoria: "Animais", emoji: "🦁", premium: false, likes: 33, precoUSD: 0 },
  { id: "8", titulo: "Galaxia Espiral", prompt: "Galaxia espiral colorida no espaco profundo, nebulosa, 8k", instrucoes: "Adiciona nomes de nebulosas reais.", categoria: "Espaco", emoji: "🌌", premium: true, likes: 78, precoUSD: 0.99 },
];

let categorias = [
  { id: "1", nome: "Natureza", emoji: "🌿" },
  { id: "2", nome: "Fantasia", emoji: "🧙" },
  { id: "3", nome: "Urbano", emoji: "🏙️" },
  { id: "4", nome: "Pessoas", emoji: "👤" },
  { id: "5", nome: "Animais", emoji: "🐾" },
  { id: "6", nome: "Espaco", emoji: "🚀" },
];

let utilizadores = [
  { id: "1", nome: "Joao Silva", email: "joao@email.com", plano: "Premium" },
  { id: "2", nome: "Maria Santos", email: "maria@email.com", plano: "Gratis" },
];

let pagamentos = [
  { id: "1", utilizador: "Joao Silva", produto: "Guerreira Medieval", metodo: "Visa", valor: "$0.99", estado: "pago" },
  { id: "2", utilizador: "Pedro Costa", produto: "Curso Avancado", metodo: "Multicaixa", valor: "$9.99", estado: "pago" },
];

let afiliados = JSON.parse(localStorage.getItem("afiliados") || "[]");
let promptEditandoId = null;
let categoriaEditandoId = null;
let imagemBase64 = null;

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", () => {
  verificarAdmin();
  carregarEstatisticas();
  carregarPrompts();
  preencherSelectCategorias();
  carregarAfiliados();
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
  const receita = pagamentos.filter(p => p.estado === "pago").reduce((acc, p) => {
    return acc + parseFloat(p.valor.replace("$",""));
  }, 0);
  document.getElementById("total-receita").textContent = "$" + receita.toFixed(2);
}

// ===== SECOES =====
function mostrarSecao(secao) {
  document.querySelectorAll(".admin-secao").forEach(s => s.style.display = "none");
  document.getElementById("secao-" + secao).style.display = "block";
  if (secao === "utilizadores") carregarUtilizadores();
  if (secao === "pagamentos") carregarPagamentos();
  if (secao === "categorias") carregarCategorias();
}

// ===== PROMPTS =====
function carregarPrompts() {
  const lista = document.getElementById("lista-prompts-admin");
  lista.innerHTML = "";
  prompts.forEach(p => {
    const linha = document.createElement("div");
    linha.className = "tabela-linha";
    linha.innerHTML =
      "<span>" + (p.emoji || "✨") + " " + p.titulo + "</span>" +
      "<span>" + p.categoria + "</span>" +
      "<span>" +
        "<span class='" + (p.premium ? "badge-premium" : "badge-gratis") + "'>" + (p.premium ? "Premium" : "Gratis") + "</span>" +
        (p.precoUSD > 0 ? "<span style='color:#A855F7; font-size:11px; margin-left:5px;'>$" + p.precoUSD + "</span>" : "") +
      "</span>" +
      "<span class='acoes'>" +
        "<button class='btn-editar' onclick='editarPrompt(\"" + p.id + "\")'>✏️</button>" +
        "<button class='btn-apagar' onclick='apagarPrompt(\"" + p.id + "\")'>🗑️</button>" +
        "<button class='" + (p.premium ? "btn-tornar-gratis" : "btn-tornar-premium") + "' onclick='togglePremium(\"" + p.id + "\")'>" +
          (p.premium ? "🔓" : "🔒") +
        "</button>" +
      "</span>";
    lista.appendChild(linha);
  });

  // Guardar no localStorage para app.js aceder
  localStorage.setItem("promptsAdmin", JSON.stringify(prompts));
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
  document.getElementById("prompt-emoji").value = prompt.emoji || "";
  document.getElementById("prompt-categoria").value = prompt.categoria;
  document.getElementById("prompt-preco").value = prompt.precoUSD || 0;
  document.getElementById("prompt-premium").checked = prompt.premium;
  if (prompt.imagem) {
    const preview = document.getElementById("imagem-preview");
    preview.src = prompt.imagem;
    preview.style.display = "block";
    document.getElementById("prompt-imagem-url").value = prompt.imagem;
  }
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
  const precoUSD = parseFloat(document.getElementById("prompt-preco").value || 0);
  const premium = document.getElementById("prompt-premium").checked;
  const imagemUrl = imagemBase64 || document.getElementById("prompt-imagem-url").value || "";

  if (!titulo || !texto || !categoria) { alert("Preenche titulo, texto e categoria!"); return; }

  if (promptEditandoId) {
    const prompt = prompts.find(p => p.id === promptEditandoId);
    if (prompt) Object.assign(prompt, { titulo, prompt: texto, instrucoes, emoji, categoria, precoUSD, premium, imagem: imagemUrl });
    alert("✅ Prompt atualizado!");
  } else {
    const novoId = String(Date.now());
    prompts.push({ id: novoId, titulo, prompt: texto, instrucoes, emoji, categoria, precoUSD, premium, likes: 0, imagem: imagemUrl });
    alert("✅ Prompt adicionado!");
  }

  promptEditandoId = null;
  imagemBase64 = null;
  fecharModal();
  carregarPrompts();
  carregarEstatisticas();
}

// ===== IMAGEM =====
function previewImagem(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    imagemBase64 = e.target.result;
    const preview = document.getElementById("imagem-preview");
    preview.src = imagemBase64;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function previewUrl(input) {
  const preview = document.getElementById("imagem-preview");
  if (input.value) {
    preview.src = input.value;
    preview.style.display = "block";
    imagemBase64 = null;
  } else {
    preview.style.display = "none";
  }
}

// ===== CATEGORIAS =====
function preencherSelectCategorias() {
  const select = document.getElementById("prompt-categoria");
  select.innerHTML = "<option value=''>Seleciona categoria</option>";
  categorias.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.nome;
    opt.textContent = c.emoji + " " + c.nome;
    select.appendChild(opt);
  });
}

function carregarCategorias() {
  const lista = document.getElementById("lista-categorias");
  lista.innerHTML = "";
  categorias.forEach(c => {
    const item = document.createElement("div");
    item.className = "tabela-linha";
    item.style.gridTemplateColumns = "1fr 1fr 1fr";
    item.innerHTML =
      "<span>" + c.emoji + " " + c.nome + "</span>" +
      "<span>" + prompts.filter(p => p.categoria === c.nome).length + " prompts</span>" +
      "<span class='acoes'>" +
        "<button class='btn-editar' onclick='editarCategoria(\"" + c.id + "\")'>✏️</button>" +
        "<button class='btn-apagar' onclick='apagarCategoria(\"" + c.id + "\")'>🗑️</button>" +
      "</span>";
    lista.appendChild(item);
  });
}

function abrirModalCategoria() {
  categoriaEditandoId = null;
  document.getElementById("cat-nome").value = "";
  document.getElementById("cat-emoji").value = "";
  document.getElementById("modal-cat-titulo").textContent = "Adicionar Categoria";
  document.getElementById("modal-categoria").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function fecharModalCategoria() {
  document.getElementById("modal-categoria").classList.remove("ativo");
  document.getElementById("overlay").classList.remove("ativo");
}

function editarCategoria(id) {
  const cat = categorias.find(c => c.id === id);
  if (!cat) return;
  categoriaEditandoId = id;
  document.getElementById("cat-nome").value = cat.nome;
  document.getElementById("cat-emoji").value = cat.emoji;
  document.getElementById("modal-cat-titulo").textContent = "Editar Categoria";
  document.getElementById("modal-categoria").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function apagarCategoria(id) {
  if (confirm("Apagar esta categoria?")) {
    categorias = categorias.filter(c => c.id !== id);
    carregarCategorias();
    preencherSelectCategorias();
  }
}

function guardarCategoria() {
  const nome = document.getElementById("cat-nome").value;
  const emoji = document.getElementById("cat-emoji").value || "📁";
  if (!nome) { alert("Escreve o nome da categoria!"); return; }

  if (categoriaEditandoId) {
    const cat = categorias.find(c => c.id === categoriaEditandoId);
    if (cat) Object.assign(cat, { nome, emoji });
    alert("✅ Categoria atualizada!");
  } else {
    categorias.push({ id: String(Date.now()), nome, emoji });
    alert("✅ Categoria adicionada!");
  }

  categoriaEditandoId = null;
  fecharModalCategoria();
  carregarCategorias();
  preencherSelectCategorias();
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
      "<span><button class='btn-apagar' onclick='apagarUtilizador(\"" + u.id + "\")'>🗑️</button></span>";
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

// ===== PAGAMENTOS =====
function carregarPagamentos() {
  const lista = document.getElementById("lista-pagamentos-admin");
  lista.innerHTML = "";
  pagamentos.forEach(p => {
    const linha = document.createElement("div");
    linha.className = "tabela-linha";
    linha.innerHTML =
      "<span>" + p.utilizador + "</span>" +
      "<span>" + p.produto + "</span>" +
      "<span>" + p.metodo + "</span>" +
      "<span class='" + (p.estado === "pago" ? "badge-gratis" : "badge-pendente") + "'>" + p.estado + "</span>";
    lista.appendChild(linha);
  });
}

// ===== EXPORTAR JSON =====
function exportarJSON() {
  const dados = {
    prompts: prompts,
    categorias: categorias,
    exportado: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "promptsgambo-export-" + Date.now() + ".json";
  a.click();
  URL.revokeObjectURL(url);
  alert("✅ Exportado com sucesso!");
}

// ===== IMPORTAR JSON =====
function importarJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const dados = JSON.parse(e.target.result);
      if (dados.prompts && Array.isArray(dados.prompts)) {
        if (confirm("Importar " + dados.prompts.length + " prompts? Isto vai substituir os prompts atuais.")) {
          prompts = dados.prompts;
          if (dados.categorias) categorias = dados.categorias;
          carregarPrompts();
          carregarEstatisticas();
          preencherSelectCategorias();
          alert("✅ " + prompts.length + " prompts importados!");
        }
      } else {
        alert("❌ Ficheiro invalido!");
      }
    } catch (erro) {
      alert("❌ Erro ao ler ficheiro: " + erro.message);
    }
  };
  reader.readAsText(file);
}

// ===== MONETIZACAO =====
function guardarAnuncio() {
  const codigo = document.getElementById("codigo-anuncio").value;
  const posicao = document.getElementById("posicao-anuncio").value;
  if (!codigo) { alert("Cola o codigo do anuncio!"); return; }
  localStorage.setItem("anuncio_codigo", codigo);
  localStorage.setItem("anuncio_posicao", posicao);
  alert("✅ Anuncio guardado! Sera exibido na posicao: " + posicao);
}

function guardarAfiliado() {
  const nome = document.getElementById("afiliado-nome").value;
  const link = document.getElementById("afiliado-link").value;
  const comissao = document.getElementById("afiliado-comissao").value;
  if (!nome || !link) { alert("Preenche nome e link!"); return; }
  afiliados.push({ id: String(Date.now()), nome, link, comissao });
  localStorage.setItem("afiliados", JSON.stringify(afiliados));
  carregarAfiliados();
  document.getElementById("afiliado-nome").value = "";
  document.getElementById("afiliado-link").value = "";
  document.getElementById("afiliado-comissao").value = "";
  alert("✅ Link de afiliado adicionado!");
}

function carregarAfiliados() {
  const lista = document.getElementById("lista-afiliados");
  if (!lista) return;
  lista.innerHTML = "";
  afiliados.forEach(a => {
    const item = document.createElement("div");
    item.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(28,28,36,0.8); border-radius:8px; margin-bottom:8px;";
    item.innerHTML =
      "<div>" +
        "<strong style='font-size:14px;'>" + a.nome + "</strong>" +
        "<p style='color:#A855F7; font-size:12px;'>" + a.comissao + " comissao</p>" +
      "</div>" +
      "<button class='btn-apagar' onclick='apagarAfiliado(\"" + a.id + "\")'>🗑️</button>";
    lista.appendChild(item);
  });
}

function apagarAfiliado(id) {
  afiliados = afiliados.filter(a => a.id !== id);
  localStorage.setItem("afiliados", JSON.stringify(afiliados));
  carregarAfiliados();
}

// ===== MODAL =====
function abrirModalPrompt() {
  document.getElementById("modal-prompt").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("modal-prompt").classList.remove("ativo");
  document.getElementById("modal-categoria").classList.remove("ativo");
  document.getElementById("overlay").classList.remove("ativo");
  promptEditandoId = null;
  imagemBase64 = null;
  const preview = document.getElementById("imagem-preview");
  if (preview) preview.style.display = "none";
}

// ===== LOGOUT =====
function logoutAdmin() {
  localStorage.removeItem("adminLogado");
  window.location.href = "login.html";
}
'''

with open("prompts-ia-site/frontend/admin.js", "w") as f:
    f.write(admin_js)

print("✅ admin.js completo criado!")
