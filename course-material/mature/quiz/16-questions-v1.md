# 16 Microlearning Questions

>**Corpus:** 16 Questions   
>**Format:** Single Choice  
>**Mastery Threshold:** 3 out of 4 correct (75%)

## Removed Questions from 20-item  Corpus

- **ID:** `a4` · **Timestamp:** 202 s (03:22)
- **ID:** `b4` · **Timestamp:** 205 s (03:25)
- **ID:** `c1` · **Timestamp:** 265 s (04:25)
- **ID:** `d4` · **Timestamp:** 270 s (04:30)


## New Video lengths

- **Video A:** 3:19 (from 4:14:20)
- **Video B:** 3:24 (from 4:15:90)
- **Video C:** 3:33 (from 5:03:80) *Redundant section on while loop with user input was removed as well*
- **Video D:** 3:52 (from 5:27:70) *Redundant section on len function was removed as well*

**Total Length (Control Group):** 14:10 (from 19:02)

## Topic A

`id: 'a'` · `title: 'Variablen & Datentypen'`

### A1

- **ID:** `a1` · **Timestamp:** 42 s (00:42)
- **Question:** Welche der folgenden Zuordnungen zwischen Variablen und ihren Datentypen ist korrekt?

| | Antwortalternative | |
|---|---|---|
| a | `x = 3.14` -> x ist vom Typ `int` | |
| b | `x = [1, 2, 3]` -> x ist vom Typ `float` | |
| c | `x = True` -> x ist vom Typ `bool` | Correct |
| d | `x = {1: 'blue', 2: 'red'}` -> x ist vom Typ `str` | |

---

### A2

- **ID:** `a2` · **Timestamp:** 137 s (02:17)
- **Question:** In welchem der folgenden Paare sind die beiden Ausdrücke gleichbedeutend?

| | Antwortalternative | |
|---|---|---|
| a | `number = number - 4` und `number *= 4` | |
| b | `number = number * 10` und `number .= 10` | |
| c | `number = number / 5` und `number /= 5` | Correct |
| d | `number = number + 7` und `number -= 7` | |

---

### A3

- **ID:** `a3` · **Timestamp:** 99 s (01:39)
- **Question:** Betrachten Sie den folgenden Code-Auszug. Welche Werte nehmen die Variablen zahl, zahl2 und zahl3 jeweils an?

```python
zahl = 36
zahl = 4
zahl += 4

zahl2 = 28
zahl2 -= zahl

zahl3 = zahl2 % zahl
```

| | Antwortalternative | |
|---|---|---|
| a | `zahl = 8, zahl2 = 20, zahl3 = 4` | Correct |
| b | `zahl = 8, zahl2 = 20, zahl3 = 8` | |
| c | `zahl = 40, zahl2 = -12, zahl3 = 28` | |
| d | `zahl = 8, zahl2 = 20, zahl3 = 0` | |

---

### A5

- **ID:** `a5` · **Timestamp:** 157 s (02:37)
- **Question:** Welche der folgenden Zuweisungen erzeugt einen gültigen (fehlerfreien) String?

| | Antwortalternative | |
|---|---|---|
| a | `string = Das ist ein String'` | |
| b | `string = "Das ist ein String'` | |
| c | *(Code-Block, siehe unten)* | Correct |
| d | `string = Das ist ein String` | |

Antwortalternative c (als `code`-Feld hinterlegt):

```python
string = '''Dies ist ein
             mehrzeiliger String'''
```

---

## Topic B

`id: 'b'` · `title: 'Bedingungen (if-Statements)'`

### B1

- **ID:** `b1` · **Timestamp:** 102 s (01:42)
- **Question:** Welches der unten angegebenen Schlüsselwörter gehört **nicht** zur WENN-DANN-SONSTWENN-DANN-SONST Bedingung?

| | Antwortalternative | |
|---|---|---|
| a | `if` | |
| b | `then` | Correct |
| c | `elif` | |
| d | `else` | |

