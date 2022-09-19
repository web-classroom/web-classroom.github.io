Reveal.initialize({
    controls: true,
    width: 1200,
    height: 700,
    margin: 0.1,
    minScale: 0.2,
    maxScale: 2.0,
    progress: true,
    slideNumber: true,
    history: true,
    keyboard: true,
    overview: true,
    center: true,
    touch: true,
    loop: false,
    rtl: false,
    shuffle: false,
    fragments: true,
    embedded: false,
    help: true,
    showNotes: false,
    autoPlayMedia: null,
    autoSlide: 0,
    autoSlideStoppable: true,
    autoSlideMethod: Reveal.navigateNext,
    mouseWheel: false,
    hideAddressBar: true,
    previewLinks: false,
    transitionSpeed: 'default', 
    backgroundTransition: 'fade',
    viewDistance: 3,
    parallaxBackgroundImage: '',
    parallaxBackgroundSize: '',
    parallaxBackgroundHorizontal: null,
    parallaxBackgroundVertical: null,
    display: 'block',
    dependencies: [
        { src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.7.0/plugin/markdown/marked.js' },
        { src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.7.0/plugin/markdown/markdown.js' },
        { src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.7.0/plugin/highlight/highlight.js', async: true, callback: function () { hljs.initHighlightingOnLoad(); } },
    ],
    markdown: {
        smartypants: true
    }
});
Reveal.configure({
    pdfMaxPagesPerSlide: 1
});
