# Anotace 

Projekt "Shared Mobility Web App" je webová aplikace pro sdílenou mobilitu, která propojuje řidiče a cestující podobně jako služby typu Uber nebo Bolt. Aplikace je vyvinuta pomocí moderních technologií včetně Next.js, React, Tailwind CSS a SQLite s ORM Prisma.

## Hlavní funkce aplikace zahrnují:

- **Systém uživatelských rolí** – Aplikace rozlišuje mezi dvěma typy uživatelů (řidiči a cestující) s odlišnými oprávněními a rozhraními.
- **Správa vozidel pro řidiče** – Řidiči mohou vytvářet, upravovat a mazat záznamy o svých vozidlech včetně nahrávání fotografií.
- **Správa jízd pro cestující** – Cestující mohou vyhledávat dostupná vozidla, vytvářet žádosti o jízdu a sledovat historii svých jízd.
- **Správa jízd pro řidiče** – Řidiči mohou přijímat nebo odmítat žádosti o jízdu, aktualizovat stav jízdy a sledovat historii svých jízd.
- **Hodnocení jízd** – Cestující mohou hodnotit dokončené jízdy a zanechat zpětnou vazbu řidičům.
- **Ukládání oblíbených tras** – Aplikace umožňuje ukládat oblíbené trasy pomocí localStorage pro rychlejší zadávání nových jízd.

Aplikace implementuje zabezpečenou autentizaci pomocí NextAuth.js, validaci formulářů pomocí React Hook Form a Zod, a využívá moderní přístup k vývoji webových aplikací s oddělením klientských a serverových komponent.


## A. Uživatelská dokumentace

### Návod k používání aplikace Shared Mobility

#### Přihlášení a registrace

##### Registrace nového účtu
1. Na úvodní stránce klikněte na tlačítko "Registrovat"
2. Vyplňte požadované údaje (jméno, email, heslo)
3. Vyberte roli: Cestující (Passenger) nebo Řidič (Driver)
4. Dokončete registraci kliknutím na tlačítko "Registrovat"

##### Přihlášení
1. Na úvodní stránce klikněte na tlačítko "Přihlásit"
2. Zadejte email a heslo
3. Klikněte na tlačítko "Přihlásit"
#### Pro cestující (Passenger)

##### Žádost o jízdu
1. Po přihlášení se dostanete na dashboard
2. Klikněte na "Požádat o jízdu" v navigačním menu nebo na dashboardu
3. Vyplňte formulář žádosti o jízdu:
   - Vyberte vozidlo ze seznamu dostupných vozidel
   - Zadejte místo vyzvednutí (pickup location)
   - Zadejte cílovou destinaci (dropoff location)
   - Vyberte datum a čas vyzvednutí
   - Volitelně můžete přidat poznámku pro řidiče
4. Klikněte na tlačítko "Požádat o jízdu"
5. Systém vás přesměruje na stránku "Moje jízdy", kde uvidíte svou novou žádost

##### Ukládání oblíbených tras
1. Při vyplňování formuláře žádosti o jízdu můžete kliknout na "Uložit jako oblíbené"
2. Zadejte název pro uloženou trasu (např. "Domů do práce")
3. Při příští žádosti o jízdu můžete kliknout na "Načíst uloženou jízdu" a vybrat z vašich uložených tras

##### Správa jízd
1. Klikněte na "Moje jízdy" v navigačním menu
2. Zde uvidíte tři záložky:
   - **Vyžádané jízdy** - jízdy, které čekají na přijetí nebo byly přijaty řidičem
   - **Aktivní jízdy** - jízdy, které právě probíhají
   - **Historie jízd** - dokončené, zrušené nebo odmítnuté jízdy

3. **Zrušení jízdy**:
   - U vyžádaných jízd můžete kliknout na "Zrušit žádost"
   - Potvrďte zrušení v dialogovém okně

