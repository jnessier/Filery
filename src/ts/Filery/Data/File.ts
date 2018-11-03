export class File {

    private readonly url: string;
    private readonly name: string;
    private readonly size: number;
    private readonly time: number;
    private readonly extension: string;
    private readonly type: string;

    constructor(url: string, name: string, size: any, time: any, extension: string, type: string) {
        this.url = url;
        this.name = name;
        this.size = size;
        this.time = time;
        this.extension = extension;
        this.type = type;
    }

    public getName(): string {
        return this.name;
    }

    public getUrl(): string {
        return this.url;
    }

    public getExtension(): string {
        return this.extension;
    }

    public getType(): string {
        return this.type;
    }

    public getFormattedSize(decimals = 2) {
        if (this.size === 0) {
            return '0 Bytes';
        }

        let k = 1024,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(this.size) / Math.log(k));
        return parseFloat((this.size / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }

    public getFormattedTime() {
        let date = new Date(this.time * 1000),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes();

        return date.getFullYear() + '-' + ((month < 10 ? '0' : '') + month) + '-' + ((day < 10 ? '0' : '') + day) + ' ' + ((hour < 10 ? '0' : '') + hour) + ':' + ((minute < 10 ? '0' : '') + minute);
    }
}