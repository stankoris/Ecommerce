# Naziv projekta

Full-stack e-commerce web aplikacija za online kupovinu proizvoda sa korisničkim i admin delom.

## Korišćene tehnologije

- Backend: Spring Boot (Java)
- Frontend: HTML, CSS, JavaScript
- Baza podataka: MySQL

## Funkcionalnosti

- Registracija i prijava korisnika
- Pregled liste proizvoda
- Detaljan prikaz proizvoda
- Dodavanje proizvoda u korpu
- Kreiranje porudžbine
- Admin deo za upravljanje proizvodima / kategorijama
- Filtritanje proizvoda po kategoriji
- Pretraga proizvoda po imenu

Projekat sadrži SQL skripte koje omogućavaju jednostavno kreiranje i inicijalizaciju baze podataka.

## Ecommerce_database_scheme.sql – skripta koja sadrži strukturu baze podataka i koristi se za kreiranje svih potrebnih tabela.

## Ecommerce_data.sql – skripta koja sadrži inicijalne test podatke koji se mogu koristiti za demonstraciju funkcionalnosti aplikacije.

U okviru test podataka definisana su dva korisnička naloga:

 ## Admin nalog
Email: admin@ecommerce.com
Password: admin123

 ## Korisnički nalog
Email: testuser@gmail.com
Password: test123
## 
Podaci za prijavu su takođe prikazani ispod login forme u aplikaciji radi lakšeg testiranja.
Korisnici se mogu registrovati putem registracione forme, pri čemu je moguće kreirati samo standardni korisnički nalog, dok se administratorski nalog ne može registrovati putem aplikacije.
##
Aplikacija omogućava pregled i kupovinu proizvoda putem jednostavnog e-commerce sistema.

Na početnoj stranici prikazuje se lista svih dostupnih proizvoda. Korisnici imaju mogućnost:

filtriranja proizvoda po kategoriji

pretrage proizvoda po nazivu

Klikom na karticu proizvoda otvara se stranica sa detaljnim prikazom proizvoda koja sadrži dodatne informacije o proizvodu. Na dnu stranice prikazuju se i slični proizvodi, koji se određuju na osnovu iste kategorije.

Korisnik može dodavati proizvode u korpu i pregledati sadržaj korpe u bilo kom trenutku.
Ukoliko korisnik pokuša da nastavi sa kupovinom bez prethodne prijave, aplikacija će prikazati odgovarajuću poruku i preusmeriti korisnika na stranicu za prijavu.
##
Nakon prijave sa administratorskim nalogom, omogućene su dodatne funkcionalnosti za upravljanje sistemom.

Administrator može:

- dodavati nove proizvode
- menjati postojeće proizvode
- brisati proizvode
- upravljati kategorijama (dodavanje, izmena i brisanje)

U sekciji za upravljanje porudžbinama administrator ima mogućnost da menja status porudžbine, kao što su Processing, Delivered, Cancelled...
##
Kada se korisnik prijavi na svoj nalog, može nastaviti sa procesom kupovine proizvoda koji se nalaze u korpi. Nakon potvrde porudžbine izvršava se simulacija procesa naplate, čime se završava proces kupovine u okviru aplikacije.
