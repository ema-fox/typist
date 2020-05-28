let out_text = '';
let n_choices = 2;

text = "Vom Eise befreit sind Strom und Bäche \
durch des Frühlings holden, belebenden Blick. \
Im Tale grünet Hoffnungsglück. \
Der alte Winter in seiner Schwäche \
zog sich in rauhe Berge zurück. \
Von dorther sendet er, fliehend, nur \
ohnmächtige Schauer körnigen Eises \
in Streifen über die grünende Flur. \
Aber die Sonne duldet kein Weisses. \
Überall regt sich Bildung und Streben, \
alles will sie mit Farbe beleben. \
Doch an Blumen fehlts im Revier. \
Sie nimmt geputzte Menschen dafür. \
\
Kehre dich um, von diesen Höhen \
nach der Stadt zurückzusehen! \
Aus dem hohlen, finstern Tor \
dringt ein buntes Gewimmel hervor. \
Jeder sonnt sich heute so gern. \
Sie feiern die Auferstehung des Herrn, \
denn sie sind selber auferstanden. \
Aus niedriger Häuser dumpfen Gemächern, \
aus Handwerks- und Gewerbesbanden, \
aus dem Druck von Giebeln und Dächern, \
aus der Strassen quetschender Enge, \
aus der Kirchen ehrwürdiger Nacht \
sind sie alle ans Licht gebracht. \
\
Sieh nur, sieh, wie behend sich die Menge \
durch die Gärten und Felder zerschlägt, \
wie der Fluss in Breit und Länge \
so manchen lustigen Nachen bewegt, \
und, bis zum Sinken überladen, \
entfernt sich dieser letzte Kahn. \
Selbst von des Berges ferner Pfaden \
blinken uns farbige Kleider an. \
Ich höre schon des Dorfs Getümmel. \
Hier ist des Volkes wahrer Himmel. \
Zufrieden jauchzet gross und klein: \
Hier bin ich Mensch, hier darf ichs sein!";


function create_choice(c) {
    let button = document.createElement('div');
    button.className = 'choice';
    button.c = c;
    button.innerText = c == ' ' ? '_' : c;
    button.addEventListener('click', () => {
        if (button.classList.contains('disabled')) {
            return;
        }
        if (c == text[0]) {
            n_choices += 0.1;
            let out = document.querySelector('#output');
            out_text += c;
            out.innerText = out_text + '|';
            text = text.slice(1);
            show_choices();
        } else {
            n_choices = Math.max(2, n_choices - 1);
            button.classList.add('disabled');
        }
    });
    return button;
}

function show_choices() {
    let choi = document.querySelector('#choices');
    choi.innerHTML = '';

    let choices = [...new Set(text.slice(0, n_choices | 0))];
    choices.sort();

    for (c of choices) {
       choi.insertBefore(create_choice(c), null);
    }


}

addEventListener('DOMContentLoaded', () => {
    show_choices();
    window.addEventListener('keypress', (event) => {
        for (b of document.querySelectorAll('.choice')) {
            if (b.c == event.key) {
                b.click();
            }
        }
    });
});
