# Pricing Service

API REST que determina el precio aplicable de un producto para una marca en una fecha dada. Cuando múltiples tarifas se solapan en rangos de fechas, prevalece la de mayor prioridad.

## Tecnologías

**Backend:** Java 17, Spring Boot 3.4, Spring Data JPA, H2, Flyway, JUnit 5, Mockito

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS

**Infraestructura:** Docker, docker-compose, Nginx

## Arquitectura

El proyecto sigue **Arquitectura Hexagonal (Ports & Adapters)** con principios DDD:

```
com.pricing/
├── domain/                  ← Modelo rico, Value Objects, puertos
│   ├── model/               (Price, Money, BrandId, ProductId, DateRange)
│   ├── port/input/          (FindApplicablePriceUseCase)
│   ├── port/output/         (PriceRepositoryPort)
│   └── exception/           (PriceNotFoundException)
├── application/             ← Caso de uso (POJO, sin anotaciones Spring)
│   └── usecase/             (FindApplicablePriceUseCaseImpl)
└── infrastructure/          ← Adaptadores, config, mappers
    ├── adapter/input/rest/  (PriceController, DTOs)
    ├── adapter/output/jpa/  (JpaPriceAdapter, PriceEntity)
    ├── config/              (BeanConfig, CorsConfig)
    ├── mapper/              (PriceMapper)
    └── exception/           (GlobalExceptionHandler)
```

Las dependencias apuntan hacia adentro: infraestructura → aplicación → dominio. El dominio no conoce Spring ni JPA.

## Ejecución con Docker

```bash
docker-compose up --build
```

- **Backend:** http://localhost:8080
- **Frontend:** http://localhost:3000
- **H2 Console:** http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:pricingdb`)

## Ejecución local (desarrollo)

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

El frontend en modo desarrollo (puerto 5173) tiene un proxy configurado en Vite que redirige `/api` al backend en el puerto 8080.

## API

### Consultar precio aplicable

```
GET /api/prices?date={ISO-8601}&productId={id}&brandId={id}
```

**Ejemplo:**
```
GET /api/prices?date=2020-06-14T16:00:00&productId=35455&brandId=1
```

**Respuesta (200):**
```json
{
  "productId": 35455,
  "brandId": 1,
  "priceList": 2,
  "startDate": "2020-06-14T15:00:00",
  "endDate": "2020-06-14T18:30:00",
  "price": 25.45,
  "currency": "EUR"
}
```

**Errores:** 400 (parámetros inválidos), 404 (precio no encontrado)

La especificación completa está en `backend/src/main/resources/openapi.yaml`.

## Tests

```bash
cd backend
mvn test
```

**68 tests** organizados en tres niveles:

| Nivel | Tests | Descripción |
|-------|-------|-------------|
| Unitarios | 52 | Value Objects, Price, caso de uso (con Mockito) |
| Integración | 6 | JPA adapter + H2 + Flyway |
| Sistema | 5 | Endpoint REST completo (5 escenarios obligatorios) |
| **Total** | **68** | |

### Los 5 escenarios de sistema

| Escenario | Fecha | Resultado |
|-----------|-------|-----------|
| 1 | 2020-06-14 10:00 | Tarifa 1 — 35.50 EUR |
| 2 | 2020-06-14 16:00 | Tarifa 2 — 25.45 EUR |
| 3 | 2020-06-14 21:00 | Tarifa 1 — 35.50 EUR |
| 4 | 2020-06-15 10:00 | Tarifa 3 — 30.50 EUR |
| 5 | 2020-06-16 21:00 | Tarifa 4 — 38.95 EUR |

## Base de datos

Tabla `PRICES` inicializada con Flyway (`db/migration/`):

| BRAND_ID | START_DATE | END_DATE | PRICE_LIST | PRODUCT_ID | PRIORITY | PRICE | CURR |
|----------|-----------|----------|------------|------------|----------|-------|------|
| 1 | 2020-06-14 00:00:00 | 2020-12-31 23:59:59 | 1 | 35455 | 0 | 35.50 | EUR |
| 1 | 2020-06-14 15:00:00 | 2020-06-14 18:30:00 | 2 | 35455 | 1 | 25.45 | EUR |
| 1 | 2020-06-15 00:00:00 | 2020-06-15 11:00:00 | 3 | 35455 | 1 | 30.50 | EUR |
| 1 | 2020-06-15 16:00:00 | 2020-12-31 23:59:59 | 4 | 35455 | 1 | 38.95 | EUR |

## Decisiones de diseño

- **API First:** Contrato OpenAPI 3.0 definido antes de la implementación
- **Rich Domain Model:** La lógica de resolución por prioridad vive en `Price`, no en un servicio
- **Value Objects como records:** Inmutables, con validación en el constructor compacto
- **Tres modelos separados:** `Price` (dominio) ≠ `PriceEntity` (JPA) ≠ `PriceResponseDto` (API)
- **Caso de uso sin @Service:** Instanciado manualmente en `BeanConfig` para mantener la capa de aplicación libre de Spring
- **@ControllerAdvice:** Manejo centralizado de excepciones (404, 400, 500)
- **Flyway:** Migraciones SQL versionadas para esquema y datos iniciales
- **TDD:** Tests escritos antes de la implementación (visible en el historial de commits)
