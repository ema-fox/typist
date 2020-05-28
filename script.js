let out_text = '';
let n_choices = 2;
let score = 0;
let run = 0;

function run_score() {
    return Math.pow(Math.max(0, run - 2), 2);
}

function add_run() {
    score += run_score();
    run = 0;
    let score_el = document.querySelector('#score');
    let run_el = document.querySelector('#run');
    score_el.innerText = score
    run_el.innerText = run_score();


}


function create_choice(c) {
    let button = document.createElement('div');
    button.className = 'choice';
    button.c = c;
    button.innerText = c == ' ' ? '_' : c == '\n' ? '\\n' : c;
    button.addEventListener('click', () => {
        if (button.classList.contains('disabled')) {
            return;
        }
        if (c == text[0]) {
            run++;
            if (run_score() >= 100) {
                add_run()
            } else {
                let run_el = document.querySelector('#run');
                run_el.innerText = run_score();
            }
            n_choices += 0.1;
            let out = document.querySelector('#output');
            out_text += c;
            out.innerText = out_text + '|';
            text = text.slice(1);
            show_choices();
        } else {
            add_run();
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

    if (!choices.length) {
        add_run();
    }
    for (c of choices) {
       choi.insertBefore(create_choice(c), null);
    }


}

async function get_text() {
    let x = await fetch((document.location.hash.slice(1) || 'osterspaziergang') + '.txt');
    return x.text();
}

text_promise = get_text();

addEventListener('DOMContentLoaded', () => {
    text_promise.then(txt => {
        text = txt
        show_choices();
    });
    window.addEventListener('keypress', (event) => {
        let key = event.key;
        if (key == 'Enter') {
            key = '\n';
        }
        for (b of document.querySelectorAll('.choice')) {
            if (b.c == key) {
                b.click();
            }
        }
    });
});
