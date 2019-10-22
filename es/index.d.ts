interface InterfaceHandleOptions {
    progress?(ev: ProgressEvent): void;
    success?(ev: ProgressEvent): void;
    failed?(ev: ProgressEvent): void;
    complete?(ev: ProgressEvent): void;
}
declare type IHeaders = {
    [key: string]: any;
};
declare const _default: (fileUrl: string, fileName: string, opts?: InterfaceHandleOptions, headers?: IHeaders) => void;
export default _default;
