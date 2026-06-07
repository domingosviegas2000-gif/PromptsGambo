import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

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
      nome, email, plano: "gratis", dataRegisto: new Date().toISOString()
    });
    alert("Conta criada com sucesso!");
    window.location.href = "cliente.html";
  } catch (erro) {
    alert("Erro: " + erro.message);
  }
}

window.loginCliente = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) { alert("Preenche todos os campos!"); return; }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docSnap = await getDoc(doc(db, "utilizadores", userCredential.user.uid));
    if (docSnap.exists()) {
      const dados = docSnap.data();
      localStorage.setItem("utilizador", JSON.stringify({ nome: dados.nome, email: dados.email, uid: userCredential.user.uid }));
      localStorage.setItem("premium", dados.plano !== "gratis" ? "true" : "false");
    }
    window.location.href = "cliente.html";
  } catch (erro) {
    alert("Email ou password incorretos!");
  }
}

window.loginAdmin = async function() {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  if (!email || !password) { alert("Preenche todos os campos!"); return; }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docSnap = await getDoc(doc(db, "utilizadores", userCredential.user.uid));
    if (docSnap.exists() && docSnap.data().role === "admin") {
      localStorage.setItem("adminLogado", "true");
      window.location.href = "admin.html";
    } else {
      alert("Nao tens permissao de administrador!");
      await signOut(auth);
    }
  } catch (erro) {
    alert("Credenciais incorretas!");
  }
}

window.logout = async function() {
  await signOut(auth);
  localStorage.removeItem("utilizador");
  localStorage.removeItem("premium");
  window.location.href = "index.html";
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docSnap = await getDoc(doc(db, "utilizadores", user.uid));
    if (docSnap.exists()) {
      const dados = docSnap.data();
      localStorage.setItem("utilizador", JSON.stringify({ nome: dados.nome, email: dados.email, uid: user.uid }));
      localStorage.setItem("premium", dados.plano !== "gratis" ? "true" : "false");
    }
  }
});
