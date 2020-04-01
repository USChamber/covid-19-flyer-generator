document.getElementById('MainContact').addEventListener('keyup', function(ev) {
    var contact = ev.target.value;
    document.getElementById('ContactUs').innerHTML = contact;
});

document.getElementById('KeepingSafe').addEventListener('submit', function(ev) {
    ev.preventDefault();
    var input = document.querySelector('#KeepingSafe input[type="text"]');
    addItemToChecklist(input.value, 'KeepingSafeItems');
    input.value = '';
});

document.getElementById('SecuringEnvironment').addEventListener('submit', function(ev) {
    ev.preventDefault();
    var input = document.querySelector('#SecuringEnvironment input[type="text"]');
    addItemToChecklist(input.value, 'SecuringEnvironmentItems');
    input.value = '';
});

document.getElementById('FlexibleWorkplace').addEventListener('submit', function(ev) {
    ev.preventDefault();
    var input = document.querySelector('#FlexibleWorkplace input[type="text"]');
    addItemToChecklist(input.value, 'FlexibleWorkplaceItems');
    input.value = '';
});

document.querySelectorAll('#KeepingSafe input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function(event) {
        handleCheckbox(event, 'KeepingSafeItems');
    });
});

document.querySelectorAll('#SecuringEnvironment input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function(event) {
        handleCheckbox(event, 'SecuringEnvironmentItems');
    });
});

document.querySelectorAll('#FlexibleWorkplace input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function(event) {
        handleCheckbox(event, 'FlexibleWorkplaceItems');
    });
});

document.getElementById('Logo').addEventListener('click', function() {
    document.getElementById('LogoUploadButton').click();
});

function handleCheckbox(ev, checklistId) {
    var span = ev.target.parentNode.querySelector('span');
    if (!span.id) return;
    if (ev.target.checked ) {
        document.getElementById(span.id).style.textDecoration = 'line-through';
        document.getElementById(span.id).style.fontStyle = 'italic';
        addItemToChecklist(span.innerHTML, checklistId, span.id);
    } else {
        var el = document.getElementById('Output_' + span.id)
        el.parentNode.removeChild(el);
        document.getElementById(span.id).style.textDecoration = 'none';
        document.getElementById(span.id).style.fontStyle = 'normal';
    }
}

function loadImageFile(event) {
    document.getElementById('Logo').src = URL.createObjectURL(event.target.files[0]);
}

function addItemToChecklist(text, parentId, sourceId) {
    var id = sourceId || new Date().getTime();

    var item = document.createElement('div');
    item.id = 'Output_' + id;
    item.classList = 'checklist-item';
    
    var textEl = document.createElement('p');
    textEl.innerHTML = text;
    textEl.setAttribute('contenteditable',true);
    item.append(textEl);

    var button = document.createElement('button');
    button.innerHTML = 'Remove';
    button.setAttribute('data-id', 'Output_' + id);
    button.setAttribute('data-source-id', sourceId);
    button.onclick = function() {
        var id = this.getAttribute('data-id');
        var sourceId = this.getAttribute('data-source-id');
        var element = document.getElementById(id);
        element.parentNode.removeChild(element);
        if (sourceId && sourceId !== 'undefined') {
            console.log('source id',sourceId);
            document.getElementById(sourceId).style.textDecoration = 'none';
            document.getElementById(sourceId).style.fontStyle = 'normal';
            console.log('document.getElementById(sourceId).parentNode',document.getElementById(sourceId).parentNode);
            document.getElementById(sourceId).parentNode.querySelector('input').checked = false;
        }
    };
    item.append(button);
    document.getElementById(parentId).append(item);
}

function handlePrint() {
    window.print();
    return false;
}

// track printing using dialogue
if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
        if (!mql.matches) {
            trackPrint();
        };
    });
}

function trackPrint() {
    if (!gtag) return;
    gtag('event', 'print', {
        'event_category': 'Interaction'
    });
}