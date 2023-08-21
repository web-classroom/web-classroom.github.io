
let EvalJavaScript = {
    id: "eval",
    init: (deck) => {
        document.querySelectorAll("pre code.javascript").forEach((block) => {
            block.addEventListener("dblclick", (e) => {
                e.preventDefault();
                const code = block.textContent;
                
                console.log("🚀 Evaluating code:");
                console.log(code);
                try {
                    eval(code);
                } catch (err) {
                    console.error(err);
                } finally {
                    console.log("✅ Done");
                }
            });
        });
    }
};

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
    plugins: [RevealMarkdown, RevealHighlight, EvalJavaScript, RevealNotes],
    showNotes: true,
    markdown: {
        smartypants: true
    },
});

Reveal.configure({
    pdfMaxPagesPerSlide: 1,
});
