---
id: module-register-service
title: Module Register Service
sidebar_label: Module Register Service
---

## O que é?

O _Module Register Service_ — ou Serviço de Registro de Módulos, em português — tem um papel muito importante dentro da arquitetura do Valor. Ele que faz toda a comunicação entre o os métodos e a requisição.

Se você já leu a documentação dos métodos, viu que eles são puros e não recebem nada que não precisam. Alguém precisa fazer a ponte entre as informações enviadas pelo cliente e o método. Esse alguém é o **Module Register Service**.

Como o _Module Register Service_ tem acesso direto aos dados da requisição, ele consegue capturar as informações mapeadas no _Endpoint_, e direcioná-las ao _method_ como argumentos. Isso é fantástico! =)

## Etapas

Você quase nunca vai presisar se preocupar com o MRS, visto que tudo é gerado automaticamente pela CLI.

Mas, a título de curiosidade, ele é utilizado na hora de exportar o módulo. Dentro do módulo, observe o arquivo `index.js`:

``` typescript
// importa o MRS
import ModuleRegisterService from '@services/ModuleRegister.service'

import * as Controller  from './User.controller'
import Endpoints        from './User.endpoints'

// novo módulo
const userModule = new ModuleRegisterService(Endpoints, Controller)

// registra os endpoints no módulo
userModule.registerEndpoints()

// exporta as rotas registradas do módulo
export default userModule.getRoutes()
```

---

## Requisição

Abaixo um mapeamento simplificado da requisição com todas as etapas usando a notação BPMN 2.0

![processo da requisição com valor](/img/request.svg)

- [Donwload do mapeamento (.bpmn)](/diagrams/request.bpmn)
- [Donwload do mapeamento (.svg)](/img/request.svg)