let currentTime = 0;

function fieldAction(fpart) {
    const activeTool = document.querySelector('tool.active');
    switch (activeTool.id) {
        case 'tool-hoe':
            fpart.classList.add('farmland');
            fpart.classList.remove('grass');
            break;
        case 'tool-water':
            if (fpart.classList.contains('farmland')) {
                fpart.classList.add('hydrated');
                fpart.dataset.hydrated = currentTime.toString();
            }
            break;
        case 'tool-sow':
            if (fpart.classList.contains('farmland')) fpart.dataset.seed = '1';
            break;
        case 'tool-harvest':
            if (fpart.classList.contains('farmland')) {
                if (fpart.dataset.seed === '7') {
                    let stockElement = document.querySelector('#stock-wheat');
                    stockElement.innerText = (parseInt(stockElement.innerText) + 1).toString();
                }
                fpart.dataset.seed = '0';
            }
    }
}

function generateFields() {
    const fparts = document.querySelector('field-parts');
    console.log(fparts);
    for (let i = 0 ; i < 25 ; i++) {
        const fpart = document.createElement('field-part');
        fpart.classList.add('grass');
        fpart.addEventListener('click', () => {
            fieldAction(fpart);
        });
        fparts.appendChild(fpart);
    }
}

function attachToolsEvent() {
    const tools = Array.from(document.querySelectorAll('tool'));
    tools.forEach((tool) => {
        tool.addEventListener('click', () => {
            if (!tool.classList.contains('active')) {
                try {
                    document.querySelector('tool.active').classList.remove('active');
                } finally {
                    tool.classList.add('active');
                }
            }
        });
    });
}

async function grow() {
    currentTime++;
    const fieldParts = Array.from(document.querySelectorAll('field-part'));
    fieldParts.forEach((fieldPart) => {
        if (fieldPart.dataset.seed != '0' && fieldPart.dataset.seed != '7') {  // conditions where wheat can grow
            const nextStepProb = fieldPart.classList.contains('hydrated') ? 0.3 : 0.05;
            const randomNum = Math.random();
            if (randomNum < nextStepProb) fieldPart.dataset.seed = (parseInt(fieldPart.dataset.seed) + 1).toString();
        }
        if (fieldPart.classList.contains('hydrated')) {  // dry after 10 seconds
            if (currentTime - parseInt(fieldPart.dataset.hydrated) >= 10) fieldPart.classList.remove('hydrated');
        }
        if (fieldPart.dataset.seed != '0' && !fieldPart.classList.contains('hydrated')) {
            const randomNum = Math.random();
            if (randomNum < 0.01) {
                fieldPart.classList.add('grass');
                fieldPart.classList.remove('farmland');
            }
        }
    });
    setTimeout(grow, 1000);
}

window.addEventListener('load', generateFields);
window.addEventListener('load', attachToolsEvent);
window.addEventListener('load', grow);
