<center>
  <img src="./docs/img/logo.svg" alt="valor" width="200"/>
</center>


Boilerplate utilizado pelo [teemprego.com.br](https://teemprego.com.br).

Procurando pela documentação?

- [Site oficial da documentação](https://te-emprego.github.io/valor)
- [Repositório da documentação](https://github.com/te-emprego/valor-docs)

Built on top of:

- express
- mongoose
- node v12

## `.env` sample
``` env
# app port
PORT=

# jwt decode token
SECRET=

# database connection string
DATABASE_CONNECTION_STRING=

# local docker-compose mongodb init credentials
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=

# google oauth 2.0 api keys
PASSPORT_GOOGLE_CLIENT_ID=
PASSPORT_GOOGLE_CLIENT_SECRET=
```

Você também pode gerar um arquivo `.env` com o comando `node valor generate:env`.

Este repositório está sob a [licença GNU GLP v3](https://www.gnu.org/licenses/gpl-3.0.pt-br.html)
