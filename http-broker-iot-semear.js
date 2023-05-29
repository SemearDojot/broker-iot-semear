const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

// Configurações do MQTT
const mqttBroker = 'mqtt://localhost:1883'; // Endereço do broker MQTT
const mqttOptions = {
  username: 'dojot',
  password: 'admin:338b93',
};

// Configurações do servidor HTTP
const app = express();
const port = 3000; // Porta do servidor HTTP

// Middleware para fazer o parser do corpo da requisição como JSON
app.use(bodyParser.json());

// Rota para receber o payload JSON e publicar no MQTT
app.post('/payload', (req, res) => {
  const payload = req.body;

  // Conectar ao broker MQTT
  const client = mqtt.connect(mqttBroker, mqttOptions);

  client.on('connect', () => {
    // Publicar o payload no tópico desejado
    client.publish('admin:338b93/attrs', JSON.stringify(payload));

    // Encerrar a conexão MQTT e enviar uma resposta HTTP bem-sucedida
    client.end();
    res.sendStatus(200);
  });
});

// Iniciar o servidor HTTP
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
