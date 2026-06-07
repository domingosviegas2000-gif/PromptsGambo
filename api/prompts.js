module.exports = (req, res) => {
  const prompts = [
    { id: 1, titulo: "Floresta Magica", prompt: "Uma floresta magica ao por do sol, estilo fantasia, 4k", categoria: "Natureza", emoji: "🌲", premium: false, likes: 24 },
    { id: 2, titulo: "Cidade Cyberpunk", prompt: "Cidade futurista a noite com luzes de neon, cyberpunk", categoria: "Urbano", emoji: "🏙️", premium: false, likes: 41 },
    { id: 3, titulo: "Guerreira Medieval", prompt: "Retrato de guerreira medieval com armadura dourada", categoria: "Fantasia", emoji: "⚔️", premium: true, likes: 89 },
    { id: 4, titulo: "Oceano Profundo", prompt: "Fundo do oceano com criaturas bioluminescentes, 8k", categoria: "Natureza", emoji: "🌊", premium: true, likes: 67 },
    { id: 5, titulo: "Dragao de Fogo", prompt: "Dragao gigante a cuspir fogo sobre montanhas nevadas", categoria: "Fantasia", emoji: "🐉", premium: false, likes: 112 },
    { id: 6, titulo: "Retrato Futurista", prompt: "Retrato de humano com implantes ciberneticos, neon", categoria: "Pessoas", emoji: "🤖", premium: true, likes: 55 },
  ];
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(prompts);
};