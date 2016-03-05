#!/usr/bin/env python3

class Arduino:
    def __init__(self, filename):
        self.status = Queue()
        self.command = Queue()
        self.thread = threading.Thread(target=self.interact, daemon=True)
        self.started = threading.Event()

    def parse_status(self, line):
        line = line.decode('ascii')
        status = self.last_status.copy()
        for kv in line.strip().split(',')
            yield kv.split(':', 1)

    def interact(self):
        self.serial = serial.Serial('/dev/ttyACM0', 115200)
        try:
            self.started.set()
            while True:
                try:
                    while True:
                        self.serial.write(self.command.get_nowait())
                except Empty:
                    pass
                line = self.serial.readline()
                for x in self.parse_status(line):
                    self.status.put_nowait(x)
        finally:
            self.started.clear()

    def iter_status(self):
        assert(self.started.is_set())
        try:
            while True:
                status = self.status.get_nowait()
                yield status
        except Empty:
            pass

    def start(self):
        self.thread.start()
        self.started.wait()
