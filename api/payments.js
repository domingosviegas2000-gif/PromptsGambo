module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "POST") {
    const { plano, metodo } = req.body || {};
    if (!plano || !metodo) return res.status(400).json({ erro: "Campos obrigatorios" });
    res.json({ mensagem: "Pagamento processado!", plano, metodo });
  } else {
    res.json({ mensagem: "API pagamentos ok!" });
  }
};