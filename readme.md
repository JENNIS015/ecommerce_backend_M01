# 🏪 eCommerce 🏪
Este eCommerce fue desarrollado para el curso de CoderHouse con el nombre **Programación Backend** 


## 📁 Datos del proyecto 📁

* **Version de Node:**  v16.14.2
* **Tecnologias Utilizadas:**
Express, JavaScript, MongoDB, Compression,Passport, JsonWebToken,Handlebars,Twilio,Nodemailer,Bootstrap,SocketIO


## Usuario Administrador

EMAIL =  admin@test.com
PASSWORD = 123456

Este usuario esta configurado por defecto para el chat, a excepción que se aclare en .env otro correo y modifique permisos base de datos para que sea administrador (membershipID = 1).
Por defecto al registrar un nuevo usuario tiene membershipID 2.


## Chat a tienda

Si el usuario se conecta y la tienda no esta online, el chat se guardara en base de datos para ser leido al conectarse.
Los usuarios online y mensajes tiene respaldo en MongoDB.
El usuario solo tiene posibilidad de enviar un chat a la tienda.
El chat de la tienda para responder selecciona el usuario que desea.


## 🚀 Como ejecutar el proyecto 🚀

Para poder correr el proyecto debemos clonarlo

Luego debemos poder nuestras prorpias credecianles en el `.env` para eso podemos copiar el `.env.example` que nos muestra las credenciales que necesitamos.

```dotenv
## MongoDB
MONGOURL= sample
DB_NAME = sample
SECRET_MONGO=sample

## Facebook
FACEBOOK_APP_ID= sample
FACEBOOK_APP_SECRET= sample

## Google
GOOGLE_ID=sample
SECRET_ID=sample

## Emails
TEST_EMAIL =sample
PASS_EMAIL =sample
ADMIN_EMAIL=sample
CHAT_ADMIN_EMAIL=sample

## Twilo
ACCOUNT_SID=sample
AUTH_TOKEN=sample
TWILOPHONE=+sample

## WhatsApp
WHATSAPP_ADMIN=sample
WHATSAPP_FROM=sample

## Secret
PRIVATE_KEY_JWT=sample
 
```

Una vez que tengamos las dependencias instaladas podemos ejecutarlo de la siguiente manera:

```shell
npm i
npm start
```

---


