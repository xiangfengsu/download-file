const sinon = require('sinon');
const downloadFile = require('../lib/index.js');

const headers = {
  'token':'123'
}

describe('Test missing fileUrl and fileName parameter exception', () => {
  it('Test missing fileUrl parameter exception', () => {
    expect(() => {
      downloadFile();
    }).toThrowError('fileUrl is required');
  });
  it('Test missing fileName parameter exception', () => {
    expect(() => {
      downloadFile('fileUrl');
    }).toThrowError('fileName is required');
  });
});

describe('Test download', () => {
  let xhr;
  let requests = [];
  const oldHandle = window.URL.createObjectURL;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function(req) {
      requests.push(req);
    };
    global.URL.createObjectURL = jest.fn();
  });
  afterEach(() => {
    xhr.restore();
    requests.length = 0;
    global.URL.createObjectURL = oldHandle;
  });

  it('Test download success', done => {
    const fn = jest.fn();
    downloadFile('./assets/fixture.pdf', 'test.pdf', {
      success(ev) {
        fn();
        expect(fn).toHaveBeenCalledTimes(2);
        done();
      },
      failed(ev) {},
      complete(ev) {
        fn();
        expect(fn).toHaveBeenCalledTimes(1);
      },
    });
    requests[0].respond(200);
  });

  it('Test download failed', done => {
    const fn = jest.fn();
    downloadFile('./assets/fixture.pdf', 'test.pdf', {
      success(ev) {},
      failed(ev) {
        fn();
        expect(fn).toHaveBeenCalledTimes(2);
        done();
      },
      complete(ev) {
        fn();
        expect(fn).toHaveBeenCalledTimes(1);
      },
    });
    requests[0].respond(404);
  });

  it('get headers', () => {
    downloadFile('./assets/fixture.pdf', 'test.pdf', {
      success(ev) {
      },
      failed(ev) {},
      complete(ev) {
      },
    },headers);

    expect(requests[0].requestHeaders).toEqual({
      "Content-Type": "text/plain;charset=utf-8",
      'X-Requested-With': 'XMLHttpRequest',
      token: '123',
    });
  });

 
});
