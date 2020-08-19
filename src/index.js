import * as lib from './lib';
import { has } from '../lib/markdown-it';

const URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

const languageOverrides = {
    js: 'javascript',
    html: 'xml'
};

const md = lib.markdownit({
    html: true,
    highlight: function(code, lang) {
        if (languageOverrides[lang]) lang = languageOverrides[lang];
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, code).value;
            } catch (e) { console.log(e); }
        }
        return '';
    }
})
.use(lib.markdownitFootnote);

const update = (e) => {
    setOutput(e.getValue());

    
    let headerEle = document.querySelectorAll('h1');
    let title;
    if(headerEle.length > 0 && headerEle[0].textContent.length > 0){
        title = headerEle[0].textContent;
    }else {
        title = '마크다운 에디터 EXE';
    }
    let oldTitle = document.title;
    if(oldTitle != title){
        oldTitle =  document.title = title;
    }
}


const editor = lib.CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: "spell-checker",
    backdrop: "gfm",
    lineNumbers: false,
    matchBrackets: true,
    lineWrapping: true,
    theme: 'base16-light',
    extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
    }
});
editor.on('change', update);

const setOutput = (val) => {
    val = val.replace(/<equation>((.*?\n)*?.*?)<\/equation>/ig, function(a, b) {
        return '<img src="http://latex.codecogs.com/png.latex?' + encodeURIComponent(b) + '" />';
    });

    let out = document.getElementById('out');
    let old = out.cloneNode(true);
    out.innerHTML = md.render(val);
    //emojify.run(out);
    console.log(out.innerHTML);

};



const processQueryParams = () => {
    let params = window.location.search.split('?')[1];
    if (window.location.hash) {
        document.getElementById('readbutton').click(); // Show reading view
    }
    if (params){
        const obj = {};
        params.split('&').forEach((ele) => {
            obj[ele.split('=')[0]] = ele.split("=")[1];
        });
        if(obj.reading === 'false'){
            document.getElementById('readbutton').click(); // Hide reading view
        }
        if(obj.dark === 'true'){
            document.getElementById('nightbutton').click(); // Show night view
        }
    }
};
const openFile = () => {};


/**
 * 
 */
const run = () => {
    processQueryParams();
    if (window.location.hash) {
        let hash = window.location.hash.replace(/^#/, '');
        if (hash.slice(0, 5) == 'view:') {
            setOutput()
        } else{
            const val =  decodeURIComponent(escape(lib.RawDeflate.inflate(atob(hash))));
            editor.setValue( val);
        }
    }else if(localStorage.getItem('content')){
        editor.setValue(localStorage.getItem('content'));
    }

    editor.focus();
    document.getElementById('fileInput').addEventListener('change', openFile, false);
};

window.addEventListener("beforeunload", (e) => {

    if (!editor.getValue() || editor.getValue() == localStorage.getItem('content')) {
        return;
    }

    let confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});


run();
