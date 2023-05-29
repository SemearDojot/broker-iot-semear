const mqtt = require('mqtt');

// Configurações do servidor MQTT de entrada
const incomingBrokerUrl = 'mqtt://localhost:1884'; // URL do servidor MQTT de entrada
const incomingTopic = 'semear'; // Tópico para receber o JSON

// Configurações do servidor MQTT de saída
const outgoingBrokerUrl = 'mqtt://localhost:1883'; // URL do servidor MQTT de saída
const outgoingUsername = 'admin:338b93'; // Usuário para autenticação
const outgoingPassword = 'dojot'; // Senha para autenticação
const outgoingTopic = 'admin:338b93/attrs'; // Tópico para publicar o JSON

// Conecta-se ao servidor MQTT de entrada
const incomingClient = mqtt.connect(incomingBrokerUrl);

// Conecta-se ao servidor MQTT de saída
const outgoingClient = mqtt.connect(outgoingBrokerUrl, {
  username: outgoingUsername,
  password: outgoingPassword
});

// Lida com a conexão estabelecida com o servidor MQTT de entrada
incomingClient.on('connect', () => {
  console.log('Conectado ao servidor MQTT de entrada');

  // Inscreve-se no tópico para receber o JSON
  incomingClient.subscribe(incomingTopic, (err) => {
    if (err) {
      console.error('Erro ao se inscrever no tópico de entrada:', err);
    } else {
      console.log('Inscrito no tópico de entrada:', incomingTopic);
    }
  });
});

// Lida com a mensagem recebida do servidor MQTT de entrada
incomingClient.on('message', (topic, message) => {
  // Converte a mensagem recebida para JSON
  const json = JSON.parse(message.toString());
  console.log('Gateway: ', json);

  // Publica o JSON no servidor MQTT de saída
  outgoingClient.publish(outgoingTopic, JSON.stringify(json), (err) => {
    if (err) {
      console.error('Erro ao publicar no servidor MQTT de saída:', err);
    } else {
      console.log('JSON publicado no servidor MQTT de saída:', outgoingTopic);
    }
  });
});

// Lida com a conexão estabelecida com o servidor MQTT de saída
outgoingClient.on('connect', () => {
  console.log('Conectado ao servidor MQTT de saída');
});
