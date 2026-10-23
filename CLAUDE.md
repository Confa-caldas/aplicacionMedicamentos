# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

Aplicación Angular de **Confa (Confamiliares Caldas)** para el **registro de la aplicación de medicamentos e insumos a pacientes hospitalizados**. La usa el personal asistencial (enfermería) de Confa. El usuario inicia sesión con usuario/contraseña o con **reconocimiento facial**, luego ubica al paciente (escaneando el código de la manilla / documento, o eligiendo un **SAB** y la lista de admisiones de ese SAB) y registra, por cada medicamento formulado, si se **aplicó** o **no se aplicó** (con causa), la cantidad, la observación y si se **descuenta de la orden**. También registra el consumo de **insumos** y consulta la **planeación** (horarios) y el **historial de aplicaciones**.

Toda la lógica clínica vive en el backend `medicamentosWS` (Java, servidor SAS de Confa). Este front solo llama sus servicios `metodo1`..`metodo9`.

El `README.md` es el genérico del Angular CLI y el nombre del proyecto en `package.json`/`angular.json` es **`sas-angular` / `sasAngular`** (el `<title>` del `index.html` también es "SasAngular"). No describe este proyecto.

Repositorio remoto: GitHub `Confa-caldas/aplicacionMedicamentos`. Ramas: `master` (local) y `origin/devCarol` (rama de trabajo, hoy con el mismo contenido que `master`). Hay ramas remotas de revert (`revert-4-devCarol`, `revert-5-revert-4-devCarol`) que quedaron del último ciclo de PRs. Historial: 57 commits desde nov-2024. Los commits recientes cambian la `x-api-key` del reconocimiento facial, alternan URLs pruebas/producción y prenden/apagan el letrero "Ambiente de Pruebas". El último merge (PR #6, oct-2026) separa las URLs por ambiente y condiciona los letreros a `environment.production`, **pero ver "Ambientes": esa separación no funciona en el build**.

## Versiones y entorno de ejecución

| Pieza | Versión |
|---|---|
| Angular / CLI | `^17.3` (instala 17.3.12), componentes **standalone**, sin `NgModule` |
| Builder | `@angular-devkit/build-angular:application` (esbuild) con **SSR + prerender** |
| TypeScript | `~5.4.2`, `strict: true`, `strictTemplates: true` |
| UI | Bootstrap 5.3 (CSS + `bootstrap.bundle` JS global), bootstrap-icons por CDN en `index.html`, FontAwesome, SweetAlert2 |
| Otros | jQuery (para abrir modales), `ngx-webcam` (cámara), `crypto-js` (SHA-256), `ngx-cookie-service`, Express 4 (servidor SSR) |
| Node | Validado con Node 22.12 / npm 10.9. `@types/node` es 18 |

No hay `node_modules` en este checkout. `npm ci` funciona sin flags extra.

## Comandos de desarrollo

```bash
npm ci                      # instalar dependencias
npm start                   # ng serve (config development) → http://localhost:4200
npm run build               # ng build → config **pruebas** por defecto → dist/sas-angular/
npm run build -- --configuration production   # build de producción (environment.prod.ts)
npm run watch               # build development en modo watch
npm run serve:ssr:sasAngular  # sirve el build SSR: node dist/sas-angular/server/server.mjs (PORT o 4000)
npm test                    # ng test (Karma) — hoy NO compila, ver "Deuda técnica"
```

Estado validado (oct-2026, copia limpia de `HEAD`):
- `npm ci` ✔ y `ng build` ✔ (~15 s). Prerenderiza 3 rutas: `/`, `/home`, `/login-interno`.
- Warnings esperados (no rompen): bundle inicial 1.05 MB > budget 500 kB; CSS de `home` (3.2 kB) y `welcome` (2.5 kB) > budget 2 kB (el error está en 4 kB, `home` está cerca); `crypto-js`, `jquery`, `sweetalert2` no son ESM; 2 reglas `.form-floating>~label` descartadas.
- `ng test --watch=false --browsers=ChromeHeadless` ✘: `camera.component.ts:29 Cannot find name 'global'` (el `tsconfig.spec.json` no incluye tipos de Node).

## Ambientes

Dos archivos en `src/environments/`:

| Clave | `environment.ts` | `environment.prod.ts` |
|---|---|---|
| `production` | `false` | `true` |
| `identificacionSas` (backend medicamentos) | `https://sasweb.confa.co:8322/medicamentosWS/rest/medicamentos/` (**DMZSAS, pruebas**) | `https://sasweb.confa.co:8586/medicamentosWS/rest/medicamentos/` (**producción**) |
| `consultaLambdaDirecta` (facial) | `https://api-facial.confa.co/identificarvalidar` | igual |
| `consultarIp` | `https://appint.confa.co/consultaIP/circular007/obtenerIP/` | igual |
| `apiIngresoConfa` | `https://app.confa.co:8687/ingresoConfaWSSGC/rest/` (comentario dice "pruebas apuntando a genesys") | igual |

Configuraciones de build en `angular.json`:

| Configuración | Environment | Cuándo se usa |
|---|---|---|
| `pruebas` (**`defaultConfiguration`**) | `environment.ts` (8322, letreros visibles) | `npm run build` sin flags → ramas distintas de `master` en Amplify |
| `production` | `environment.prod.ts` vía `fileReplacements` (8586, sin letreros) | `npm run build -- --configuration production` → `master` en Amplify |
| `development` | `environment.ts`, sin optimizar, con sourcemaps | `ng serve` / `npm run watch` |

Verificado en el bundle: `pruebas` → `sasweb.confa.co:8322`, `production: false`, 3 letreros; `production` → `8586`, `production: true`, 0 letreros. Antes de oct-2026 faltaba el `fileReplacements` y `master` salía en pruebas. **No quites el `fileReplacements` ni cambies `defaultConfiguration` a `production`**: el build spec de Amplify depende de que `npm run build` a secas genere pruebas.

Puertos conocidos del backend en el historial: `8586` producción, `8322` DMZSAS (pruebas), `8361` nbappo, `localhost:8081` local.

## Infraestructura y despliegue

- Se despliega en **AWS Amplify** (hosting estático). El build spec vive **solo en la consola de Amplify** (no hay `amplify.yml` en el repo): Node 18, `npm install --legacy-peer-deps`; si `AWS_BRANCH == master` → `npm run build -- --configuration production`, si no → `npm run build`; luego `npx gulp || echo ...` (este proyecto no tiene gulp, ese paso no hace nada); artefactos `dist/sas-angular/browser`.
- Esa lógica funciona porque `defaultConfiguration` es `pruebas` y `production` tiene `fileReplacements` (ver "Ambientes"). Para cambiar a qué backend apunta cada ambiente, edita el archivo de environment correspondiente, no el build spec.
- La salida es `dist/sas-angular/` con `browser/` (estático + rutas prerenderizadas con `index.html` por carpeta) y `server/server.mjs` (Express SSR). Un hosting estático debe publicar `dist/sas-angular/browser` y redirigir rutas desconocidas a `index.html`. El servidor Node (`server.ts`) solo es necesario si se usa SSR en vivo.
- Dependencias externas en tiempo de ejecución (todas desde el navegador, CORS lo resuelven esos servicios): `sasweb.confa.co` (medicamentosWS), `api-facial.confa.co` (API Gateway + Lambda de identificación facial, con `x-api-key`), `appint.confa.co` (consulta de IP), `cdn.jsdelivr.net` (bootstrap-icons).

## Arquitectura

```
src/app/
  app.config.ts            # provideRouter, provideClientHydration, provideHttpClient(withFetch())
  app.config.server.ts     # + provideServerRendering
  app.routes.ts            # '', 'login-interno', 'home', '**' → ''
  app.component.*          # loading global + <app-header> + <router-outlet> + <app-modal-content>
  services/
    authentication.service.ts      # TODAS las llamadas HTTP de negocio (facial + medicamentosWS)
    utilities.service.service.ts   # estado global: loading, modales, sesión (localStorage), inactividad
  components/
    main/            # ruta '' → envuelve <app-welcome>
    welcome/         # login usuario/contraseña + modal de reconocimiento facial
    login-interno/   # lógica de login (facial y usuario/clave); también ruta /login-interno
    camera/          # ngx-webcam, captura la foto y la emite (pictureTaken)
    home/            # TODO el flujo clínico (748 líneas TS + 765 HTML, 5 modales Bootstrap)
    modal-content/ → modal-messages/   # modal de error/éxito global (abierto con jQuery)
    shared/header → navbar             # logo, letrero de pruebas, usuario y "Cerrar sesión"
    shared/loading                     # overlay "Cargando, por favor espera"
    shared/footer                      # no se usa en ninguna plantilla
  interfaces/   # RespuestaValida… (contratos de respuesta), user.interface (heredado del portal)
  models/       # InformacionPaciente (declarado en home, no se usa)
```

Patrones del código (síguelos al modificar, aunque no sean ideales):
- Componentes standalone con `imports` explícitos; servicios `providedIn: 'root'`.
- Las llamadas HTTP devuelven `any` y se procesan con `subscribe(next, error)`; no hay interceptores, guards ni manejo centralizado de errores.
- **Los modales Bootstrap se abren simulando clic con jQuery** sobre botones ocultos: `$('.btn-modal-error').click()`, `.btn-modal-aplicar`, `.btn-modal-ver-aplicaciones`, `.btn-modal-multidosis`, `.btn-modal-medicamentos`, `.btn-modal-inactividad`. El texto del modal de error se fija antes con `utilitiesService.showError(titulo, mensaje)`. Los mensajes de éxito/error rápidos usan `Swal.fire`.
- El spinner global se controla con `utilitiesService.loading = true/false` a mano en cada rama.
- Las respuestas del backend se convierten con `Object.values(response)` y se leen **por índice** (`this.data[0]`, `[9]`, `[14]`…). El orden de las propiedades del JSON es un contrato implícito.
- Código SSR-safe: los accesos a `window`/`localStorage` van protegidos con `isBrowser()` / `isPlatformBrowser`. Con prerender activo, cualquier código nuevo que toque el DOM en constructor/`ngOnInit` debe protegerse igual.

## Flujos y comportamiento

### Rutas
| Ruta | Componente | Notas |
|---|---|---|
| `/` | `MainComponent` → `WelcomeComponent` | Si hay `authToken` en localStorage redirige a `/home` |
| `/login-interno` | `LoginInternoComponent` | Pantalla de cámara suelta; normalmente se usa embebido en el modal de welcome |
| `/home` | `HomeComponent` | **Sin guard.** Si no hay token, cada acción falla con "Token inválido" y hace logout |
| `**` | redirige a `/` | |

### Login
- **Usuario/contraseña** (`welcome` → `LoginInternoComponent.onLogin`): contraseña → `SHA256` (crypto-js, hex) → `encriptarConfa()` (sustituye dígitos: `1→Fb 2→at 4→VI 6→pZ 7→sH 9→Dx 3→Mo 0→rQ`) → `metodo9 {parametro1: usuario, parametro2: hash}`. El backend espera exactamente ese formato; no cambies el algoritmo.
- **Facial** (`camera` → `LoginInternoComponent.validateFace`): imagen base64 → `POST api-facial.confa.co/identificarvalidar` con `x-api-key`, `excepcion` y `tipoValidacion` del environment. Si `est` es true y `doc` trae `"<documento>-…"`, se llama `metodo1 {documento}`.
- Ambos esperan `{estado: 'Activo', token, nombre, usuarioIngreso, respuesta}`. Con `estado == 'Activo'` se guardan en localStorage `authToken`, `nombreUsuario` (nombre visible) y `nombreUsuario2` (usuario que se envía como `usuario_aplica`) y se navega a `/home`.
- **Inactividad**: `UtilitiesServiceService` cierra sesión tras **1 hora** sin eventos (`click`, `mousemove`, `keydown`, `scroll`, `touchstart`), contando también el tiempo con la pestaña oculta. `HomeComponent` escucha `inactivitySubject` y abre `#modalInactividad`.

### Servicios del backend (`authentication.service.ts`, base `environment.identificacionSas`)
Todos con `Authorization: Bearer <authToken>` salvo los de login.

| Método | Verbo | Uso |
|---|---|---|
| `metodo1` | POST | Login por documento (tras facial) |
| `metodo2` | POST | Datos del paciente + medicamentos + insumos + causas de no aplicación (`documento_paciente`) |
| `metodo3` | POST | Planeación de horarios (`numero_admision`, `codigo_sab`) |
| `metodo4` | POST | **Guardar aplicación** de un medicamento (aplica/no aplica, cantidades, causa, `descontar_orden`, `campo_10` Audifarma…) |
| `metodo5` | POST | **Guardar insumo** usado |
| `metodo6` | POST | Historial de aplicaciones de un medicamento |
| `metodo7` | GET | Lista de SAB |
| `metodo8` | POST | Admisiones de un SAB (devuelve el string `'No hay admisiones'` si está vacío) |
| `metodo9` | POST | Login usuario/contraseña |

Validación de respuestas por presencia de claves (`esTokenValido` = tiene `codigoSab`; `esTokenValidoPlaneacion/Aplicaciones` = tiene `listaMedicamentos`; `esTokenInvalido` = tiene `error`). Si no cumplen, se asume token vencido y se cierra sesión.

### Home (`components/home/home.component.ts`)
1. **Buscar paciente**: el input del lector (`(change)`) toma `inputValue.split('-')[0]` como documento → `obtenerDatosPaciente` (`metodo2` y luego `metodo3`). O bien **Cargar SAB** → select → tabla de admisiones → "Ver" (abre `#modalMedicamentos` con la planeación).
2. `llenarDatosPaciente()` mapea por índice la respuesta de `metodo2`: `0` codigoSab, `1` convenio, `2` plan, `3` nomPlan, `4` documento, `6` nombre, `8` cama, `9` admisión, `10` sexo, `11` fecha nac., `12` tipo doc., `13` insumos, `14` medicamentos, `15` causas de no aplicación. Si `nombre` viene vacío: "Esta persona no está en admisión".
3. **Aplicar**: `toggleAplicar` copia campo por campo el medicamento a `selectedMedicamentoModal` y abre `#modalAplicar`. **No aplicar**: elegir causa en el select.
4. `guardarAplicacion()` → reglas de negocio → `generarAplicacion()` (`metodo4`). Respuestas: `estado == 'OK'`, `'ERROR_YA_EXISTE'` u otro (muestra `mensaje`). Tras guardar, recarga el paciente.
5. **Insumos**: botones +/− limitados a `cantidad - cantidadUsado`; guardar → `metodo5`.

## Reglas de negocio

- No aplicar exige causa; la causa **`CM-4`** exige observación.
- `cantidadPorAplicacion` se limita a `cantidadTotal - cantidadAplicado - cantidadNoAplicado`, **excepto prefijo `PTR`** (sin tope superior y mínimo 1).
- El ajuste de cantidad en el modal solo se muestra para ciertas indicaciones especiales (p. ej. "Infusión titulable"); el botón Confirmar se deshabilita con cantidad 0.
- **"Multidosis ampolla"**: si se aplica una cantidad parcial (`0 < aplicado < total`) se abre `#modalMultidosis` para preguntar si se descuenta de la orden (`descontar_orden` true/false). Si `aplicado == total`, se envía `descontarOrden = false`.
- `usuario_aplica` sale de `localStorage.nombreUsuario2`.

## Deuda técnica y riesgos conocidos

- Las URLs, `parametro1/2` y demás claves están duplicadas en los dos environments; si agregas una clave nueva, agrégala en ambos o el build de producción falla.
- **Secretos en el front**: la `x-api-key` de `api-facial.confa.co` está fija en `authentication.service.ts` y `parametro1`/`parametro2` en los environments. Viajan en el bundle público. No los copies a otros archivos, documentación ni logs.
- `navbar.component.html` tiene **dos `<nav>` anidados** y el exterior no se cierra (resultado de merges). El letrero "Ambiente de Pruebas" sale duplicado. El dropdown de usuario se muestra aunque no haya sesión (`nombreUsuario` es `null`, no `''`).
- `HomeComponent` declara `template` **y** `templateUrl`. Angular usa `templateUrl`; el `template` inline ("Esperando...") es código muerto.
- El modal de cámara de `welcome` renderiza `<app-login-interno>` siempre, así que la cámara se solicita al cargar `/`. Además, al pulsar "Ingresar" se crea **otra** instancia de `LoginInternoComponent` (`*ngIf="inicioSesion"`) solo para llamar `onLogin`.
- En `validateFace`, el callback de error deja `loading = true` (el spinner no se apaga); `inicioSesionSas` y `onLogin` no tienen callback de error.
- Código heredado del portal transaccional sin uso: `getGenericToken`, `getData`, `loadTokens` (nunca se invoca, así que `genericTokenValue`/`currentTokenValue` fallarían), `apiIngresoConfa`, `identificacionFacial`, `user.interface.ts`, `footer`, `InformacionPaciente`, `myIP` (se consulta la IP y no se usa), `openTab`/`closeTab`/`xorEncryptDecrypt`, y los métodos stub de `modal-messages` (`guardarAplicacion` solo hace `console.log`). En `welcome.component.html` hay un `<script>` inline que Angular ignora.
- `respuestaValida.interface.ts` declara `RespuestaValida` dos veces (declaration merging).
- **Tests**: los `*.spec.ts` son los generados por el CLI y no compilan (`global` en `camera.component.ts`). No hay e2e.
- Budgets: el CSS de `home` está a ~0.8 kB del límite de error (4 kB). Si lo haces crecer, el build fallará.

## Antes de modificar algo, ten en cuenta

- Es una app **clínica en producción**: un cambio en `authentication.service.ts`, en el mapeo por índice de `home` o en `environment.ts` cambia qué se registra en la historia de aplicación de medicamentos. Confirma con el usuario el ambiente al que apuntará el build.
- No cambies el hash de contraseña (`SHA256` + `encriptarConfa`) ni los nombres de campos del body de `metodo4`/`metodo5`: son el contrato con `medicamentosWS`.
- Mantén el patrón existente (jQuery para modales, `utilitiesService.loading`, `showError`) salvo que el usuario pida refactorizar.
- Todo código que use `window`, `document`, `localStorage` o `navigator` debe ser seguro para SSR/prerender.
- Valida con `npm run build` (el test runner no sirve hoy). Revisa que no aparezcan errores de budget.
- La rama de trabajo del equipo es `devCarol`; los cambios llegan a `master` por PR en GitHub.
