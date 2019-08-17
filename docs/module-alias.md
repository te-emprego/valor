---
id: module-alias
title: Alias
sidebar_label: Alias
---

O Valor disponibiliza alguns alias para imports absolutos.

Lista de alias disponíveis:

|Alias            |Path                 |Type     |Sample
|-----------------|---------------------|---------|-----------------------
|`@modules/*`     |modules/*            |`default`|`import Module from '@modules/module'`
|`@services/*`    |services/*           |`default`|`import Service from '@services/service'`
|`@middlewares/*` |middlewares/*        |`default`|`import Middleware from '@middlwares/middleware'`
|`@config`        |config.ts            |`default`|`import Config from '@config'`
|`@routes`        |routes.ts            |`default`|`import Routes from '@routes'`
|`@classes`       |classes/index        |`export` |`import { Class } from '@classes'`
|`@interfaces`    |interfaces/index     |`export` |`import { Interfaces } from '@interfaces'`

_você pode configurar estes alias dentro do arquivo `tsconfig.json`, mas certifique-se de adicioná-los novamente quando atualizar a versão do Valor._

## Por que usar import alias?

É muito comum, especialmente em estruturas bem organinizadas, a necessidade de importar, por exemplo, um arquivo num outra ramificação da árvore de diretórios, e isso pode ser um pouco chato.

``` typescript
import Config from '../../../../config'
```

Além do mais, isso pode gerar um problema, caso seu arquivo mude de nível hierárquico na árvore de diretórios. Você vai ter que atualizar os imports de mundo que usa aquele arquivo, e todos os imports relativos que aquele arquivo usa.

Para evitar esse problema, podemos usar os alias para imports absolutos:

``` typescript
import Config from '@config' // funciona de qualquer lugar da app
```