4. **Hodnocení jízdy**:
   - U dokončených jízd klikněte na "Zanechat hodnocení"
   - Ohodnoťte jízdu 1-5 hvězdičkami
   - Volitelně můžete přidat komentář
   - Klikněte na "Odeslat hodnocení"
#### Pro řidiče (Driver)

##### Správa vozidel
1. Po přihlášení klikněte na "Moje vozidla" v navigačním menu
2. Zde můžete:
   - Přidat nové vozidlo kliknutím na "Přidat vozidlo"
   - Upravit existující vozidlo kliknutím na "Upravit"
   - Odstranit vozidlo kliknutím na "Odstranit"
   - Zobrazit detail vozidla kliknutím na kartu vozidla

3. **Přidání nového vozidla**:
   - Vyplňte údaje o vozidle (značka, model, rok výroby, SPZ, kapacita, typ vozidla)
   - Nahrajte fotografii vozidla
   - Klikněte na "Přidat vozidlo"

##### Správa jízd
1. Klikněte na "Správa jízd" v navigačním menu
2. Zde uvidíte tři záložky:
   - **Příchozí žádosti** - žádosti o jízdu, které čekají na vaše přijetí nebo odmítnutí
   - **Aktivní jízdy** - jízdy, které jste přijali nebo právě probíhají
   - **Historie jízd** - dokončené, zrušené nebo odmítnuté jízdy

3. **Přijetí/odmítnutí žádosti**:
   - U příchozí žádosti klikněte na "Zobrazit detail"
   - Na stránce detailu klikněte na "Přijmout" nebo "Odmítnout"
   - V případě odmítnutí můžete zadat důvod

4. **Aktualizace stavu jízdy**:
   - U přijaté jízdy klikněte na "Zahájit jízdu", když vyzvednete cestujícího
   - U probíhající jízdy klikněte na "Dokončit jízdu", když dorazíte do cíle
#### Obecné funkce

##### Dashboard
- Po přihlášení se zobrazí dashboard s přehledem vašich aktivit
- Dashboard se liší podle role (cestující/řidič)
- Zobrazuje rychlé odkazy na nejčastější akce a přehled nedávných aktivit

##### Profil
- Kliknutím na vaše jméno v pravém horním rohu se zobrazí nabídka
- Zvolte "Odhlásit" pro odhlášení ze systému

##### Stránkování
- Seznamy jízd a vozidel jsou stránkované
- Pro navigaci mezi stránkami použijte číslované odkazy ve spodní části seznamu

##### Vyhledávání a filtrace
- Na stránkách se seznamy můžete použít vyhledávací pole pro filtrování obsahu
- Můžete také použít filtry pro zobrazení specifických typů záznamů
#### Testovací účty
Pro testování aplikace můžete použít následující přihlašovací údaje:

**Cestující:**
- Email: passenger@example.com
- Heslo: password123

**Řidič:**
- Email: driver@example.com
- Heslo: password123

---

## B. Dokumentace architektury

### Architektonické principy a implementace
Aplikace Shared Mobility je postavena na moderní webové architektuře využívající Next.js framework s App Router. Implementace sleduje několik klíčových architektonických principů:

#### Vrstvená architektura
Aplikace je strukturována do několika vrstev:

1. **Prezentační vrstva** - React komponenty a stránky
2. **Aplikační vrstva** - API routy a business logika
3. **Datová vrstva** - Prisma ORM a SQLite databáze

Toto rozdělení zajišťuje oddělení zodpovědností a usnadňuje údržbu a rozšiřování aplikace.

#### Serverové a klientské komponenty
Next.js App Router umožňuje kombinovat:

- **Serverové komponenty** - Optimalizované pro načítání dat a renderování statického obsahu
- **Klientské komponenty** - Používané pro interaktivní prvky vyžadující JavaScript na straně klienta

Tato hybridní architektura poskytuje optimální rovnováhu mezi výkonem a interaktivitou.

#### Datový model
Jádrem aplikace je relační datový model implementovaný pomocí Prisma ORM:

