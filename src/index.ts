interface InterfaceHandleOptions {
  progress?(ev: ProgressEvent): void;
  success?(ev: ProgressEvent): void;
  failed?(ev: ProgressEvent): void;
  complete?(ev: ProgressEvent): void;
}

export default (
  fileUrl: string,
  fileName: string,
  opts?: InterfaceHandleOptions,
): void => {
  if (!fileUrl) {
    throw new Error("fileUrl is required");
  }
  if (!fileName) {
    throw new Error("fileName is required");
  }

  function dataURIToBlob(dataURI: string): Blob {
    const binStr = atob(dataURI.split(",")[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    const mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], {
      type: mimeString,
    });
  }
  function createFileReader(blob: Blob, ev: ProgressEvent): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const dataBlob = dataURIToBlob(event.target.result);
      const url = URL.createObjectURL(dataBlob);
      const elink = document.createElement("a") as HTMLAnchorElement;
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = url;
      document.body.appendChild(elink);
      elink.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 4e4);
      document.body.removeChild(elink);
      if (opts && opts.success) {
        opts.success(ev);
      }
    };
    reader.readAsDataURL(blob);
  }
  function handleEvent(ev: ProgressEvent, xhr: XMLHttpRequest): void {
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
            const blob = xhr.response;
            createFileReader(blob, ev);
          } else {
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
  function addListeners(xhr: XMLHttpRequest): void {
    xhr.addEventListener(
      "progress",
      (ev: ProgressEvent) => {
        handleEvent(ev, xhr);
      },
      false,
    );
    xhr.addEventListener(
      "loadend",
      (ev: ProgressEvent) => {
        handleEvent(ev, xhr);
      },
      false,
    );
    xhr.addEventListener(
      "readystatechange",
      (ev: ProgressEvent) => {
        handleEvent(ev, xhr);
      },
      false,
    );
  }
  function runXHR(url: string): void {
    const xhr = new XMLHttpRequest();
    addListeners(xhr);
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }
  runXHR(fileUrl);
};
