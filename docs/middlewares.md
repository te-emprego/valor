---
id: middlewares
title: Middlewares
sidebar_label: Middlewares
---

Middlewares são funções que tem acesso direto à requisição, e, na estrutura do Valor, são chamados antes do _Method_.

O Valor utiliza a API do Express para _middlewares_, então, se quiser saber mais sobre ele, acesse a [documentação oficial do Express sobre middlewares](https://expressjs.com/pt-br/guide/using-middleware.html).

## Criando um _middleware_

Antes de criar um middleware, é importante que você entenda o que são os objetos _Request_ (`req`), _Response_ (`res`) e _NextFunction_ (`next`) do Express.

Um breve resumo:

- `req` contém os dados da requisição feita pelo cliente (_headers_, _body_, etc.);
- `res` contém um conjunto de métodos para gerar a resposta para o cliente (_status_, _send_, etc.);
- `next` quando executada, informa que a próxima ação pode ser executada.

Exemplo de _middleware_ que verifica se o cliente está apto a prosseguir com a solicitação:

```typescript
import { Request, Response, NextFunction } from 'express'
import Token from '@services/Token.service'

export const Auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // verifica se o cliente enviou o header Authorization
  const hasAuthorizationToken = req.headers.hasOwnProperty('authorization')
  if (!hasAuthorizationToken) {
    return res.status(401).send({ message: 'Token not provided' })
  }

  // verifica se o token está formatado corretamente
  const [, token] = req.headers.authorization.split(' ')
  if (!token) {
    return res.status(401).send({ message: 'Malformatted token' })
  }

  // verifica se o token é válido (pode ser decodificado)
  const tokenIsValid = Token.decode(token)
  if (!tokenIsValid) {
    return res.status(401).send({ message: 'Invalid token' })
  }

  // verifica se aquele token tem permissão para executar aquele endpoint (ACL)
  const hasPermissionToExecuteEndpoint = Token.hasPermission(token, req.originalUrl)
  if (!hasPermissionToExecuteEndpoint) {
    return res.status(403).send({ message: 'Forbidden' })
  }

  // passa para frente
  next()
}
```

## Utilizando um _middleware_ em um _endpoint_

Existem dois tipos de _middlewares_: os **globais** e os **injetados**.

- **Globais:** São middlewares que são inseridos automaticamente em **todos os módulos, sem exceção.**
- **Injetados:** São middlewares que são injetados manualmente dentro de cada endpoint.

### Registrando um _middleware_ global

Registrar um _middleware_ global é muito simples. Basta acessar o arquivo `index.ts` dentro do diretório `@middlewares`, importar o _middleware_ desejado e exportá-lo dentro do array de middlewares globais:

``` diff
import RateLimit from './RateLimit.middleware'
+import CustomMiddleware from './Custom.middleware'

export default [
  RateLimit,
+  CustomMiddleware
]
```

É só isso. =)

### Injetando um _middleware_ em um endpoint específico

Injetar um _middleware_ em um endpoint específico também é fácil.

1. Acessar o arquivo `Module.endpoints.ts`;
2. Importe o _middleware_ no topo do arquivo;
3. Adicione dentro da chave `'@middlewares'` do endpoint desejado.

``` diff
+import { loginLimiter } from '@middlewares/RateLimit.middleware'

export default [
  // ...outros endpoints
  {
    'route': '/login',
    'method': 'post',
    'description': 'login user in',
+   '@middlewares': [ loginLimiter ],
    '@controller': {
      'method': 'login',
      'params': ['body.credentials']
    }
  }
]
```

**Observação:** a chave `'@middlewares'` precisa ser um _Array_ e ela não é enviada na auto-documentação.
