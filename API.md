# API

Jei ok, grąžina HTTP 200 ir JSON:

    {"ok": true, "value": ...}

Jei klaida, grąžina HTTP klaidą ir JSON:

    {"ok": false, "error": "priežastis"}

URL formatas:

    /rpc/sensor/?name=temp&start=1&end=10&resolution=1

RPC procedūrų sąrašas:

    def sensor\_list():
    def sensor(name, start, end, resolution=1):
