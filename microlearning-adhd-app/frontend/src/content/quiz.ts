// Assessment quiz shown after the microlearning intervention.
// Transcribed verbatim from assets/quiz.md: 4 topics (A-D), 5 questions each,
// multiple-choice with one-to-many correct answers (4 options each).
//
// Conventions:
// - `prompt` and option `text` may contain inline code wrapped in backtick pairs
//   (e.g. "x ist vom Typ `int`"); the renderer turns those into <code> chips.
// - `code` holds a multi-line snippet rendered as a formatted block.
// - `correct` mirrors the (r) markers from quiz.md. It is recorded for analysis
//   but never shown to participants.

export type QuizOption = {
  id: 'a' | 'b' | 'c' | 'd'
  text?: string
  code?: string
  correct?: boolean
}

export type QuizQuestion = {
  id: string
  prompt: string
  code?: string
  options: QuizOption[]
}

export type QuizTopic = {
  id: 'a' | 'b' | 'c' | 'd'
  title: string
  questions: QuizQuestion[]
}

export const quizTopics: QuizTopic[] = [
  {
    id: 'a',
    title: 'Variablen & Datentypen',
    questions: [
      {
        id: 'a1',
        prompt:
          'Welche der folgenden Zuordnungen zwischen Variablen und ihren Datentypen sind korrekt?',
        options: [
          { id: 'a', text: '`x = 3` -> x ist vom Typ `int`', correct: true },
          { id: 'b', text: '`x = [1, 2, 3]` -> x ist vom Typ `float`' },
          { id: 'c', text: '`x = True` -> x ist vom Typ `str`' },
          {
            id: 'd',
            text: "`x = {1: 'blue', 2: 'red'}` -> x ist vom Typ `dict`",
            correct: true,
          },
        ],
      },
      {
        id: 'a2',
        prompt: 'Welche der folgenden Ausdrücke sind jeweils gleichbedeutend?',
        options: [
          { id: 'a', text: '`number = number / 4` und `number -= 4`' },
          { id: 'b', text: '`number = number * 10` und `number *= 10`', correct: true },
          { id: 'c', text: '`number = number - 5` und `number /= 5`' },
          { id: 'd', text: '`number = number + 7` und `number += 7`', correct: true },
        ],
      },
      {
        id: 'a3',
        prompt:
          'Betrachte den folgenden Code-Auszug. Welche Werte nehmen die Variablen zahl, zahl2 und zahl3 jeweils an?',
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
        prompt:
          'Betrachte den folgenden Code-Auszug. Welche Aussagen über die Variable bruch sind korrekt?',
        code: `zaehler = 4
nenner = 5
bruch = 0

bruch = zaehler / nenner`,
        options: [
          { id: 'a', text: '`bruch` hat den Wert `0.8`', correct: true },
          { id: 'b', text: '`bruch` ist vom Typ `float`', correct: true },
          { id: 'c', text: '`bruch` hat den Wert `0`' },
          {
            id: 'd',
            text: 'Die Ausführung erzeugt einen Fehler, weil `4/5` keine ganze Zahl (`int` Datentyp) ist',
          },
        ],
      },
      {
        id: 'a5',
        prompt:
          'Welche der folgenden Zuweisungen erzeugen einen gültigen (fehlerfreien) String?',
        options: [
          { id: 'a', text: "`string = 'Das ist ein String'`", correct: true },
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
        prompt:
          'Welche der unten angegebenen Schlüsselwörter gehören zur WENN-DANN-SONSTWENN-DANN-SONST Bedingung?',
        options: [
          { id: 'a', text: '`else`', correct: true },
          { id: 'b', text: '`elif`', correct: true },
          { id: 'c', text: '`if`', correct: true },
          { id: 'd', text: '`for`' },
        ],
      },
      {
        id: 'b2',
        prompt:
          'Welche der folgenden Elemente muss jedes if-Statement in Python in jedem Fall enthalten.',
        options: [
          { id: 'a', text: 'Einrückung im Codeblock', correct: true },
          { id: 'b', text: '`if` Schlüsselwort', correct: true },
          { id: 'c', text: '`else` Schlüsselwort' },
          { id: 'd', text: '`elif` Schlüsselwort' },
        ],
      },
      {
        id: 'b3',
        prompt:
          'Betrachte folgenden Code-Auszug. Welche der folgenden Aussagen sind korrekt?',
        code: `if x < 10:
  print("Ich bin einstellig.")
else:
  print("Ich nicht.")
print("Mir ist es egal.")`,
        options: [
          {
            id: 'a',
            text: 'Für jeden einstelligen Wert der Variable x wird nur `"Ich bin einstellig."` ausgegeben.',
          },
          {
            id: 'b',
            text: 'Für alle zweistelligen Werte der Variable x wird nur `"Ich nicht."` ausgegeben.',
          },
          {
            id: 'c',
            text: 'Egal welche Ausprägung x annimmt, `"Mir ist es egal."` wird immer mitausgegeben.',
            correct: true,
          },
          {
            id: 'd',
            text: 'Es gibt einstellige Ausprägungen von x, für die `"Ich nicht."` ausgegeben wird.',
          },
        ],
      },
      {
        id: 'b4',
        prompt:
          'Betrachte den oben angeführten Code-Auszug erneut. Durch welche der unten angeführten Codezeilen lässt sich die Zeile `else:` ersetzen, ohne die Funktionalität des Code-Auszugs oben einzuschränken?',
        code: `if x < 10:
  print("Ich bin einstellig.")
else:
  print("Ich nicht.")
print("Mir ist es egal.")`,
        options: [
          { id: 'a', text: '`if x > 10:`' },
          { id: 'b', text: '`elif x > 10:`' },
          { id: 'c', text: '`""` (Die Zeile weglöschen)' },
          { id: 'd', text: '`if x >= 10:`', correct: true },
        ],
      },
      {
        id: 'b5',
        prompt: 'Welche der folgenden Aussagen zu if-Statements sind korrekt?',
        options: [
          {
            id: 'a',
            text: 'Jedes if-Statement benötigt neben einem if-Block auch einen else-Block',
          },
          { id: 'b', text: 'Die Verwendung von elif-Blöcken ist optional.', correct: true },
          {
            id: 'c',
            text: 'Die Anzahl der verwendbaren elif-Blöcke ist aus Laufzeitgründen nach oben hin beschränkt.',
          },
          {
            id: 'd',
            text: 'Egal welche Form des if-Statements verwendet wird, seine Codeblöcke müssen beispielsweise durch Leerzeichen eingerückt sein.',
            correct: true,
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
        prompt:
          'Welche der folgenden Schlüsselwörter steuern den Ablauf einer Schleife (Schleife abbrechen oder zur nächsten Iteration springen)?',
        options: [
          { id: 'a', text: '`pass`' },
          { id: 'b', text: '`break`', correct: true },
          { id: 'c', text: '`continue`', correct: true },
          { id: 'd', text: '`return`' },
        ],
      },
      {
        id: 'c2',
        prompt: 'Betrachte folgenden Code-Auszug. Welche Aussagen sind korrekt?',
        code: `[...] zahl in [1, 2, 3, 4]:
  print(zahl)`,
        options: [
          {
            id: 'a',
            text: 'An der Stelle `[...]` muss das Schlüsselwort `for` stehen.',
            correct: true,
          },
          { id: 'b', text: 'Die Schleife iteriert über die Elemente einer Liste.', correct: true },
          {
            id: 'c',
            text: 'An der Stelle `[...]` könnte ohne weitere Änderung auch `while` stehen.',
          },
          { id: 'd', text: 'Die Schleife läuft genau drei Mal.' },
        ],
      },
      {
        id: 'c3',
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
        prompt:
          'Betrachte den folgenden Code-Auszug. Wie oft wird `"Hi!"` ausgegeben?',
        code: `x = 2
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
        prompt: 'Betrachte die folgende Funktion. Welche der folgenden Zuordnungen sind richtig?',
        code: `print('I', 'think', 'therefore', 'I', 'am.')`,
        options: [
          {
            id: 'a',
            text: "Argumente/Input: `'I', 'think', 'therefore', 'I', 'am.'`",
            correct: true,
          },
          { id: 'b', text: 'Funktion: `print`', correct: true },
          { id: 'c', text: 'Output: `"I think therefore I am."`', correct: true },
          { id: 'd', text: 'Rückgabewert (return-value): `5`' },
        ],
      },
      {
        id: 'd2',
        prompt: 'Welche der folgenden Aussagen zu Funktionen sind richtig?',
        options: [
          { id: 'a', text: 'Jede Funktion benötigt einen oder mehrere Parameter.' },
          {
            id: 'b',
            text: 'Das Schlüsselwort (Keyword) `def` definiert eine Funktion.',
            correct: true,
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
        prompt:
          'Betrachte folgende Funktion. Welche der folgenden Beispiele sind valide Funktionsaufrufe für einen dreijährigen Hund mit dem Namen Pluto, dessen Besitzer (owner) Hans heißt?',
        code: `def which_dog_is_it(dogname, ownername, age=0):
  print(f'My dog {dogname} is {age} years old and the owner is {ownername}.')`,
        options: [
          { id: 'a', text: "`which_dog_is_it('Pluto', 'Hans', 3)`", correct: true },
          { id: 'b', text: "`which_dog_is_it(age=3, 'Hans', dogname='Pluto')`" },
          {
            id: 'c',
            text: "`which_dog_is_it(age=3, ownername='Hans', dogname='Pluto')`",
            correct: true,
          },
          { id: 'd', text: "`which_dog_is_it('Pluto', 'Hans')`" },
        ],
      },
      {
        id: 'd4',
        prompt:
          'Betrachte erneut die oben angeführte Funktion which_dog_is_it. Welchen Fehler erhält man bei folgendem Funktionsaufruf?',
        code: `def which_dog_is_it(dogname, ownername, age=0):
  print(f'My dog {dogname} is {age} years old and the owner is {ownername}.')

which_dog_is_it('Hans', 'Pluto')`,
        options: [
          { id: 'a', text: '`SyntaxError: positional argument follows keyword argument`' },
          {
            id: 'b',
            text: "`TypeError: which_dog_is_it() missing 1 positional argument: 'age'`",
          },
          {
            id: 'c',
            text: "`SyntaxError: which_dog_is_it() missing 1 positional argument: 'age'`",
          },
          {
            id: 'd',
            text: 'Kein Fehler in der Ausführung, aber: "Logischer Fehler"',
            correct: true,
          },
        ],
      },
      {
        id: 'd5',
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

export const allQuizQuestions: QuizQuestion[] = quizTopics.flatMap(
  (topic) => topic.questions,
)
