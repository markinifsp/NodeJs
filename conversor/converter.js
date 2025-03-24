const API_KEY = "d7a543df3e28b3113bf25b6e";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;


//Criando memoria para armazenar a "Moeda origem"
let cacheTaxas = {};

async function obterTaxaCambio(moedaOrigem, moedaDestino) {
    const buscaMensagem = document.getElementById("resultado");    


    // Verifica se a taxa já está no cache
    if (cacheTaxas[moedaOrigem] && cacheTaxas[moedaOrigem][moedaDestino]) {
        buscaMensagem.innerHTML="✅ Usando taxa do cache<br>";
        return cacheTaxas[moedaOrigem][moedaDestino];
    }

    buscaMensagem.innerHTML="❌ Taxa não encontrada no cache. Buscando na API...";

    //se não encontrada na minha memoria ele vai fazer a req
    try {
        // Fazendo a req para a API
        const response = await axios.get(`${BASE_URL}${moedaOrigem}`);
        const taxas = response.data.conversion_rates;

        // ele salva no cache a taxa procurada na req
        cacheTaxas[moedaOrigem] = taxas;

        // Retorna a taxa de cambio
        return taxas[moedaDestino] || null;
    } catch (error) {
        console.error("Erro ao buscar taxas de câmbio:", error.message);
        return null;
    }
}

    document.getElementById("converter").addEventListener("click", async()=>{
        const moedaOrigem = document.getElementById("moedaOrigem").value.toUpperCase();
        const moedaDestino = document.getElementById("moedaDestino").value.toUpperCase();
        const valor = parseFloat(document.getElementById("valor").value);

        if (!moedaOrigem || !moedaDestino || isNaN(valor)){
            document.getElementById("resultado").textContent = "Preencha os dados de forma correta!!";
            return;
        }

        const taxaCambio = await obterTaxaCambio(moedaOrigem,moedaDestino);

        if(!taxaCambio){
            document.getElementById("resultado").textContent ="Moeda inválida!!"
            return;
        }

        const valorConvertido = (valor *taxaCambio).toFixed(2);
        document.getElementById("resultado").textContent= `${valor} ${moedaOrigem} equivale a ${valorConvertido} ${moedaDestino}`;

    });