---

### B2

- **ID:** `b2` · **Timestamp:** 3 s (00:03)
- **Question:** Welches der folgenden Elemente muss ein if-Statement in Python in jedem Fall enthalten?

| | Antwortalternative | |
|---|---|---|
| a | `print` Schlüsselwort | |
| b | `if` Schlüsselwort | Correct |
| c | `else` Schlüsselwort | |
| d | `elif` Schlüsselwort | |

---

### B3

- **ID:** `b3` · **Timestamp:** 3 s (00:03)
- **Question:** Betrachten Sie folgenden Code-Auszug. Welche der folgenden Aussagen ist korrekt?

```python
if x < 10:
  print("Ich bin einstellig.")
else:
  print("Ich nicht.")
print("Ich bin nicht eingerückt.")
```

| | Antwortalternative | |
|---|---|---|
| a | Für `x = 5` wird ausschließlich `Ich bin einstellig.` ausgegeben. | |
| b | Für `x = 15` wird ausschließlich `Ich nicht.` ausgegeben. | |
| c | Egal welche Ausprägung x annimmt, `Ich bin nicht eingerückt.` wird immer mitausgegeben. | Correct |
| d | Es gibt einstellige Ausprägungen von x, für die `Ich nicht.` ausgegeben wird. | |

---

### B5

- **ID:** `b5` · **Timestamp:** 102 s (01:42)
- **Question:** Welche der folgenden Aussagen zu if-Statements ist korrekt?

| | Antwortalternative | |
|---|---|---|
| a | Jedes if-Statement benötigt neben einem if-Block auch einen else-Block | |
| b | Die Verwendung von elif-Blöcken ist optional. | Correct |
| c | Die Anzahl der verwendbaren elif-Blöcke ist aus syntaktischen Gründen nach oben hin beschränkt. | |
| d | Ein if-Statement kann beliebig viele else-Blöcke enthalten. | |

---

## Topic C

`id: 'c'` · `title: 'Schleifen'`

### C2

- **ID:** `c2` · **Timestamp:** 89 s (01:29)
- **Question:** Betrachten Sie folgenden Code-Auszug. Welche Aussage ist korrekt?

```python
[...] zahl in [1, 2, 3, 4]:
  print(zahl)
```

| | Antwortalternative | |
|---|---|---|
| a | An der Stelle `[...]` kann ohne weitere Änderung das Schlüsselwort `break` stehen. | |
| b | Der Auszug zeigt eine for-Schleife, die über die Elemente einer Liste iteriert. | Correct |
| c | An der Stelle `[...]` kann ohne weitere Änderung das Schlüsselwort `continue` stehen. | |
| d | Die Schleife läuft genau drei Mal. | |

---

### C3

- **ID:** `c3` · **Timestamp:** 175 s (02:55)
- **Question:** Durch welchen der folgenden Schleifen-Anfänge entsteht eine Endlosschleife (sofern im Schleifenkörper keine Abbruchbedingung verwendet wird)?

| | Antwortalternative | |
|---|---|---|
| a | `while True:` | Correct |
| b | `while False:` | |
| c | `while x < 0:` (wobei zuvor `x = 5` gesetzt wurde) | |
| d | `for i in [1, 2, 3]:` | |

---

### C4

- **ID:** `c4` · **Timestamp:** 175 s (02:55)
- **Question:** Welches Schlüsselwort (Keyword) eignet sich am besten, um eine Endlosschleife zu beenden?

| | Antwortalternative | |
|---|---|---|
| a | `pass` | |
| b | `continue` | |
| c | `if` | |
| d | `break` | Correct |

---

### C5

- **ID:** `c5` · **Timestamp:** 133 s (02:13)
- **Question:** Betrachten Sie den folgenden Code-Auszug. Wie oft wird `"Hi!"` ausgegeben?

