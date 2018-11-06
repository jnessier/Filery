import * as request from 'superagent';
import {File} from './Data/File';

declare var tinymce: any;

export class ApiClient {

    static url: string;

    static setUrl(url: string) {
        this.url = url;
    }

    protected static handleError(error) {
        let message = error.message;
        if (error.response !== undefined) {
            message = JSON.parse(error.response.text).error;
        }

        return Promise.reject(
            tinymce.i18n.translate(message)
        );
    }

    static async read(dir: string = '') {
        return await request
            .get(this.url)
            .set('X-Filery-Token', tinymce.settings.filery_api_token)
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

    static async upload(fileData: any, dir: string = '') {

        let formData = new FormData();
        if (typeof fileData.blob === 'function' && fileData.blob() instanceof Blob) {
            formData.append('file', fileData.blob(), fileData.filename());
        } else {
            formData.append('file', fileData);
        }

        return await request
            .post(this.url)
            .set('X-Filery-Token', tinymce.settings.filery_api_token)
            .query({
                'dir': dir,
            })
            .send(formData)
            .then((response) => {
                return new File(response.body.url, response.body.name, response.body.size, response.body.time, response.body.extension, response.body.type);
            })
            .catch(this.handleError);
    }

    static async delete(file: File, dir: string = '') {
        return await request
            .delete(this.url)
            .set('X-Filery-Token', tinymce.settings.filery_api_token)
            .query({
                'dir': dir,
                'name': file.getName(),
            })
            .then((response) => {
                return true;
            })
            .catch(this.handleError);
    }

}