- **User** - Reprezentuje uživatele s rolí (PASSENGER/DRIVER)
- **Vehicle** - Vozidla patřící řidičům
- **Ride** - Jízdy propojující cestující, řidiče a vozidla
- **Review** - Hodnocení jízd od cestujících

Vztahy mezi entitami jsou definovány pomocí cizích klíčů a relací v Prisma schématu.

#### Stavový automat pro jízdy
Jízdy v systému procházejí různými stavy podle definovaného stavového automatu:

- **REQUESTED** - Počáteční stav po vytvoření žádosti o jízdu
- **ACCEPTED** - Stav po přijetí žádosti řidičem
- **STARTED** - Stav po zahájení jízdy řidičem
- **COMPLETED** - Stav po dokončení jízdy
- **CANCELED** - Stav po zrušení jízdy cestujícím
- **REJECTED** - Stav po odmítnutí žádosti řidičem

Přechody mezi stavy jsou řízeny business logikou v API routách a validovány proti neoprávněným změnám.

#### Autentizace a autorizace
Systém využívá NextAuth.js pro správu autentizace:

- **JWT tokeny** pro udržování session
- **Role-based access control** pro řízení přístupu k funkcím
- **Middleware** pro ochranu routů a API endpointů

#### Perzistence dat
Aplikace využívá několik úrovní perzistence:

- **SQLite databáze** pro hlavní datové úložiště
- **localStorage** pro ukládání uživatelských preferencí na straně klienta
- **Session storage** pro dočasné ukládání autentizačních informací
### Implementační detaily

#### Frontend implementace
Frontend je implementován pomocí:

- **React** pro komponentovou architekturu
- **Tailwind CSS** pro styling
- **shadcn/ui** pro konzistentní design systém
- **React Hook Form** pro správu formulářů
- **Zod** pro validaci dat

Stránky jsou organizovány podle App Router konvencí s využitím vnořených layoutů a dynamických segmentů.

#### Backend implementace
Backend je postaven na:

- **Next.js API Routes** pro serverovou logiku
- **Prisma ORM** pro interakci s databází
- **NextAuth.js** pro autentizaci
- **Zod** pro validaci vstupních dat

API routy jsou organizovány podle RESTful principů s jasně definovanými endpointy pro každý typ zdroje.

#### Optimalizace výkonu
Aplikace implementuje několik optimalizací výkonu:

* **Statické generování** pro stránky, které nevyžadují dynamická data
* **Inkrementální statická regenerace** pro stránky s pomalou změnou dat
* **Lazy loading** pro komponenty a obrázky
* **Pagination** pro efektivní načítání velkých seznamů dat

#### Zabezpečení
Bezpečnostní opatření zahrnují:

* **Input validaci** na klientské i serverové straně
* **Sanitizaci dat** před uložením do databáze
* **Autorizační kontroly** pro všechny operace s daty
* **CSRF ochranu** pomocí NextAuth.js

#### Datový tok
Typický datový tok v aplikaci:

1. Uživatel interaguje s UI komponentou (např. formulář pro žádost o jízdu)
2. Klientská komponenta validuje vstup a odesílá požadavek na API endpoint
3. API endpoint ověřuje autentizaci a autorizaci uživatele
4. Serverová logika validuje data a provádí business operace
5. Prisma ORM překládá operace na SQL dotazy a komunikuje s databází
6. Výsledek je vrácen zpět klientovi
7. UI se aktualizuje na základě odpovědi

Tento tok zajišťuje konzistentní zpracování dat a odděluje prezentační logiku od business logiky a datové vrstvy.






## C. Dokumentace API

### Koncové body aplikace a jejich obsluha

Aplikace Shared Mobility poskytuje RESTful API pro interakci s databází a implementaci business logiky. Níže jsou popsány hlavní API endpointy rozdělené podle domén.

### API Endpointy

#### Autentizace (/api/auth/*)
Tyto endpointy jsou spravovány knihovnou NextAuth.js a zajišťují autentizaci uživatelů.

