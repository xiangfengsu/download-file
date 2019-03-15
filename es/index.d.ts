interface InterfaceHandleOptions {
    progress?(ev: ProgressEvent): void;
    success?(ev: ProgressEvent): void;
    failed?(ev: ProgressEvent): void;
    complete?(ev: ProgressEvent): void;
}
declare const _default: (fileUrl: string, fileName: string, opts?: InterfaceHandleOptions) => void;
export default _default;
