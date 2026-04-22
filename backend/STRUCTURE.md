# Backend NestJS - Estructura Sugerida

```text
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts

  src/
    main.ts
    app.module.ts

    config/
      env.validation.ts
      app.config.ts

    common/
      constants/
      decorators/
      filters/
      interceptors/
      pipes/

    prisma/
      prisma.module.ts
      prisma.service.ts

    orders/
      orders.module.ts
      orders.controller.ts
      orders.service.ts
      orders.gateway.ts
      dto/
        create-order.dto.ts
      entities/
        order.entity.ts
      mappers/
        order.mapper.ts

    products/
      products.module.ts
      products.controller.ts
      products.service.ts
      dto/
        create-product.dto.ts
      entities/
        product.entity.ts

  test/
    orders.e2e-spec.ts

  package.json
  tsconfig.json
  nest-cli.json
  .env
  .env.example
```

## Notas de arquitectura
- `prisma/`: capa de persistencia y migraciones.
- `src/prisma/`: integración de Prisma con inyección de dependencias en NestJS.
- `src/orders/`: dominio principal (API REST + WebSocket gateway).
- `src/common/`: componentes transversales reutilizables.
- `src/config/`: validación y carga centralizada de configuración.
