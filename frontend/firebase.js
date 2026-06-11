firebase_js = '''import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCW6x9R-KnYLjXddeVQjiM8ax7NI5TEXXc",
  authDomain: "promptsgambo.firebaseapp.com",
  projectId: "promptsgambo",
  storageBucket: "promptsgambo.firebasestorage.app",
  messagingSenderId: "155138685854",
  appId: "1:155138685854:web:7b505e42839033c230748f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== EXPORTAR PARA USO GLOBAL =====
window.auth = auth;
window.db = db;

// ===== REGISTAR =====
window.registar = async function() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmar = document.getElementById("confirmar").value;
  if (!nome || !email || !password || !confirmar) { alert("Preenche todos os campos!"); return; }
  if (password !== confirmar) { alert("As passwords nao coincidem!"); return; }
  if (password.length < 6) { alert("Minimo 6 caracteres!"); return; }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "utilizadores", userCredential.user.uid), {
      nome, email, plano: "gratis", role: "user", dataRegisto: new Date().toISOString(),
      promptsDesbloqueados: [], favoritoS: []
    });
    localStorage.setItem("utilizador", JSON.stringify({ nome, email, uid: userCredential.user.uid }));
    localStorage.setItem("premium", "false");
    window.location.href = "cliente.html";
  } catch (erro) {
    if (erro.code === "auth/email-already-in-use") alert("Este email ja esta em uso!");
    else alert("Erro: " + erro.message);
  }
}

// ===== LOGIN CLIENTE =====
window.loginCliente = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) { alert("Preenche todos os campos!"); return; }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docSnap = await getDoc(doc(db, "utilizadores", userCredential.user.uid));
    if (docSnap.exists()) {
      const dados = docSnap.data();
      if (dados.role === "admin") {
        localStorage.setItem("adminLogado", "true");
        localStorage.setItem("utilizador", JSON.stringify({ nome: dados.nome, email: dados.email, uid: userCredential.user.uid, role: "admin" }));
        window.location.href = "admin.html";
        return;
      }
      localStorage.setItem("utilizador", JSON.stringify({ nome: dados.nome, email: dados.email, uid: userCredential.user.uid, role: dados.role || "user" }));
      localStorage.setItem("premium", dados.plano !== "gratis" ? "true" : "false");
      localStorage.setItem("promptsDesbloqueados", JSON.stringify(dados.promptsDesbloqueados || []));
    }
    window.location.href = "cliente.html";
  } catch (erro) {
    alert("Email ou password incorretos!");
  }
}

// ===== LOGIN ADMIN =====
window.loginAdmin = async function() {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  if (!email || !password) { alert("Preenche todos os campos!"); return; }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docSnap = await getDoc(doc(db, "utilizadores", userCredential.user.uid));
    if (docSnap.exists() && docSnap.data().role === "admin") {
      localStorage.setItem("adminLogado", "true");
      localStorage.setItem("utilizador", JSON.stringify({ nome: docSnap.data().nome, email, uid: userCredential.user.uid }));
      window.location.href = "admin.html";
    } else {
      alert("Sem permissao de acesso!");
      await signOut(auth);
    }
  } catch (erro) {
    alert("Credenciais incorretas!");
  }
}

// ===== LOGOUT =====
window.logout = async function() {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "../index.html";
}

// ===== BUSCAR PROMPTS DO FIREBASE =====
window.buscarPrompts = async function() {
  try {
    const q = query(collection(db, "prompts"), orderBy("dataCriacao", "desc"));
    const snapshot = await getDocs(q);
    const prompts = [];
    snapshot.forEach(doc => {
      prompts.push({ id: doc.id, ...doc.data() });
    });
    return prompts;
  } catch (erro) {
    console.log("Usando prompts locais:", erro.message);
    return null;
  }
}

// ===== GUARDAR LIKE =====
window.guardarLike = async function(promptId, liked) {
  const utilizador = JSON.parse(localStorage.getItem("utilizador"));
  if (!utilizador) return;
  try {
    const userRef = doc(db, "utilizadores", utilizador.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      let favoritos = docSnap.data().favoritos || [];
      if (liked) {
        if (!favoritos.includes(promptId)) favoritos.push(promptId);
      } else {
        favoritos = favoritos.filter(f => f !== promptId);
      }
      await updateDoc(userRef, { favoritos });
    }
  } catch (erro) {
    console.log("Erro ao guardar like:", erro.message);
  }
}

// ===== VERIFICAR ESTADO =====
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docSnap = await getDoc(doc(db, "utilizadores", user.uid));
      if (docSnap.exists()) {
        const dados = docSnap.data();
        localStorage.setItem("utilizador", JSON.stringify({ nome: dados.nome, email: dados.email, uid: user.uid, role: dados.role || "user" }));
        localStorage.setItem("premium", dados.plano !== "gratis" ? "true" : "false");
        localStorage.setItem("promptsDesbloqueados", JSON.stringify(dados.promptsDesbloqueados || []));
      }
    } catch (erro) {
      console.log("Erro ao verificar estado:", erro.message);
    }
  }
});

window.registarGoogle = function() { alert("Login com Google em breve!"); }
window.loginGoogle = function() { alert("Login com Google em breve!"); }

export { auth, db };
'''

with open("prompts-ia-site/frontend/firebase.js", "w") as f:
    f.write(firebase_js)

print("✅ firebase.js atualizado com interligacao completa!")
