import * as request from 'superagent';
import {File} from './Model/File';

declare var tinymce: any;

export class ApiClient {

    static url: string;

    static setUrl(url: string) {
        this.url = url;
    }

    protected static handleError(error) {
        let message = error.message;
        try {
            message = JSON.parse(error.response.text).error;
        } finally {
            // Nothing
        }
        return Promise.reject(
            tinymce.i18n.translate(message)
        );
    }

    static async read(dir?: string) {
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

    static async upload(fileData: any, dir?: string) {

        let formData = new FormData();
        formData.append('file', fileData);

        return await request
            .post(this.url)
            //  .set('content-type', 'application/json')
            .query({
                'dir': dir,
            })
            .send(formData)
            .then((response) => {
                return new File(response.body.url, response.body.name, response.body.size, response.body.time, response.body.extension, response.body.type);
            })
            .catch(this.handleError);
    }

    static async delete(file: File, dir?: string) {
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