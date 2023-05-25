const mosca = require('mosca');
const mqtt = require('mqtt');

// Configurações do broker MQTT
const brokerSettings = {
  port: 1884 // Porta do broker MQTT
};

// Criação do servidor MQTT
const server = new mosca.Server(brokerSettings);

// Evento de conexão do cliente MQTT
server.on('clientConnected', (client) => {
  console.log(`Cliente conectado: ${client.id}`);
});

// Evento de desconexão do cliente MQTT
server.on('clientDisconnected', (client) => {
  console.log(`Cliente desconectado: ${client.id}`);
});

// Evento de publicação de mensagem MQTT
server.on('published', (packet) => {
  
  const payload_raw = packet.payload.toString();
  console.log("aaaaaa" + payload_raw);

  //Troca Aspas Simples por Aspas Duplas
  let payload_correto = JSON.parse(payload_raw.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false'));

  let jsonUplink = payload_correto.attrs.find(item => item.n === 'Contador_uplink'); //Extrai Contador
  let jsonActivation_mode = payload_correto.attrs.find((item) => item.n === "Modo"); //Extrai Modo
  let jsonDatarate = payload_correto.attrs.find((item) => item.n === "Taxa_dados"); //Extrai Taxa
  let jsonRssi = payload_correto.attrs.find((item) => item.n === "Rssi"); //Extrai Rssi
  let jsonSnr = payload_correto.attrs.find((item) => item.n === "Snr"); //Extrai Snr
  let jsonModel = payload_correto.attrs.find((item) => item.n === "model"); //Extrai Model
  let jsonExt_pwr = payload_correto.attrs.find((item) => item.n === "Ext_pwr"); //Extrai Ext_pwr
  let jsonTemperatura = payload_correto.attrs.find((item) => item.n === "Temperatura"); //Extrai Temperatura
  let jsonUmidade = payload_correto.attrs.find((item) => item.n === "Umidade"); //Extrai Umidade
  let jsonEmw_comprimento = payload_correto.attrs.find((item) => item.n === "Emw_comprimento"); //Extrai Emw_comprimento
  let jsonVelocidade_med_Vento = payload_correto.attrs.find((item) => item.n === "Velocidade_med_Vento"); //Extrai Velocidade_med_Vento
  let jsonVelocidade_rg_Vento = payload_correto.attrs.find((item) => item.n === "Velocidade_rg_Vento"); //Extrai Velocidade_rg_Vento
  let jsonEmw_direcao_vento = payload_correto.attrs.find((item) => item.n === "Emw_direção_vento"); //Extrai Emw_direção_vento
  let jsonEmw_temperatura = payload_correto.attrs.find((item) => item.n === "Emw_temperatura"); //Extrai Emw_temperatura
  let jsonEmw_umidade = payload_correto.attrs.find((item) => item.n === "Emw_umidade"); //Extrai Emw_umidade
  let jsonEmw_luminosidade = payload_correto.attrs.find((item) => item.n === "Emw_luminosidade"); //Extrai Emw_luminosidade
  let jsonEmw_uv = payload_correto.attrs.find((item) => item.n === "Emw_uv"); //Extrai Emw_uv
  let jsonEmw_irradiancia = payload_correto.attrs.find((item) => item.n === "Emw_irradiancia"); //Extrai Emw_irradiancia
  let jsongateway = payload_correto.attrs.find((item) => item.n === "gateway");//Extrai gateway

  let output_final = {
    "Contador_uplink": jsonUplink.v,
    "Modo": jsonActivation_mode.vs,
    "Taxa_dados": jsonDatarate.vs,
    "Rssi": jsonRssi.v,
    "Snr": jsonSnr.v,
    "model": jsonModel.vs,
    "Ext_pwr": jsonExt_pwr.vb,
    "Temperatura": jsonTemperatura.v,
    "Umidade": jsonUmidade.v,
    "Emw_comprimento": jsonEmw_comprimento.v,
    "Velocidade_med_Vento": jsonVelocidade_med_Vento.v,
    "Velocidade_rg_Vento": jsonVelocidade_rg_Vento.v,
    "Emw_direcao_vento": jsonEmw_direcao_vento.v,
    "Emw_temperatura": jsonEmw_temperatura.v,
    "Emw_umidade": jsonEmw_umidade.v,
    "Emw_luminosidade": jsonEmw_luminosidade.v,
    "Emw_uv": jsonEmw_uv.v,
    "Emw_irradiancia": jsonEmw_irradiancia.v,
    "gateway": jsongateway.vs
  };

  //console.log(JSON.stringify(output_final));
  
  const message = output_final.toString();
  const topic = packet.topic;
  
  console.log(`Nova mensagem publicada no tópico '${topic}': ${message}`);

  // Encaminhamento para o agente IoT usando o cliente MQTT
  const agentUrl = 'mqtt://semear.dojot.com.br:1883'; // URL do agente IoT
  const agentTopic = 'admin:338b93/attrs'; // Tópico do agente IoT

  const clientAgent = mqtt.connect(agentUrl, {
    username: 'admin:338b93',
    password: ''
  });

  clientAgent.on('connect', () => {
    clientAgent.publish(agentTopic, message);
    console.log('Payload encaminhado com sucesso para o agente IoT');
    clientAgent.end(); // Fecha a conexão após o envio
  });

  
});

// Inicia o servidor MQTT
server.on('ready', () => {
  console.log('Broker MQTT iniciado');
});
