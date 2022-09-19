var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = window.location.search.match(/print-pdf/gi) ? 'https://cdn.jsdelivr.net/npm/reveal.js@3.7.0/css/print/pdf.css' : 'https://cdn.jsdelivr.net/npm/reveal.js@3.7.0/css/print/paper.css';
document.getElementsByTagName('head')[0].appendChild(link);