```python
x = 1
x += x
while x > 4:
  x += 1
  print("Hi!")
print("Hi!")
```

| | Antwortalternative | |
|---|---|---|
| a | Nie | |
| b | Ein Mal | Correct |
| c | Endlosschleife | |
| d | Zwei Mal | |

---

## Topic D

`id: 'd'` · `title: 'Funktionen'`

### D1

- **ID:** `d1` · **Timestamp:** 58 s (00:58)
- **Question:** Betrachten Sie folgenden Funktionsaufruf. Welche der folgenden Zuordnungen ist **falsch**?

```python
print('I', 'think', 'therefore', 'I', 'am.')
```

| | Antwortalternative | |
|---|---|---|
| a | Argumente/Input: `'I', 'think', 'therefore', 'I', 'am.'` | |
| b | Funktionsname: `print` | |
| c | Output (Ausgabe): `I think therefore I am.` | |
| d | Return-Value (Rückgabewert): `5` | Correct |

---

### D2

- **ID:** `d2` · **Timestamp:** 91 s (01:31)
- **Question:** Welche der folgenden Aussagen zu Funktionen ist richtig?

| | Antwortalternative | |
|---|---|---|
| a | Jede Funktion benötigt mindestens einen Parameter. | |
| b | Das Schlüsselwort (Keyword) `call` definiert eine Funktion. | |
| c | Beim Übergeben von Argumenten "per position", spielt die Reihenfolge der Argumente keine Rolle. | |
| d | Beim Übergeben von Argumenten mittels "keyword-specification" spielt die Reihenfolge der Argumente keine Rolle. | Correct |

---

### D3

- **ID:** `d3` · **Timestamp:** 184 s (03:04)
- **Question:** Betrachten Sie folgende Funktion. Welches der folgenden Beispiele ist ein valider Funktionsaufruf für einen dreijährigen Hund mit dem Namen Pluto, dessen Besitzer (owner) Hans heißt?

```python
def which_dog_is_it(dogname, ownername, age=0):
  print(f'The dog {dogname} is {age} years old and the owner is {ownername}.')
```

| | Antwortalternative | |
|---|---|---|
| a | `which_dog_is_it('Pluto', '3', Hans)` | |
| b | `which_dog_is_it('Pluto', age=3, 'Hans')` | |
| c | `which_dog_is_it('Pluto', 'Hans', 3)` | Correct |
| d | `which_dog_is_it('Hans')` | |

---

### D5

- **ID:** `d5` · **Timestamp:** 91 s (01:31)
- **Question:** Welche Funktion ermöglicht das Schlüsselwort (Keyword) `return`?

| | Antwortalternative | |
|---|---|---|
| a | Abbruch der innersten Schleife. | |
| b | Sprung zurück an den Anfang der innersten Schleife. | |
| c | Rückgabe von Werten aus einer Funktion an das Hauptprogramm. | Correct |
| d | Abbruch der aktuell ausgeführten Funktionslogik, falls die übergebenen Argumente einen `TypeError` erzeugen. | |

---

## Solutions

| Q | A | Q | A | Q | A | Q | A |
|-------|--------|-------|--------|-------|--------|-------|--------|
| A1 | c | B1 | b | C2 | b | D1 | d |
| A2 | c | B2 | b | C3 | a | D2 | d |
| A3 | a | B3 | c | C4 | d | D3 | c |
| A5 | c | B5 | b | C5 | b | D5 | c |

## Timestamps

| Topic | IDs and Timestamps (s) |
|-------|------------------------------|
| A - Variablen & Datentypen | a1: 42 · a2: 137 · a3: 99 · a5: 157 |
| B - Bedingungen | b1: 102 · b2: 3 · b3: 205 · b5: 102 |
| C - Schleifen | c2: 89 · c3: 226 · c4: 226 · c5: 133 |
| D - Funktionen | d1: 58 · d2: 127 · d3: 220 · d5: 127 |
