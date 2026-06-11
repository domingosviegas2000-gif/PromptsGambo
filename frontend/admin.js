admin_js = '''
// ===== FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCW6x9R-KnYLjXddeVQjiM8ax7NI5TEXXc",
  authDomain: "promptsgambo.firebaseapp.com",
  projectId: "promptsgambo",
  storageBucket: "promptsgambo.firebasestorage.app",
  messagingSenderId: "155138685854",
  appId: "1:155138685854:web:7b505e42839033c230748f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== ESTADO =====
let prompts = [];
let categorias = [
  { id: "1", nome: "Natureza", emoji: "🌿" },
  { id: "2", nome: "Fantasia", emoji: "🧙" },
  { id: "3", nome: "Urbano", emoji: "🏙️" },
  { id: "4", nome: "Pessoas", emoji: "👤" },
  { id: "5", nome: "Animais", emoji: "🐾" },
  { id: "6", nome: "Espaco", emoji: "🚀" },
];
let utilizadores = [];
let pagamentos = [];
let afiliados = JSON.parse(localStorage.getItem("afiliados") || "[]");
let promptEditandoId = null;
let categoriaEditandoId = null;
let imagemBase64 = null;

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", async () => {
  verificarAdmin();
  await carregarPromptsFirebase();
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

// ===== CARREGAR PROMPTS DO FIREBASE =====
async function carregarPromptsFirebase() {
  try {
    const q = query(collection(db, "prompts"), orderBy("dataCriacao", "desc"));
    const snapshot = await getDocs(q);
    prompts = [];
    snapshot.forEach(d => {
      prompts.push({ id: d.id, ...d.data() });
    });
    console.log("Prompts carregados do Firebase:", prompts.length);
  } catch (erro) {
    console.log("Erro ao carregar prompts:", erro.message);
    prompts = [];
  }
}

function carregarEstatisticas() {
  document.getElementById("total-utilizadores").textContent = utilizadores.length;
  document.getElementById("total-premium").textContent = utilizadores.filter(u => u.plano !== "Gratis").length;
  document.getElementById("total-prompts").textContent = prompts.length;
  document.getElementById("total-receita").textContent = "$0.00";
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

  if (prompts.length === 0) {
    lista.innerHTML = "<div style='text-align:center; padding:30px; color:#aaa;'>Nenhum prompt ainda. Clica em + Adicionar!</div>";
    return;
  }

  prompts.forEach(p => {
    const linha = document.createElement("div");
    linha.className = "tabela-linha";
    linha.innerHTML =
      "<span>" + (p.emoji || "✨") + " " + p.titulo + "</span>" +
      "<span>" + (p.categoria || "-") + "</span>" +
      "<span>" +
        "<span class='" + (p.premium ? "badge-premium" : "badge-gratis") + "'>" + (p.premium ? "Premium" : "Gratis") + "</span>" +
        (p.precoUSD > 0 ? "<span style='color:#A855F7; font-size:11px; margin-left:5px;'>$" + p.precoUSD + "</span>" : "") +
      "</span>" +
      "<span class='acoes'>" +
        "<button class='btn-editar' onclick='editarPrompt(\"" + p.id + "\")'>Editar</button>" +
        "<button class='btn-apagar' onclick='apagarPrompt(\"" + p.id + "\")'>Apagar</button>" +
        "<button class='" + (p.premium ? "btn-tornar-gratis" : "btn-tornar-premium") + "' onclick='togglePremium(\"" + p.id + "\")'>" +
          (p.premium ? "Tornar Gratis" : "Tornar Premium") +
        "</button>" +
      "</span>";
    lista.appendChild(linha);
  });

  document.getElementById("total-prompts").textContent = prompts.length;
}

// ===== TOGGLE PREMIUM =====
async function togglePremium(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;
  try {
    await updateDoc(doc(db, "prompts", id), { premium: !prompt.premium });
    prompt.premium = !prompt.premium;
    carregarPrompts();
    alert(prompt.premium ? "Tornado Premium!" : "Tornado Gratis!");
  } catch (erro) {
    alert("Erro: " + erro.message);
  }
}

// ===== EDITAR PROMPT =====
function editarPrompt(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;
  promptEditandoId = id;
  document.getElementById("prompt-titulo").value = prompt.titulo || "";
  document.getElementById("prompt-texto").value = prompt.prompt || "";
  document.getElementById("prompt-instrucoes").value = prompt.instrucoes || "";
  document.getElementById("prompt-emoji").value = prompt.emoji || "";
  document.getElementById("prompt-categoria").value = prompt.categoria || "";
  document.getElementById("prompt-preco").value = prompt.precoUSD || 0;
  document.getElementById("prompt-premium").checked = prompt.premium || false;
  if (prompt.imagem) {
    const preview = document.getElementById("imagem-preview");
    preview.src = prompt.imagem;
    preview.style.display = "block";
    document.getElementById("prompt-imagem-url").value = prompt.imagem;
  }
  document.getElementById("modal-titulo").textContent = "Editar Prompt";
  abrirModalPrompt();
}

// ===== APAGAR PROMPT =====
async function apagarPrompt(id) {
  if (!confirm("Apagar este prompt?")) return;
  try {
    await deleteDoc(doc(db, "prompts", id));
    prompts = prompts.filter(p => p.id !== id);
    carregarPrompts();
    carregarEstatisticas();
    alert("Prompt apagado!");
  } catch (erro) {
    alert("Erro: " + erro.message);
  }
}

// ===== GUARDAR PROMPT NO FIREBASE =====
async function guardarPrompt() {
  const titulo = document.getElementById("prompt-titulo").value;
  const texto = document.getElementById("prompt-texto").value;
  const instrucoes = document.getElementById("prompt-instrucoes").value;
  const emoji = document.getElementById("prompt-emoji").value || "✨";
  const categoria = document.getElementById("prompt-categoria").value;
  const precoUSD = parseFloat(document.getElementById("prompt-preco").value || 0);
  const premium = document.getElementById("prompt-premium").checked;
  const imagemUrl = imagemBase64 || document.getElementById("prompt-imagem-url").value || "";

  if (!titulo || !texto || !categoria) { alert("Preenche titulo, texto e categoria!"); return; }

  const dados = {
    titulo, prompt: texto, instrucoes, emoji, categoria,
    precoUSD, premium, imagem: imagemUrl, likes: 0,
    dataCriacao: new Date().toISOString()
  };

  try {
    if (promptEditandoId) {
      await updateDoc(doc(db, "prompts", promptEditandoId), dados);
      const idx = prompts.findIndex(p => p.id === promptEditandoId);
      if (idx >= 0) prompts[idx] = { id: promptEditandoId, ...dados };
      alert("Prompt atualizado!");
    } else {
      const docRef = await addDoc(collection(db, "prompts"), dados);
      prompts.unshift({ id: docRef.id, ...dados });
      alert("Prompt adicionado! Ja aparece no site.");
    }
    promptEditandoId = null;
    imagemBase64 = null;
    fecharModal();
    carregarPrompts();
    carregarEstatisticas();
  } catch (erro) {
    alert("Erro ao guardar: " + erro.message);
  }
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
        "<button class='btn-editar' onclick='editarCategoria(\"" + c.id + "\")'>Editar</button>" +
        "<button class='btn-apagar' onclick='apagarCategoria(\"" + c.id + "\")'>Apagar</button>" +
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
    alert("Categoria atualizada!");
  } else {
    categorias.push({ id: String(Date.now()), nome, emoji });
    alert("Categoria adicionada!");
  }
  categoriaEditandoId = null;
  fecharModalCategoria();
  carregarCategorias();
  preencherSelectCategorias();
}

// ===== UTILIZADORES =====
function carregarUtilizadores() {
  const lista = document.getElementById("lista-utilizadores-admin");
  lista.innerHTML = "<div style='text-align:center; padding:20px; color:#aaa;'>A carregar utilizadores...</div>";
}

function carregarPagamentos() {
  const lista = document.getElementById("lista-pagamentos-admin");
  lista.innerHTML = "<div style='text-align:center; padding:20px; color:#aaa;'>A carregar pagamentos...</div>";
}

// ===== EXPORTAR JSON =====
function exportarJSON() {
  const dados = { prompts, categorias, exportado: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "promptsgambo-export-" + Date.now() + ".json";
  a.click();
  URL.revokeObjectURL(url);
  alert("Exportado com sucesso!");
}

// ===== IMPORTAR JSON =====
function importarJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const dados = JSON.parse(e.target.result);
      if (dados.prompts && Array.isArray(dados.prompts)) {
        if (confirm("Importar " + dados.prompts.length + " prompts para o Firebase?")) {
          for (const p of dados.prompts) {
            const { id, ...dadosSemId } = p;
            dadosSemId.dataCriacao = dadosSemId.dataCriacao || new Date().toISOString();
            await addDoc(collection(db, "prompts"), dadosSemId);
          }
          await carregarPromptsFirebase();
          carregarPrompts();
          alert(dados.prompts.length + " prompts importados para o Firebase!");
        }
      } else {
        alert("Ficheiro invalido!");
      }
    } catch (erro) {
      alert("Erro: " + erro.message);
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
  alert("Anuncio guardado na posicao: " + posicao);
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
  alert("Link de afiliado adicionado!");
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
        "<p style='color:#A855F7; font-size:12px;'>" + (a.comissao || "") + " comissao</p>" +
      "</div>" +
      "<button class='btn-apagar' onclick='apagarAfiliado(\"" + a.id + "\")'>Apagar</button>";
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
  document.getElementById("prompt-imagem-url").value = "";
}

// ===== LOGOUT =====
function logoutAdmin() {
  localStorage.removeItem("adminLogado");
  window.location.href = "login.html";
}

// Expor funcoes globais
window.mostrarSecao = mostrarSecao;
window.abrirModalPrompt = abrirModalPrompt;
window.fecharModal = fecharModal;
window.guardarPrompt = guardarPrompt;
window.editarPrompt = editarPrompt;
window.apagarPrompt = apagarPrompt;
window.togglePremium = togglePremium;
window.abrirModalCategoria = abrirModalCategoria;
window.fecharModalCategoria = fecharModalCategoria;
window.guardarCategoria = guardarCategoria;
window.editarCategoria = editarCategoria;
window.apagarCategoria = apagarCategoria;
window.guardarAnuncio = guardarAnuncio;
window.guardarAfiliado = guardarAfiliado;
window.apagarAfiliado = apagarAfiliado;
window.exportarJSON = exportarJSON;
window.importarJSON = importarJSON;
window.previewImagem = previewImagem;
window.previewUrl = previewUrl;
window.logoutAdmin = logoutAdmin;
'''

with open("prompts-ia-site/frontend/admin.js", "w") as f:
    f.write(admin_js)

print("✅ admin.js atualizado com Firebase!")
