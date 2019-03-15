const downloadFile = require('../dist/index.js');

beforeAll(()=>{

  // document.body.innerHTML = `<button>下载</button>`;
})

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
  it('Test download success', done => {
    // console.log(document.body.innerHTML);
    const fn = jest.fn();
    downloadFile(
      'http://img.souche.com/files/default/21460c50f16c4d8f0d4bf91873b99d84111.jpg',
      'test.png',
      {
        success(ev) {
          
          
        },
        complete(ev) {
          
          expect(fn).not.toBeCalled();
          done();
         
          // console.log("complete");
        }
      },
    );
  });
});
