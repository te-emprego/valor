---
id: methods
title: Methods
sidebar_label: Methods
---

O Valor acredita em _methods_ **puros** e **bem estruturados**, e ele te ajuda a criá-los, abstraindo completamente a requisição.

Um _method_ contém tudo que vai ser executado em determinado _endpoint_, abstraindo informações de requisições.

Essa mágica é possível por conta do serviço **Module Register Service**, que consegue referenciar tudo que a gente precisa diretamente do _endpoint_ para o _method_.

<span style="border: 1px dashed; display: inline-block; padding: 7px 10px;">
**Observação:** "_method_" é apenas o nome dado à responsabilidade do arquivo. Falando em código, o _method_ é uma **classe** que herda proriedades de outra classe padrão.
</span>

``` typescript
import { ModuleResponse } from '@interfaces'
import { ControllerMethod } from '@classes'

import UserModel from '../User.schema'
import { User } from '../User.interface'

// precisa herdar da classe ControllerMethod
class List extends ControllerMethod {
  private users: User[]

  // precisa de ter uma função handle
  public handle = async (): Promise<ModuleResponse> =>
    this
      .getUsers() // executa a função getUsers
      .then(this.respond) // finaliza a request com o status e data

  private async getUsers (): Promise<void> {
    this.users = await UserModel.find()

    this.status = 200 // stateful response code
    this.data = this.users // stateful response code
  }
}

export const list = new List()
```

Parece confuso? **Relaxa**! É mais simples do que você pensa :)

## ControllerMethod

Deve ter notado que o _method_ sempre extende de uma classe `ControllerMethod`. Ela é apenas uma camada com funções e propriedades padrão.

### Retorno

A função `handle` sempre irá retornar o uma _Promise_ do tipo `ModuleResponse`, que é o formato da resposta enviado pela função `respond` da classe `ControllerMethod`.

``` typescript
class Greet extends ControllerMethod {
  public handle = async (): Promise<ModuleResponse> =>
    this.status = 200
    this.data = { message: 'Hi, there!' }

    return this.respond
}
```

### `status` & `data`

Você dever ter reparado que, no exemplo acima, que nós setamos o `this.status` e `this.data` dentro da função `getUsers`.

Essas propriedades são herdadas do `ControllerMethod`, e elas dizem qual o status e corpo da resposta que vamos enviar.

No caso acima, definimos que:
- `status` recebe `200`; e
- `data` recebe a nossa lista de usuários (retornado do `UserModel.find()`).

### `respond`

Se der uma olhadinha no código acima, após o término da função `getUsers`, invocamos o a função `respond`. Essa função também é herdada da classe `ControllerMethod`.

Basicamente, o que ele faz é retornar nosso `status` e `data` na estrutura esperada pelo **Module Register Service**.

Então, **certifique-se de sempre setar o valor de `status` e `data` antes de retornar com `respond`**.

### `Auth`

A classe `ControllerMethod` também possui uma proriedade `Auth`. Ela é apenas uma instância do serviço de autenticação.

``` typescript
private compareCredentials = async (): Promise<void> => {
  // recupera senhas do estado da classe
  const toCompare = [
    this.credentials.password,
    this.user.password
  ]

  const match = await this.Auth.comparePassword(...toCompare)

  if (!match) {
    throw new this.HttpException(400, 'invalid credentials')
  }
}
```

### `HttpException`

Como já deve ter visto no spoiler acima, existe, também, uma referência à `HttpException`.

Caso queira interceptar sua requisição, por algum motivo, apenas lance um `HttpException` com status, mensagem e, se quiser, um corpo.

O método HttpExceptio espera 3 parâmetros:

- `status` código do status que será enviado
- `message` mensagem descrevendo o erro brevemente
- `data` corpo do erro, com mais detalhes

Geralmente, enviar o `status` e `message` é o suficiente.

Importante entender que se você lançar uma `HttpException`, a execução do seu método será automaticamente interrompida e absolutamente nada após aquilo será enviado.

``` typescript
private trhowErrorWithoutAnyReason = async (): Promise<void> => {
  throw new this.HttpException(400, 'invalid credentials')

  // código inacessível
  this
    .doSomethingElse()
    .then(this.doAnotherCoolThing)
}
```

**Importante:** Sempre lance uma `HttpException` ao e nunca um `Error`, pois o formato da `HttpExeption` é feito sob medida para o **Module Register Service**.


### Função `handle`

Você precisa saber que absolutamente tudo que for relacionado à _methods_ e _endpoints_ é gerenciado pelo **Module Register Service**. E como toda a conexão é abstraída por ele, precisamos seguir alguns padrões para que isso possa ser feito de forma automatizada.

Todos os _methods_ são iniciados por meio do função `handle`.

Essa função recebe os parâmetros passados pelo **Module Register Service** na hora de registrar o _endpoint_.

Ou seja: **a requisição irá inciar e finalizar nesse método**, independente de quantos métodos forem executados no meio do caminho.

