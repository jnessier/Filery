import * as request from 'superagent';
import {File} from './Model/File';

export class ApiClient {

    static url: string;

    static setUrl(url: string) {
        this.url = url;
    }

    protected static handleError(error) {
        try {
            return Promise.reject(JSON.parse(error.response.text).error);
        } finally {
            // Nothing
        }
        return Promise.reject(error.message);
    }

    static async fetchFiles(dir?: string) {
        return await request
            .get(this.url)
            .query({
                'dir': dir,
            })
            .then((response) => {
                let files = new Array<File>();
                response.body.forEach((value) => {
                    files.push(new File(value.url, value.name, value.size, value.time, value.extension, value.type));
                });
                return files;
            })
            .catch(this.handleError);
    }

    static async uploadFile(fileData: any, dir?: string) {
        return await request
            .post(this.url)
            .set('content-type', 'application/json')
            .query({
                'dir': dir,
            })
            .send({
                'file': fileData,
            })
            .on('error', (error) => {
                return {
                    status: false,
                    message: error,
                    data: {}
                };
            })
            .then(res => {
                return res.body;
            });
    }

    static async deleteFile(file: File, dir?: string) {
        return await request
            .delete(this.url)
            .query({
                'dir': dir,
                'fileName': file.getName(),
            })
            .then((response) => {
                return true;
            })
            .catch(this.handleError);
    }

}