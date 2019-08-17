---
id: structure
title: Estrutura
sidebar_label: Estrutura
---

A Valor implementa uma estrutura objetiva e direta.

## Overview

|Diretório        |Descrição
|-----------------|--------------
|`**/__tests__`   |Diretório de testes de determinado módulo
|`src/classes`    |Classes utilizadas por toda aplicação
|`src/interfaces` |Interfaces utilizadas por toda aplicação
|`src/middlewares`|Middlewares da aplicação
|`src/modules`    |Módulos (endpoints) da aplicação
|`src/services`   |Serviços internos da aplicação
|`.env`           |Variáveis do ambiente de produção
|`.env.test`      |Variáveis do ambiente de teste

## Módulos

Módulos são um grupo de endpoints dentro da aplicação. Um módulo é composto por:

- Schema
- Interface
- Endpoints
- Controller

## Classes

Geralmente, quando queremos compartilhar uma classe com todos os módulos da aplicação, criamos essa classe dentro do diretório classes.

Este diretório é reservado para classes globais, e o valor te entrega algumas dessas classes, como:

- [`HttpException`](./methods#httpexception)
- [`ControllerMethod`](./methods#controllermethod)

Lembrando que a exportação dessas classes deve ser feita pelo arquivo `index.ts`, dentro do diretório.


## Interfaces

O diretório de interfaces pode parecer um pouco confuso, no começo. Afinal, eu não deveria ter as interfaces do meu módulo dentro do arquivo `Module.interface.ts`? A resposta é: **justamente.**

O diretório de interfaces serve para você inserir outras interfaces, que não tem relação com o seu _Module_. O Valor utiliza esse diretório para criar interfaces internas, por exemplo.

Lembrando que, quando criamos uma interface, nós devemos exportar ela pelo arquivo `index.js`:

``` diff
import Controller from './Controller.interface'
import Credentials from './Credentials.interface'
import Endpoint from './Endpoint.interface'
import ModuleResponse from './ModuleResponse.interface'
+import Custom from './Custom.interface'

export { ModuleResponse }
export { Controller }
export { Credentials }
export { Endpoint }
+export { Custom }
```

Assim, podemo acessá-la pelo alias `@interfaces`:

``` typescript
import { Custom } from '@interfaces'
```

## Middlewares

Middlewares são funções que tem acesso direto à requisição, e, na estrutura do Valor, são chamados antes do _Method_.

O Valor utiliza a API do Express para _middlewares_, então, se quiser saber mais sobre ele, acesse a [documentação oficial do express sobre middlewares](https://expressjs.com/pt-br/guide/using-middleware.html).

Você também pode ver mais sobre, acessando a [documentação do Valor sobre middlewares](./middlewares).