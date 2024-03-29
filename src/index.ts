interface InterfaceHandleOptions {
  progress?(ev: ProgressEvent): void;
  success?(ev: ProgressEvent): void;
  failed?(ev: ProgressEvent): void;
  complete?(ev: ProgressEvent): void;
}

type IHeaders = {
  [key: string]: any;
};

export default (
  fileUrl: string,
  fileName: string,
  opts?: InterfaceHandleOptions,
  headers: IHeaders={} ,
): void => {
  if (!fileUrl) {
    throw new Error('fileUrl is required');
  }
  if (!fileName) {
    throw new Error('fileName is required');
  }

  function dataURIToBlob(dataURI: string): Blob {
    const binStr = atob(dataURI.split(',')[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

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
      try {
        const dataBlob = dataURIToBlob(event.target.result);
        const url = URL.createObjectURL(dataBlob);

        const elink = document.createElement('a') as HTMLAnchorElement;
        elink.download = fileName;
        elink.style.display = 'none';
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
      } catch (error) {
        console.log(error);
        opts.failed(ev);
        throw new Error(error);
      }
    };
    reader.readAsDataURL(blob);
  }

  function handleEvent(ev: ProgressEvent, xhr: XMLHttpRequest): void {
    switch (ev.type) {
      case 'progress':
        if (opts && opts.progress) {
          opts.progress(ev);
        }
        break;
      case 'loadend':
        if (opts && opts.complete) {
          opts.complete(ev);
        }
        break;
      case 'readystatechange':
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
        throw new Error('addListeners type error');
    }
  }

  function addListeners(xhr: XMLHttpRequest): void {
    xhr.addEventListener(
      'progress',
      (ev: ProgressEvent) => {
        handleEvent(ev, xhr);
      },
      false,
    );
    xhr.addEventListener(
      'loadend',
      (ev: ProgressEvent) => {
        handleEvent(ev, xhr);
      },
      false,
    );
    xhr.addEventListener(
      'readystatechange',
      (ev: ProgressEvent) => {
        handleEvent(ev, xhr);
      },
      false,
    );
  }

  function runXHR(url: string): void {
    const xhr = new XMLHttpRequest();
    addListeners(xhr);
    xhr.open('GET', url);

    // when set headers['X-Requested-With'] = null , can close default XHR header
    // see https://github.com/react-component/upload/issues/33
    if (headers['X-Requested-With'] !== null) {
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    for (const h in headers) {
      if (headers.hasOwnProperty(h) && headers[h] !== null) {
        xhr.setRequestHeader(h, headers[h]);
      }
    }

    xhr.responseType = 'blob';
    xhr.send();
  }

  runXHR(fileUrl);
};
