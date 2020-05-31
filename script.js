let out_text = '';
let n_choices = 2;
let score = 0;
let run = 0;
let streak = 0;
const n_stride = 5;
const truncate_at = 20;
let text = [];

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
    b.innerText = b.c.replace(/^ | $/g, '_').replace(/^\n|\n$/g, '\u23CE');
}

function uncover(node, n) {
    let cursor = document.querySelector('#cursor');
    for (let child of node.querySelectorAll('*')) {
        if (child.hider) {
            let addition = child.text.slice(0, n);
            child.text = child.text.slice(n);
            child.show_text += addition;
            child.innerText = child.show_text;
            n -= addition.length

            if (n <= 0 && child.text) {
                child.replaceWith(child, cursor);
                break;
            }
        } else {
                child.style.display = '';
        }
    }
}

function move(n) {
    let out = document.querySelector('#output');
    uncover(out, n);
    text[0] = text[0].slice(n);
    if (!text[0]) {
        text.shift();
    }

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
        if (text[0] = button.c) {
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

    let choices = text.slice(0, Math.min(30, n_choices));

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
    let x = await fetch((document.location.hash.slice(1) || 'pepper1') + '.html');
    return await x.text();
}

text_promise = get_text();

addEventListener('DOMContentLoaded', () => {
    text_promise.then(html => {
        let out = document.querySelector('#output');
        out.innerHTML = html;
        let walker = document.createTreeWalker(out, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
        let node = null;
        let nodes = []
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        nodes.forEach(node => {
            if (node.tagName) {
                node.style.display = 'none';
            } else {
                let hider = document.createElement('span');
                hider.hider = true;
                hider.innerText = node.textContent;
                hider.text = hider.innerText;
                hider.innerText.match(/\s*[^\s]+\s*/g).forEach(word => text.push(word));
                hider.innerText = '';
                hider.show_text = '';
                node.replaceWith(hider);
            }
        });
        uncover(out, 0);
        show_choices();
    });
    window.addEventListener('keypress', (event) => {
        let key = event.key;
        if (key == 'Enter') {
            key = '\n';
        }
        if (text[0][0] == key) {
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
