# RestServer

# Inicar  MongoDB
```
docker-compose -f docker-compose/docker-compose.yml up -d
```

# Configuracion autentificacion por google
En el fichero **server/config/config.js** se encuentra una variable llamada
```
process.env.GOOGLE_CLIENT_ID
```
La cual hay que definir la CLIENT_ID  de google personal
# Instalar paquetes
```
npm install
```
## Arrancar el servidor
```
npm start
```

## Arrancar el servidor para realizar cambios
```
npm run nodemon
```