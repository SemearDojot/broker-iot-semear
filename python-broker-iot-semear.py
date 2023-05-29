import json
import paho.mqtt.client as mqtt

broker_receive = "localhost"
porta_receive = 1884
usuario_receive = "dojot"
senha_receive = "dojot"
topico_receive = "semear"

broker_publish = "localhost"
porta_publish = 1883
usuario_publish = "admin:338b93"
senha_publish = "dojot"
topico_publish = "admin:338b93/attrs'"

def on_connect(client, userdata, flags, rc):
    print("Conectado ao servidor MQTT")
    client.subscribe(topico_receive)

def on_message(client, userdata, msg):
    print("Mensagem recebida no tópico: " + msg.topic)
    print("Conteúdo: " + msg.payload.decode())

    # Parse do payload JSON recebido
    payload = json.loads(msg.payload.decode())
    # Fazer o parser e extrair informações
    # ...
    # resultado = ...

    # Conectar ao servidor MQTT de publicação
    client_publish = mqtt.Client()
    client_publish.username_pw_set(usuario_publish, senha_publish)
    client_publish.connect(broker_publish, porta_publish)

    # Publicar o resultado via MQTT
    client_publish.publish(topico_publish, json.dumps(resultado))
    print("Resultado publicado com sucesso no tópico: " + topico_publish)

client_receive = mqtt.Client()
client_receive.username_pw_set(usuario_receive, senha_receive)
client_receive.on_connect = on_connect
client_receive.on_message = on_message

client_receive.connect(broker_receive, porta_receive)

client_receive.loop_forever()