Endpoint: /api/auth/signin
Metoda: GET/POST
Popis: Přihlášení uživatele
Parametry: email, password
Odpověď: JWT token, user data

Endpoint: /api/auth/signup
Metoda: POST
Popis: Registrace nového uživatele
Parametry: name, email, password, role
Odpověď: User data

Endpoint: /api/auth/signout
Metoda: GET/POST
Popis: Odhlášení uživatele
Parametry: -
Odpověď: Potvrzení odhlášení

Endpoint: /api/auth/session
Metoda: GET
Popis: Získání informací o aktuální session
Parametry: -
Odpověď: Session data

Správa vozidel (/api/vehicles/*)
Tyto endpointy slouží ke správě vozidel v systému.

Endpoint: /api/vehicles
Metoda: GET
Popis: Získání seznamu vozidel
Parametry: available (boolean), page, limit
Odpověď: Seznam vozidel

Endpoint: /api/vehicles
Metoda: POST
Popis: Vytvoření nového vozidla
Parametry: make, model, year, licensePlate, capacity, vehicleType, available, image
Odpověď: Vytvořené vozidlo

Endpoint: /api/vehicles/:id
Metoda: GET
Popis: Získání detailu vozidla
Parametry: -
Odpověď: Detail vozidla

Endpoint: /api/vehicles/:id
Metoda: PATCH
Popis: Aktualizace vozidla
Parametry: make, model, year, licensePlate, capacity, vehicleType, available, image
Odpověď: Aktualizované vozidlo

Endpoint: /api/vehicles/:id
Metoda: DELETE
Popis: Smazání vozidla
Parametry: -
Odpověď: Potvrzení smazání

Endpoint: /api/vehicles/:id/availability
Metoda: PATCH
Popis: Změna dostupnosti vozidla
Parametry: available (boolean)
Odpověď: Aktualizované vozidlo

Správa jízd (/api/rides/*)
Tyto endpointy slouží ke správě jízd v systému.

Endpoint: /api/rides
Metoda: GET
Popis: Získání seznamu jízd
Parametry: status, userId, vehicleId, page, limit
Odpověď: Seznam jízd

Endpoint: /api/rides
Metoda: POST
Popis: Vytvoření nové žádosti o jízdu
Parametry: vehicleId, pickupLocation, dropoffLocation, pickupTime, notes, price
Odpověď: Vytvořená jízda

Endpoint: /api/rides/:id
Metoda: GET
Popis: Získání detailu jízdy
Parametry: -
Odpověď: Detail jízdy

Endpoint: /api/rides/:id
Metoda: PATCH
Popis: Aktualizace jízdy
Parametry: pickupLocation, dropoffLocation, pickupTime, notes
Odpověď: Aktualizovaná jízda

Endpoint: /api/rides/:id/status
Metoda: PATCH
Popis: Změna statusu jízdy
Parametry: status, reason
Odpověď: Aktualizovaná jízda

Endpoint: /api/rides/user/:userId
Metoda: GET
Popis: Získání jízd uživatele
Parametry: status, page, limit
Odpověď: Seznam jízd uživatele

Endpoint: /api/rides/vehicle/:vehicleId
Metoda: GET
Popis: Získání jízd pro vozidlo
Parametry: status, page, limit
Odpověď: Seznam jízd vozidla

Hodnocení (/api/reviews/*)
Tyto endpointy slouží ke správě hodnocení jízd.

Endpoint: /api/reviews
Metoda: POST
Popis: Vytvoření nového hodnocení
Parametry: rideId, driverId, rating, comment
Odpověď: Vytvořené hodnocení

Endpoint: /api/reviews/user/:userId
Metoda: GET
Popis: Získání hodnocení uživatele
Parametry: page, limit
Odpověď: Seznam hodnocení uživatele

Endpoint: /api/reviews/ride/:rideId
Metoda: GET
Popis: Získání hodnocení jízdy
Parametry: -
Odpověď: Hodnocení jízdy


Implementace API endpointů
Příklad implementace POST /api/rides

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Pouze cestující mohou vytvářet žádosti o jízdu
    if (session.user.role !== "PASSENGER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Parsování a validace požadavku
    const body = await request.json();
    const validationResult = rideRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Ověření existence uživatele v databázi
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Ověření existence a dostupnosti vozidla
    const vehicle = await db.vehicle.findUnique({
      where: {
        id: validationResult.data.vehicleId,
        available: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found or not available" },
        { status: 404 }
      );
    }

    // Vytvoření jízdy v databázi
    const ride = await db.ride.create({
      data: {
        userId: session.user.id,
        vehicleId: validationResult.data.vehicleId,
        pickupLocation: validationResult.data.pickupLocation,
        dropoffLocation: validationResult.data.dropoffLocation,
        pickupTime: new Date(validationResult.data.pickupTime),
        notes: validationResult.data.notes || "",
        status: "REQUESTED",
        price: validationResult.data.price || 0,
      },
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error("Error creating ride request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
Příklad implementace PATCH /api/rides/:id/status

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parsování a validace požadavku
    const body = await request.json();
    const validationResult = statusUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Získání jízdy z databáze
    const ride = await db.ride.findUnique({
      where: { id: params.id },
      include: { vehicle: true },
    });

    if (!ride) {
      return NextResponse.json(
        { message: "Ride not found" },
        { status: 404 }
      );
    }

    // Kontrola oprávnění ke změně statusu
    const isDriver = session.user.role === "DRIVER" && ride.vehicle.userId === session.user.id;
    const isPassenger = session.user.role === "PASSENGER" && ride.userId === session.user.id;

    if (!isDriver && !isPassenger) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Validace přechodu stavu
    const isValidTransition = validateStatusTransition(
      ride.status,
      validationResult.data.status,
      session.user.role
    );

    if (!isValidTransition) {
      return NextResponse.json(
        { message: "Invalid status transition" },
        { status: 400 }
      );
    }

    // Aktualizace statusu jízdy
    const updatedRide = await db.ride.update({
      where: { id: params.id },
      data: {
        status: validationResult.data.status,
        statusReason: validationResult.data.reason || null,
      },
    });

    return NextResponse.json(updatedRide);
  } catch (error) {
    console.error("Error updating ride status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
Zabezpečení API
API endpointy jsou zabezpečeny několika způsoby:

Autentizace - Všechny chráněné endpointy vyžadují platnou session, která je ověřována pomocí NextAuth.js.
Autorizace - Endpointy kontrolují roli uživatele a jeho oprávnění k požadované operaci.
Validace vstupů - Všechny vstupní data jsou validována pomocí Zod schémat před zpracováním.
Ošetření chyb - API endpointy obsahují kompletní ošetření chyb a vracejí standardizované chybové odpovědi.
CORS - API je chráněno proti Cross-Origin Resource Sharing útokům pomocí Next.js CORS middleware.
Formát odpovědí
API odpovědi mají konzistentní formát:

Úspěšné odpovědi - Vrací data ve formátu JSON s příslušným HTTP status kódem (200, 201, 204).
Chybové odpovědi - Vrací objekt s message a volitelně errors ve formátu JSON s příslušným HTTP status kódem (400, 401, 403, 404, 500).
Příklad úspěšné odpovědi:

{
  "id": "123",
  "userId": "456",
  "vehicleId": "789",
  "pickupLocation": "Praha, Václavské náměstí",
  "dropoffLocation": "Praha, Letiště Václava Havla",
  "pickupTime": "2025-04-24T10:00:00.000Z",
  "status": "REQUESTED",
  "price": 350,
  "createdAt": "2025-04-23T15:30:00.000Z",
  "updatedAt": "2025-04-23T15:30:00.000Z"
}
Příklad chybové odpovědi:

{
  "message": "Invalid data",
  "errors": {
    "pickupTime": ["Pickup time must be a valid future date"]
  }
}





Dokumentace databáze
Model jednotlivých zdrojů a vztahy mezi nimi
Databáze aplikace Shared Mobility je implementována pomocí SQLite a ORM Prisma. Níže je popsán datový model s jednotlivými entitami a jejich vztahy.

User (Uživatel)
Entita User reprezentuje uživatele aplikace, který může být buď cestující nebo řidič.

Atributy:

id (String): Primární klíč, UUID
name (String): Jméno uživatele
email (String): Email uživatele, unikátní
password (String): Hashované heslo
role (Enum): Role uživatele (PASSENGER, DRIVER)
createdAt (DateTime): Datum a čas vytvoření záznamu
updatedAt (DateTime): Datum a čas poslední aktualizace záznamu
Vztahy:

vehicles (1:N): Uživatel s rolí DRIVER může vlastnit více vozidel
rides (1:N): Uživatel s rolí PASSENGER může mít více jízd
reviews (1:N): Uživatel s rolí PASSENGER může zanechat více hodnocení
receivedReviews (1:N): Uživatel s rolí DRIVER může obdržet více hodnocení
Vehicle (Vozidlo)
Entita Vehicle reprezentuje vozidlo, které může být použito pro jízdy.

Atributy:

id (String): Primární klíč, UUID
userId (String): Cizí klíč odkazující na vlastníka vozidla (řidiče)
make (String): Značka vozidla
model (String): Model vozidla
year (Int): Rok výroby
licensePlate (String): Registrační značka vozidla
capacity (Int): Kapacita vozidla (počet cestujících)
vehicleType (Enum): Typ vozidla (STANDARD, LUXURY)
available (Boolean): Dostupnost vozidla
image (String?): URL obrázku vozidla (nepovinné)
createdAt (DateTime): Datum a čas vytvoření záznamu
updatedAt (DateTime): Datum a čas poslední aktualizace záznamu
Vztahy:

user (N:1): Vozidlo patří jednomu uživateli (řidiči)
rides (1:N): Vozidlo může být použito pro více jízd
Ride (Jízda)
Entita Ride reprezentuje jízdu mezi cestujícím a řidičem.

Atributy:

id (String): Primární klíč, UUID
userId (String): Cizí klíč odkazující na cestujícího
vehicleId (String): Cizí klíč odkazující na vozidlo
pickupLocation (String): Místo vyzvednutí
dropoffLocation (String): Místo vysazení
pickupTime (DateTime): Datum a čas vyzvednutí
status (Enum): Status jízdy (REQUESTED, ACCEPTED, STARTED, COMPLETED, CANCELED, REJECTED)
statusReason (String?): Důvod změny statusu (nepovinné)
notes (String?): Poznámky k jízdě (nepovinné)
price (Float): Cena jízdy
createdAt (DateTime): Datum a čas vytvoření záznamu
updatedAt (DateTime): Datum a čas poslední aktualizace záznamu
Vztahy:

user (N:1): Jízda patří jednomu uživateli (cestujícímu)
vehicle (N:1): Jízda je realizována jedním vozidlem
reviews (1:N): Jízda může mít více hodnocení (typicky jedno)
Review (Hodnocení)
Entita Review reprezentuje hodnocení jízdy od cestujícího.

Atributy:

id (String): Primární klíč, UUID
rideId (String): Cizí klíč odkazující na hodnocenou jízdu
userId (String): Cizí klíč odkazující na uživatele, který zanechal hodnocení (cestující)
driverId (String): Cizí klíč odkazující na hodnoceného řidiče
rating (Int): Hodnocení (1-5 hvězdiček)
comment (String?): Komentář k hodnocení (nepovinné)
createdAt (DateTime): Datum a čas vytvoření záznamu
updatedAt (DateTime): Datum a čas poslední aktualizace záznamu
Vztahy:

ride (N:1): Hodnocení patří k jedné jízdě
user (N:1): Hodnocení bylo vytvořeno jedním uživatelem (cestujícím)
driver (N:1): Hodnocení je určeno jednomu řidiči
Schéma databáze v Prisma formátu

// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum UserRole {
  PASSENGER
  DRIVER
}

enum VehicleType {
  STANDARD
  LUXURY
}

enum RideStatus {
  REQUESTED
  ACCEPTED
  STARTED
  COMPLETED
  CANCELED
  REJECTED
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      UserRole
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  vehicles        Vehicle[] @relation("UserVehicles")
  rides           Ride[]    @relation("UserRides")
  reviews         Review[]  @relation("UserReviews")
  receivedReviews Review[]  @relation("DriverReviews")
}

model Vehicle {
  id           String      @id @default(uuid())
  userId       String
  make         String
  model        String
  year         Int
  licensePlate String      @unique
  capacity     Int
  vehicleType  VehicleType
  available    Boolean     @default(true)
  image        String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relationships
  user  User   @relation("UserVehicles", fields: [userId], references: [id], onDelete: Cascade)
  rides Ride[] @relation("VehicleRides")
}

model Ride {
  id              String     @id @default(uuid())
  userId          String
  vehicleId       String
  pickupLocation  String
  dropoffLocation String
  pickupTime      DateTime
  status          RideStatus @default(REQUESTED)
  statusReason    String?
  notes           String?
  price           Float
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  // Relationships
  user    User     @relation("UserRides", fields: [userId], references: [id], onDelete: Cascade)
  vehicle Vehicle  @relation("VehicleRides", fields: [vehicleId], references: [id], onDelete: Cascade)
  reviews Review[] @relation("RideReviews")
}

model Review {
  id        String   @id @default(uuid())
  rideId    String
  userId    String
  driverId  String
  rating    Int
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  ride   Ride @relation("RideReviews", fields: [rideId], references: [id], onDelete: Cascade)
  user   User @relation("UserReviews", fields: [userId], references: [id], onDelete: Cascade)
  driver User @relation("DriverReviews", fields: [driverId], references: [id], onDelete: Cascade)
}
Vztahy mezi entitami
User - Vehicle (1:N)
Jeden uživatel s rolí DRIVER může vlastnit více vozidel
Každé vozidlo patří právě jednomu uživateli (řidiči)
User - Ride (1:N)
Jeden uživatel s rolí PASSENGER může mít více jízd
Každá jízda patří právě jednomu uživateli (cestujícímu)
Vehicle - Ride (1:N)
Jedno vozidlo může být použito pro více jízd
Každá jízda je realizována právě jedním vozidlem
User - Review (1:N)
Jeden uživatel s rolí PASSENGER může zanechat více hodnocení
Každé hodnocení bylo vytvořeno právě jedním uživatelem (cestujícím)
User - Review (1:N) - jako řidič
Jeden uživatel s rolí DRIVER může obdržet více hodnocení
Každé hodnocení je určeno právě jednomu řidiči
Ride - Review (1:N)
Jedna jízda může mít více hodnocení (typicky jedno)
Každé hodnocení patří právě k jedné jízdě
Integritní omezení
Kaskádové mazání
Při smazání uživatele jsou smazána všechna jeho vozidla, jízdy a hodnocení
Při smazání vozidla jsou smazány všechny jeho jízdy
Při smazání jízdy jsou smazána všechna její hodnocení
Unikátní omezení
Email uživatele musí být unikátní
Registrační značka vozidla musí být unikátní
Validační omezení
Hodnocení musí být v rozsahu 1-5
Kapacita vozidla musí být kladné číslo
Rok výroby vozidla musí být validní rok
Stavové přechody
Status jízdy může přecházet pouze mezi povolenými stavy
Například jízda ve stavu COMPLETED nemůže přejít do stavu REQUESTED
Tato databázová struktura zajišťuje integritu dat a podporuje všechny požadované funkce aplikace Shared Mobility.
