import paho.mqtt.client as mqtt

# Função chamada quando o cliente MQTT recebe uma conexão do broker
def on_connect(client, userdata, flags, rc):
    print("Conectado ao broker com código de resultado: " + str(rc))
    # Inscreva-se no tópico desejado para receber os payloads
    client.subscribe("seu/topico/aqui")

# Função chamada quando uma mensagem MQTT é recebida do broker
def on_message(client, userdata, msg):
    # Faça o parsing do payload recebido
    payload = msg.payload.decode("utf-8")
    print("Payload recebido: " + payload)

    # Publique o payload em outro endpoint MQTT
    publish_mqtt(payload)

# Função para publicar o payload em outro endpoint MQTT
def publish_mqtt(payload):
    # Configurações do endpoint MQTT
    broker = "outro-endpoint-mqtt"
    porta = 1883
    usuario = "seu-usuario"
    senha = "sua-senha"
    topico = "seu/outro-topico"

    # Criação do cliente MQTT
    client = mqtt.Client()
    client.username_pw_set(usuario, senha)

    # Conexão ao broker MQTT
    client.connect(broker, porta)

    # Publicação do payload no outro endpoint MQTT
    client.publish(topico, payload)

    # Encerramento da conexão
    client.disconnect()

# Configuração do cliente MQTT
client = mqtt.Client()

# Associação de callbacks
client.on_connect = on_connect
client.on_message = on_message

# Configurações do broker MQTT
broker = "35.196.200.67"  # IP do broker MQTT
porta = 1883

# Conexão ao broker MQTT
client.connect(broker, porta)

# Loop para manter a conexão MQTT ativa
client.loop_forever()
