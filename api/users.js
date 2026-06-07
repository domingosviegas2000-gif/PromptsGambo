module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "POST") {
    const { email, nome } = req.body || {};
    if (!email || !nome) return res.status(400).json({ erro: "Campos obrigatorios" });
    res.json({ mensagem: "Utilizador registado!", email, nome });
  } else {
    res.json({ mensagem: "API utilizadores ok!" });
  }
};