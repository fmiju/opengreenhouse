# API

## Formatas

Jei ok, grąžina HTTP 200 ir JSON:

    {"ok": true, "value": ...}

Jei klaida, grąžina HTTP klaidą ir JSON:

    {"ok": false, "error": "priežastis"}

URL formatas:

    /rpc/sensor/?name=temp&start=1&end=10&resolution=1

## Procedūros

Sensorių sąrašas:

    sensor_list()

Gauti sensoriaus parodymų intervale [start,end]:

    sensor(name, start, end=now(), resolution=1)

Atidaryti ir uždaryti langą ir duris (`open` – `true` arba `false`):

    set_window(open)

    set_door(open)

Įjungti ir išjungti pompą (`open` – `true` arba `false`):

    set_pump(on)
