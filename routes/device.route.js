const device = require('../controllers/device.controller');

/*
Listowanie wszystkich urządzeń
  -listowanie serii pomiarów dla danego urządzenia (nie wiem czy konieczne)
    -czyli można sobie sprawdzić historie i w ogóle
  -listowanie ostatniego/akutalnego pomiaru <- zaznaczenie, czy 'done' czy nie
    -akutalne dane, trzeba znaleźć coś w stylu 'latest date pyaload' per device
-Modyfikowanie miejsca urządzenia np. bed B5
*/

/*
Broker wysyła nodeowi pierwszy payload
Payload zawiera device_id oraz payload z sensora
Sprawdzamy, czy w ogóle taki device istnieje w bazie (FUNCTION)
Jeśli istnieje
{
  Jeśli to nowa seria (jak sprawdzić czy jest nowa??) {
    Sprawdz jakie jest ID ostatniej serii i stwórz nowe ID dla tego
    Wszystkie nowe payloady dodawaj z dopiskiem tego ID, które zostanie przypisane do danego device
    W sumie ID serii powinno być w osobnej bazie, która spina Device z ID serii
  }
}
*/

/*
  Devices:
    name(id): String,
    location: String <- editable np. Bed B-5

  Seria x Device (name: xxx):
    Series_ID: String, <-klucz główny
    Device_ID: String <-klucz obcy
    InitialTime: Date <-Przy tworzeniu daj init date

  Payload:
    sowjejakiestamID: XD
    Payload: Number,
    Series_ID: String <-klucz obcy
    Timestamp <-chyba są defaultowo

  Devices:
    -1
    -2
    -3

  Device ID = 1
    Series:
      (historic data - not really usable)
      1_1 <- fajnie jakby tytuł danej serii to była lokacja urządzenia
      1_2
      1_3

  Seria 1_1
    -Co to za device - 'Seria x Device'
    -Device location (z Kolekcji Devices) - 'Seria x Device' -> Device_ID -> Location from 'Devices'
    -Cały payload, który matchuje query - Series_ID
    -Zakres czasu first timestamp - last timestamp


*/

module.exports = (app) => {
  // Dodanie nowego urządzenia <- najlepiej po ID
  app.post('/devices', device.create); // ????

  // Listowanie wszystkich urządzeń
  app.get('/devices, device.findAll');

  // Updatowanie nazwy urządzenia/lokacji
  app.put('/devices/:deviceID', device.update); // TO DO

  // Listowanie wszystkich serii danego urządzenia
  app.get('/devices/:deviceID', device.findOne);

  // Usuwanie urządzenia ? (razem z seriami!!)
  app.delete('/users/:userId', device.delete);
};
