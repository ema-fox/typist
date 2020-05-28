let out_text = '';
let n_choices = 2;
let score = 0;
let run = 0;
let streak = 0;
const n_stride = 5;
const truncate_at = 20;

function run_score() {
    return Math.pow(Math.max(0, run - 2), 2);
}

function add_run() {
    score += run_score();
    run = 0;
    let score_el = document.querySelector('#score');
    let run_el = document.querySelector('#run');
    let streak_el = document.querySelector('#streak');
    score_el.innerText = score
    run_el.innerText = run_score();
    streak_el.innerText = streak;
}

function update_label (b) {
    b.innerText = b.c.replace(/^ | $/g, '_').replace(/^\n|\n$/g, '\\n');
}

function move(n) {
    let foo = text.slice(0, n);
    out_text += foo;
    let out = document.querySelector('#output');
    out.innerText = out_text + '|';
    text = text.slice(n);

    n_choices += n * 0.1;

    run += n;
    streak += n;
    if (run_score() >= 100) {
        add_run()
    } else {
        let run_el = document.querySelector('#run');
        let streak_el = document.querySelector('#streak');
        run_el.innerText = run_score();
        streak_el.innerText = streak;
    }
}

function fail(b) {
    score += streak;
    streak = 0;
    add_run();
    n_choices = Math.max(2, n_choices - 1);
    b.classList.add('disabled');
}

function create_choice(c) {
    let button = document.createElement('div');
    button.className = 'choice';
    button.c = c;
    update_label(button);
    button.addEventListener('click', () => {
        if (button.classList.contains('disabled')) {
            return;
        }
        if (text.startsWith(button.c)) {
           move(button.c.length);
            show_choices();
        } else {
            fail(button);
        }
    });
    return button;
}

function show_choices() {
    let choi = document.querySelector('#choices');
    choi.innerHTML = '';

    let choices = [];

    let stride = Math.max(1, Math.min(5, n_stride * truncate_at / n_choices)) | 0;

    for (let i = 0; i < n_choices; i++) {
        let foo = text.slice(i * stride, (i + 1) * stride);
        if (foo) {
            choices.push(foo);
        }
    }

    choices = [...new Set(choices)];
    choices.sort();

    if (!choices.length) {
        score += streak;
        streak = 0;
        add_run();
    }
    for (c of choices) {
       choi.insertBefore(create_choice(c), null);
    }


}

async function get_text() {
    let x = await fetch((document.location.hash.slice(1) || 'osterspaziergang') + '.txt');
    return await x.text();
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
        if (text[0] == key) {
            move(1);
            for (b of document.querySelectorAll('.choice')) {
                if (b.c[0] == key && !b.classList.contains('disabled')) {
                    event.preventDefault();
                    b.c = b.c.slice(1);
                    update_label(b);
                    if (!b.c) {
                        show_choices();
                    }
                } else {
                    b.classList.add('disabled');
                }
            }
        } else {
            for (b of document.querySelectorAll('.choice')) {
                if (b.c[0] == key && !b.classList.contains('disabled')) {
                    event.preventDefault();
                    fail(b);
                }
            }
        }
    });
});
