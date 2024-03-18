class CWisp {
    constructor(WispUrl, logging = false) {
        this.WispUrl = WispUrl;
        this.logging = logging;
        this.ready = false;
    }
    init(){
        libcurl.set_websocket(this.WispUrl);
        this.ready = true;
    }
    link(){
        const f = this.#restoreFetch();
        window.fetch = async (url, options) => {
            if(!url.startsWith("http://localhost") && !url.startsWith("https://localhost") && !url.startsWith("http://127.0.0.1") && !url.startsWith("https://127.0.0.1") && !url.startsWith("/")) {
                if(this.logging) {console.log("libcurl: ", url, options)};
                if(typeof options !== "undefined") {
                    if(typeof options.headers !== "undefined") {
                        options.headers = Object.assign({}, options.headers);
                    }
                }
                return libcurl.fetch(url, options);
            } else {
                if(this.logging) {console.log("fetch: ", url, options)};
                return f(url, options);
            }
        };
    }
    #restoreFetch() {
        if (!window._restoredFetch) {
            const iframe = document.createElement('iframe');
    
            iframe.style.display = 'none';
            document.head.appendChild(iframe); // add element
    
            window._restoredFetch = iframe.contentWindow.fetch;
        }
    
        return window._restoredFetch;
    }
}