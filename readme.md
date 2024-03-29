## Install

```
$ npm install down-file -S  或者 yarn add down-file
```

## Usage


```js
import downloadFile from 'down-file';

downloadFile('http://domain.asset.test.png','test.png',{
    progress(e){
        console.log(e)
    },
    success(e){
        console.log(e)
    },
    failed(e){
        console.log(e)
    },
    complete(e){
        console.log(e)
    }
},{token:'123'})

```

## API

### downloadFile(fileUrl,fileName,[options],headers)

#### fileUrl 

Type: `string`

文件下载地址

#### fileName 

Type: `string`

下载文件保存的名字，注意，需要带文件对应的扩展名 如果 .jpg .zip 等

#### options

Type: `Object`

##### progress

Type: `function`

文件下载的进度回调函数，参数是 ProgressEvent 类型，可以获取文件的总大小，和当前已下载的大小  

`注意 使用该方法需服务端设置响应头，文件的大小 Content-Length 属性, eg: ctx.set('Content-Length', file.size)`


##### success

Type: `function`

文件下载成功的回调函数，参数是 ProgressEvent 类型

##### failed

Type: `function`

文件下载失败的回调函数，参数是 ProgressEvent 类型

##### complete

Type: `function`

文件下载无论成功还是失败回调函数，参数是 ProgressEvent 类型

#### headers 

Type: `object`

http headers to post, available in modern browsers


