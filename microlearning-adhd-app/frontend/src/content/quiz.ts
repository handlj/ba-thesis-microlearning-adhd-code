/*
  This file holds all quiz questions and their answer alternatives.
  Correct answers are marked with `correct: true`.
  Strings wrapped in backticks (``) is displayed as code in the frontend.
*/

export type QuizOption = {
  id: 'a' | 'b' | 'c' | 'd' | 'e'
  text?: string
  code?: string
  correct?: boolean
}

export type QuizQuestion = {
  id: string
  prompt: string
  code?: string
  options: QuizOption[]
  videoTimestamp: number
}

export type QuizTopic = {
  id: 'a' | 'b' | 'c' | 'd'
  title: string
  questions: QuizQuestion[]
}

export const DONT_KNOW_OPTION: QuizOption = { id: 'e', text: 'Ich weiß es nicht.' }

export const quizTopics: QuizTopic[] = [
  {
    id: 'a',
    title: 'Variablen & Datentypen',
    questions: [
      {
        id: 'a1',
        videoTimestamp: 42,
        prompt:
          'Welche der folgenden Zuordnungen zwischen Variablen und ihren Datentypen ist korrekt?',
        options: [
          { id: 'a', text: '`x = 3.14` -> x ist vom Typ `int`' },
          { id: 'b', text: '`x = [1, 2, 3]` -> x ist vom Typ `float`' },
          { id: 'c', text: '`x = True` -> x ist vom Typ `bool`', correct: true },
          {
            id: 'd',
            text: "`x = {1: 'blue', 2: 'red'}` -> x ist vom Typ `str`",
          },
        ],
      },
      {
        id: 'a2',
        videoTimestamp: 137,
        prompt: 'In welchem der folgenden Paare sind die beiden Ausdrücke gleichbedeutend?',
        options: [
          { id: 'a', text: '`number = number - 4` und `number *= 4`' },
          { id: 'b', text: '`number = number * 10` und `number .= 10`' },
          { id: 'c', text: '`number = number / 5` und `number /= 5`', correct: true },
          { id: 'd', text: '`number = number + 7` und `number -= 7`' },
        ],
      },
      {
        id: 'a3',
        videoTimestamp: 99,
        prompt:
          'Betrachten Sie den folgenden Code-Auszug. Welche Werte nehmen die Variablen zahl, zahl2 und zahl3 jeweils an?',
        code: `zahl = 36
zahl = 4
zahl += 4

zahl2 = 28
zahl2 -= zahl

zahl3 = zahl2 % zahl`,
        options: [
          { id: 'a', text: '`zahl = 8, zahl2 = 20, zahl3 = 4`', correct: true },
          { id: 'b', text: '`zahl = 8, zahl2 = 20, zahl3 = 8`' },
          { id: 'c', text: '`zahl = 40, zahl2 = -12, zahl3 = 28`' },
          { id: 'd', text: '`zahl = 8, zahl2 = 20, zahl3 = 0`' },
        ],
      },
      {
        id: 'a4',
        videoTimestamp: 202,
        prompt:
          'Betrachten Sie die Variable `string = "abcdef"`. Welche der folgenden Aussagen ist korrekt?',
        options: [
          { id: 'a', text: '`string[0]` hat den Wert `abcdef`' },
          { id: 'b', text: '`string[1:3]` hat den Wert `abc`' },
          { id: 'c', text: '`string[0:6]` hat den Wert `abcdef`', correct: true },
          {
            id: 'd',
            text: '`string[5]` hat den Wert `e`',
          },
        ],
      },
      {
        id: 'a5',
        videoTimestamp: 157,
        prompt: 'Welche der folgenden Zuweisungen erzeugt einen gültigen (fehlerfreien) String?',
        options: [
          { id: 'a', text: "`string = Das ist ein String'`" },
          { id: 'b', text: '`string = "Das ist ein String\'`' },
          {
            id: 'c',
            code: `string = '''Dies ist ein
             mehrzeiliger String'''`,
            correct: true,
          },
          { id: 'd', text: '`string = Das ist ein String`' },
        ],
      },
    ],
  },
  {
    id: 'b',
    title: 'Bedingungen (if-Statements)',
    questions: [
      {
        id: 'b1',
        videoTimestamp: 102,
        prompt:
          'Welches der unten angegebenen Schlüsselwörter gehört nicht zur WENN-DANN-SONSTWENN-DANN-SONST Bedingung?',
        options: [
          { id: 'a', text: '`if`' },
          { id: 'b', text: '`then`', correct: true },
          { id: 'c', text: '`elif`' },
          { id: 'd', text: '`else`' },
        ],
      },
      {
        id: 'b2',
        videoTimestamp: 3,
        prompt:
          'Welches der folgenden Elemente muss ein if-Statement in Python in jedem Fall enthalten?',
        options: [
          { id: 'a', text: '`print` Schlüsselwort' },
          { id: 'b', text: '`if` Schlüsselwort', correct: true },
          { id: 'c', text: '`else` Schlüsselwort' },
          { id: 'd', text: '`elif` Schlüsselwort' },
        ],
      },
      {
        id: 'b3',
        videoTimestamp: 205,
        prompt: 'Betrachten Sie folgenden Code-Auszug. Welche der folgenden Aussagen ist korrekt?',
        code: `if x < 10:
  print("Ich bin einstellig.")
else:
  print("Ich nicht.")
print("Ich bin nicht eingerückt.")`,
        options: [
          {
            id: 'a',
            text: 'Für `x = 5` wird ausschließlich `Ich bin einstellig.` ausgegeben.',
          },
          {
            id: 'b',
            text: 'Für `x = 15` wird ausschließlich `Ich nicht.` ausgegeben.',
          },
          {
            id: 'c',
            text: 'Egal welche Ausprägung x annimmt, `Ich bin nicht eingerückt.` wird immer mitausgegeben.',
            correct: true,
          },
          {
            id: 'd',
            text: 'Es gibt einstellige Ausprägungen von x, für die `Ich nicht.` ausgegeben wird.',
          },
        ],
      },
      {
        id: 'b4',
        videoTimestamp: 205,
        prompt:
          'Betrachten Sie die folgenden beiden Code-Auszüge. Welche der folgenden Aussagen ist korrekt?',
        code: `# Auszug A
if x > 40:
  print("Ich bin größer als 40.")
elif x > 20:
  print("Ich bin größer als 20.")

# Auszug B
if x > 40:
  print("Ich bin größer als 40.")
if x > 20:
  print("Ich bin größer als 20.")`,
        options: [
          { id: 'a', text: 'Auszug A zeigt immer die gleiche Ausgabe wie Auszug B.' },
          { id: 'b', text: 'Für `x = 100` zeigen beide Auszüge die gleiche Ausgabe.' },
          {
            id: 'c',
            text: 'Für `x = 30` zeigen beide Auszüge die gleiche Ausgabe.',
            correct: true,
          },
          { id: 'd', text: 'Auszug A zeigt immer eine andere Ausgabe wie Auszug B.' },
        ],
      },
      {
        id: 'b5',
        videoTimestamp: 102,
        prompt: 'Welche der folgenden Aussagen zu if-Statements ist korrekt?',
        options: [
          {
            id: 'a',
            text: 'Jedes if-Statement benötigt neben einem if-Block auch einen else-Block',
          },
          { id: 'b', text: 'Die Verwendung von elif-Blöcken ist optional.', correct: true },
          {
            id: 'c',
            text: 'Die Anzahl der verwendbaren elif-Blöcke ist aus syntaktischen Gründen nach oben hin beschränkt.',
          },
          {
            id: 'd',
            text: 'Ein if-Statement kann beliebig viele else-Blöcke enthalten.',
          },
        ],
      },
    ],
  },
  {
    id: 'c',
    title: 'Schleifen',
    questions: [
      {
        id: 'c1',
        videoTimestamp: 265,
        prompt:
          'Welche der folgenden Paare von Schlüsselwörtern steuern den Ablauf einer Schleife (Schleife abbrechen oder zur nächsten Iteration springen)?',
        options: [
          { id: 'a', text: '`break` und `for`' },
          { id: 'b', text: '`break` und `continue`', correct: true },
          { id: 'c', text: '`continue` und `while`' },
          { id: 'd', text: '`for` und `while`' },
        ],
      },
      {
        id: 'c2',
        videoTimestamp: 89,
        prompt: 'Betrachten Sie folgenden Code-Auszug. Welche Aussage ist korrekt?',
        code: `[...] zahl in [1, 2, 3, 4]:
  print(zahl)`,
        options: [
          {
            id: 'a',
            text: 'An der Stelle `[...]` kann ohne weitere Änderung das Schlüsselwort `break` stehen.',
          },
          {
            id: 'b',
            text: 'Der Auszug zeigt eine for-Schleife, die über die Elemente einer Liste iteriert.',
            correct: true,
          },
          {
            id: 'c',
            text: 'An der Stelle `[...]` kann ohne weitere Änderung das Schlüsselwort `continue` stehen.',
          },
          { id: 'd', text: 'Die Schleife läuft genau drei Mal.' },
        ],
      },
      {
        id: 'c3',
        videoTimestamp: 226,
        prompt:
          'Durch welchen der folgenden Schleifen-Anfänge entsteht eine Endlosschleife (sofern im Schleifenkörper keine Abbruchbedingung verwendet wird)?',
        options: [
          { id: 'a', text: '`while True:`', correct: true },
          { id: 'b', text: '`while False:`' },
          { id: 'c', text: '`while x < 0:` (wobei zuvor `x = 5` gesetzt wurde)' },
          { id: 'd', text: '`for i in [1, 2, 3]:`' },
        ],
      },
      {
        id: 'c4',
        videoTimestamp: 226,
        prompt:
          'Welches Schlüsselwort (Keyword) eignet sich am besten, um eine Endlosschleife zu beenden?',
        options: [
          { id: 'a', text: '`pass`' },
          { id: 'b', text: '`continue`' },
          { id: 'c', text: '`if`' },
          { id: 'd', text: '`break`', correct: true },
        ],
      },
      {
        id: 'c5',
        videoTimestamp: 133,
        prompt: 'Betrachten Sie den folgenden Code-Auszug. Wie oft wird `"Hi!"` ausgegeben?',
        code: `x = 1
x += x
while x > 4:
  x += 1
  print("Hi!")
print("Hi!")`,
        options: [
          { id: 'a', text: 'Nie' },
          { id: 'b', text: 'Ein Mal', correct: true },
          { id: 'c', text: 'Endlosschleife' },
          { id: 'd', text: 'Zwei Mal' },
        ],
      },
    ],
  },
  {
    id: 'd',
    title: 'Funktionen',
    questions: [
      {
        id: 'd1',
        videoTimestamp: 58,
        prompt:
          'Betrachten Sie folgenden Funktionsaufruf. Welche der folgenden Zuordnungen ist falsch?',
        code: `print('I', 'think', 'therefore', 'I', 'am.')`,
        options: [
          {
            id: 'a',
            text: "Argumente/Input: `'I', 'think', 'therefore', 'I', 'am.'`",
          },
          { id: 'b', text: 'Funktionsname: `print`' },
          { id: 'c', text: 'Output (Ausgabe): `I think therefore I am.`' },
          { id: 'd', text: 'Return-Value (Rückgabewert): `5`', correct: true },
        ],
      },
      {
        id: 'd2',
        videoTimestamp: 127,
        prompt: 'Welche der folgenden Aussagen zu Funktionen ist richtig?',
        options: [
          { id: 'a', text: 'Jede Funktion benötigt mindestens einen Parameter.' },
          {
            id: 'b',
            text: 'Das Schlüsselwort (Keyword) `call` definiert eine Funktion.',
          },
          {
            id: 'c',
            text: 'Beim Übergeben von Argumenten "per position", spielt die Reihenfolge der Argumente keine Rolle.',
          },
          {
            id: 'd',
            text: 'Beim Übergeben von Argumenten mittels "keyword-specification" spielt die Reihenfolge der Argumente keine Rolle.',
            correct: true,
          },
        ],
      },
      {
        id: 'd3',
        videoTimestamp: 220,
        prompt:
          'Betrachten Sie folgende Funktion. Welches der folgenden Beispiele ist ein valider Funktionsaufruf für einen dreijährigen Hund mit dem Namen Pluto, dessen Besitzer (owner) Hans heißt?',
        code: `def which_dog_is_it(dogname, ownername, age=0):
  print(f'The dog {dogname} is {age} years old and the owner is {ownername}.')`,
        options: [
          { id: 'a', text: "`which_dog_is_it('Pluto', '3', Hans)`" },
          { id: 'b', text: "`which_dog_is_it('Pluto', age=3, 'Hans')`" },
          {
            id: 'c',
            text: "`which_dog_is_it('Pluto', 'Hans', 3)`",
            correct: true,
          },
          { id: 'd', text: "`which_dog_is_it('Hans')`" },
        ],
      },
      {
        id: 'd4',
        videoTimestamp: 270,
        prompt:
          'Betrachten Sie erneut die Funktion which_dog_is_it. Welchen Fehler erhält man bei folgendem Funktionsaufruf?',
        code: `def which_dog_is_it(dogname, ownername, age=0):
  print(f'The dog {dogname} is {age} years old and the owner is {ownername}.')

# Funktionsaufruf
which_dog_is_it('Pluto')`,
        options: [
          { id: 'a', text: '`SyntaxError: positional argument follows keyword argument`' },
          {
            id: 'b',
            code: `TypeError: which_dog_is_it() missing 1 required 
            positional argument: 'age'`,
          },
          {
            id: 'c',
            code: `TypeError: which_dog_is_it() missing 1 required 
            positional argument: 'ownername'`,
            correct: true,
          },
          {
            id: 'd',
            text: 'Kein Fehler in der Ausführung, aber: "Logischer Fehler"',
          },
        ],
      },
      {
        id: 'd5',
        videoTimestamp: 127,
        prompt: 'Welche Funktion ermöglicht das Schlüsselwort (Keyword) `return`?',
        options: [
          { id: 'a', text: 'Abbruch der innersten Schleife.' },
          { id: 'b', text: 'Sprung zurück an den Anfang der innersten Schleife.' },
          {
            id: 'c',
            text: 'Rückgabe von Werten aus einer Funktion an das Hauptprogramm.',
            correct: true,
          },
          {
            id: 'd',
            text: 'Abbruch der aktuell ausgeführten Funktionslogik, falls die übergebenen Argumente einen `TypeError` erzeugen.',
          },
        ],
      },
    ],
  },
]

export const allQuizQuestions: QuizQuestion[] = quizTopics.flatMap((topic) => topic.questions)

export const preQuizQuestions: QuizQuestion[] = allQuizQuestions.map((question) => ({
  ...question,
  options: [...question.options, DONT_KNOW_OPTION],
}))
