---
id: modules
title: Módulos
sidebar_label: Módulos
---

Módulos são um grupo de endpoints dentro da aplicação. Um módulo é composto por:

- Schema
- Interface
- Endpoints
- Controller

## Schema

O Schema é um Schema puro do mongoose.

Você pode ler diretamente na [documentação do mongoose sobre Schemas](https://mongoosejs.com/docs/guide.html) e obter todo suporte referente por lá.

``` typescript
import { Schema, model } from 'mongoose'
import { User } from './User.interface'

const UserSchema = new Schema({
  name: {
    type: String
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  birthdate: {
    type: Date
  }
})

export default model<User>('User', UserSchema)
```

## Interface

A interface é quem vai ajudar a gente a manter a consistência na tipagem dos dados referentes àquele módulo. O arquivo é basicamente um export de interfaces. É importante que nosso Schema siga nossa interface.

``` typescript
export interface User {
  name: string
  email: string
  password: string
  birthdate?: Date
}
```

## Endpoints

Arquivo responsável por controlar todos os endpoints (rotas) daquele módulo.

**Atenção:** Você **não deve** prefixar o módulo no arquivo de endpoints, pois essa é uma tarefa do `ModuleRegisterService`. Exemplo abaixo:

``` diff
export default [
  {
-    'route': '/users/active',
+    'route': '/active',
    'method': 'get',
    'description': 'Get all active users',
    '@controller': {
      'method': 'list:active'
    }
  }
]
```

A prefixação de um módulo deve ocorrer no momento do seu registro no arquivo `routes.js`:

``` typescript
routes.use('/users', UsersModule)
```

Como eu já informei no registro, todos os meus endpoints do módulo `UsersModule` serão automaticamente prefixados, fazendo com que o endpoint previamente mostrado seja acessível por: `/users/active`.

## Controller

Um controller é um conjunto de métodos. Ele apenas exporta os métodos criados dentro do diretório `methods`.

``` typescript
export { create }     from './methods/Create.method'
export { login }      from './methods/Login.method'
export { list }       from './methods/List.method'
export { updateInfo } from './methods/UpdateInfo.method'
export { find }       from './methods/Find.method'
export { deactivate } from './methods/Deactivate.mehtod'
```

Como métodos são peculiares, temos uma [documentação exclusiva](./methods) para eles.


## Arquivo `index.js`

O arquivo `index.js` de cada método é responsável por registrar os endpoints e conectar eles com os métodos.

Geralmente importamos tudo do nosso controller, nossos endpoints e mesclamos ele com o serviço `ModuleRegisterService`, fornecido pelo Valor.

``` typescript
import ModuleRegisterService from '@services/ModuleRegister.service'
import * as Controller from './User.controller'
import Endpoints from './User.endpoints'

const userModule = new ModuleRegisterService(Endpoints, Controller)

userModule.registerEndpoints() // gera o módulo

export default userModule.getRoutes() // exportamos as rotas do módulo
```

Caso você queira interceptar as rotas diretamente, você pode, **apesar de não recomendarmos**:

``` typescript
import ModuleRegisterService from '@services/ModuleRegister.service'
import * as Controller from './User.controller'
import Endpoints from './User.endpoints'

const userModule = new ModuleRegisterService(Endpoints, Controller)

userModule.registerEndpoints()

// intercepta as rotas
const interceptedRoutes = userModule.getRoutes()

// insere uma rota fora do endpoint
interceptedRoutes.get('/testing-route', (req, res, next) => {
  res.send('Hi! I am a testing route!')
})

export default interceptedRoutes // exportamos as novas rotas
```

Esse arquivo é gerado automaticamente pela CLI e, geralmente, não tocamos nele. Mas agora você já sabe para que ele serve :)