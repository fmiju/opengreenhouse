# API

## Formatas

Jei ok, grąžina HTTP 200 ir JSON:

    {"ok": true, "value": ...}

Jei klaida, grąžina HTTP klaidą ir JSON:

    {"ok": false, "error": "priežastis"}

## Procedūros

Grąžina dabartinę parametro _<name>_ reikšmę:

    GET /rpc/<name>/

Nustato naują reikšmę:

    PUT /rpc/<name>/?value=<value>

Parametro kitimas laike:

    GET /rpc/series/<name>/?start=<ts>&end=<ts>&resolution=<s>

_<ts>_ – UNIX timestampai. _resolution_ nurodyti nebūtina (default: 1).


## Parametrai

### Skaitymui

* _temp_ – oro temperatūra, laipsniais C.
* _humidity_ – dirvos drėgnumas, abstrakčiais vienetais.
* _wind_ – vėjo greitis, enkoderio tikais per sekundę (600 per apsisukimą)

### Rašymui ir skaitymui

* _window_ – lango pozicija, steperio žingsniais
* _pump_ – kiek laiko liko laistyti (kai rašoma, nustato tą laiką ir įjungia
  pompą)