O método handle não deve conter muita lógica, ele apenas serve para injetar os parâmetros da requisição no estado da classe, iniciar e retornar a corrente de promises.

Isso proporciona um desenvolvimento mais limpo, padronizado e de fácil manutenção.

## Boas práticas

O Valor deixa você no controle de tudo, mas te recomenda a realizar as coisas de forma padronizada. Se você seguir o padrão, vai ser muito mais fácil de econtrar ajuda e vai evitar alguns erros que você mesmo vai ter que arrumar, caso fuja muito da estrutura.

### Função `handle`

Tome como verdade que a função `handle`:

- Deverá inserir os parâmetros na classe;
- Não deverá conter lógica, apenas definir a corrente de promises;
- Retorna uma corrente de promises com cada etapa do método;
- Deverá retornar com um status e corpo.

Uma **boa função `handle`**:

``` typescript
public handle = async (credentials: Credentials): Promise<ModuleResponse> => {
  this.credentials = credentials

  return this
    .validateInput()
    .then(this.findUser)
    .then(this.compareCredentials)
    .then(this.generateToken)
    .then(this.respond)
}
```

Uma **má função `handle`**:

``` typescript
public handle = async (credentials: Credentials): Promise<ModuleResponse> => {
  this.credentials = credentials

  const inputIsValid = await this.validateInput()
  if (!inputIsValid) {
    throw new this.HttpException(400, 'invalid credentials')
  }

  const user = await this.findUser()
  if (!user) {
    throw new this.HttpException(400, 'invalid user')
  }

  const toCompare = [credentials.password, user.password]
  const credentialsAreValid = await this.compareCredentials(...toCompare)
  if(!credentialsAreValid) {
    throw new this.HttpException(400, 'invalid credentials')
  }

  const token = Token.encode(user)

  this.status = 200
  this.data = { token }

  return this.respond()
}
```

Conseguiu perceber que a primeira função, que é segregada, é muito mais fácil de modificar, testar e debugar? É muito melhor desse jeito! :)

## Exemplo de método

Abaixo um exemplo de método completo e documentado.

``` typescript
import { validateOrReject, IsString, IsEmail } from 'class-validator'

import { ModuleResponse, Credentials } from '@interfaces'
import { ControllerMethod } from '@classes'
import TokenService from '@services/Token.service'

import { User } from '../User.interface'
import UserModel from '../User.schema'

// classe de validacão de dados inputados
class InputValidation {
  @IsString()
  public password: string

  @IsEmail()
  public email: string
}


class Login extends ControllerMethod {
  // declarando as proriedades e suas interfaces
  private user: User
  private credentials: Credentials

  // recebe os parâmetros do endpoint
  public handle = async (credentials: Credentials): Promise<ModuleResponse> => {
    // injeta as credenciais no estado da classe
    // agora ela é acessível por todos os outros métodos
    this.credentials = credentials

    // inicia a cadeia de promises
    return this
      .validateInput() // primeiro, validamos o input
      .then(this.findUser) // depois recuperamos o usuário no banco
      .then(this.compareCredentials) // comparamos as credenciais
      .then(this.generateToken) // geramos um token
      .then(this.respond) // devolvemos a resposta com o token
  }

  // valida os inputs usando o class-validator
  private validateInput = async (): Promise<void> => {
    try {
      // tentamos validar nosso input
      const validation = new InputValidation()
      validation.email = this.credentials.email
      validation.password = this.credentials.password
      await validateOrReject(validation)
    } catch (error) {
      // caso a validação seja rejeitada, lançamos a HttpException
      throw new this.HttpException(400, 'invalid inputs')
    }
  }

  // recupera o usuário
  private findUser = async (): Promise<void> => {
    // buscamos o usuário na base de dados
    const user = await UserModel
      .findOne({
        email: this.credentials.email
      })
      // recuperar, também, a senha, que foi desabilitada de vir por padrão
      .select('+password')

    if (!user) {
      // caso o usuário não exista, lançamos a HttpException
      throw new this.HttpException(400, 'user does\'t exists')
    }

    // já que o usuário existe, injetamos ele no estado da classe
    this.user = user
  }

  // verifica se a senha está correta
  private compareCredentials = async (): Promise<void> => {
    const toCompare = [
      this.credentials.password,
      this.user.password
    ]

    // comparamos as senhas (booleano)
    const match = await this.Auth.comparePassword(...toCompare)

    if (!match) {
      // se não forem iguais, lança a HttpException
      throw new this.HttpException(400, 'invalid credentials')
    }
  }

  // gera o token
  private generateToken = (): void => {
    const token = TokenService.encode(this.user)

    // define o código de status da resposta
    this.status = 200

    // define o corpo da resposta (nosso token)
    this.data = { token }

    // como esse é o último método, a função respond será executada (veja no handle)
  }
}

export const login = new Login()
```