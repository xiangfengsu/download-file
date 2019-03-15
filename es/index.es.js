var index = (function (fileUrl, fileName, opts) {
    if (!fileUrl) {
        throw new Error("fileUrl is required");
    }
    if (!fileName) {
        throw new Error("fileName is required");
    }
    function dataURIToBlob(dataURI) {
        var binStr = atob(dataURI.split(",")[1]);
        var len = binStr.length;
        var arr = new Uint8Array(len);
        var mimeString = dataURI
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }
        return new Blob([arr], {
            type: mimeString,
        });
    }
    function createFileReader(blob, ev) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var dataBlob = dataURIToBlob(event.target.result);
            var url = URL.createObjectURL(dataBlob);
            var elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = url;
            document.body.appendChild(elink);
            elink.click();
            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 4e4);
            document.body.removeChild(elink);
            if (opts && opts.success) {
                opts.success(ev);
            }
        };
        reader.readAsDataURL(blob);
    }
    function handleEvent(ev, xhr) {
        switch (ev.type) {
            case "progress":
                if (opts && opts.progress) {
                    opts.progress(ev);
                }
                break;
            case "loadend":
                if (opts && opts.complete) {
                    opts.complete(ev);
                }
                break;
            case "readystatechange":
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var blob = xhr.response;
                        createFileReader(blob, ev);
                    }
                    else {
                        if (opts && opts.failed) {
                            opts.failed(ev);
                        }
                    }
                }
                break;
            default:
                throw new Error("addListeners type error");
        }
    }
    function addListeners(xhr) {
        xhr.addEventListener("progress", function (ev) {
            handleEvent(ev, xhr);
        }, false);
        xhr.addEventListener("loadend", function (ev) {
            handleEvent(ev, xhr);
        }, false);
        xhr.addEventListener("readystatechange", function (ev) {
            handleEvent(ev, xhr);
        }, false);
    }
    function runXHR(url) {
        var xhr = new XMLHttpRequest();
        addListeners(xhr);
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }
    runXHR(fileUrl);
});

export default index;
