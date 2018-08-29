import * as request from 'superagent';
import {File} from './Model/File';

export class ApiClient {

    static baseUrl: string;

    static setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    static async fetchFiles(dir?: string) {
        return await request.get(this.baseUrl)
            .query({
                'action': 'fetch',
                'dir': dir,
            })
            .on('error', (error) => {
                return {
                    status: false,
                    message: error,
                    data: {}
                };
            })
            .then(res => {
                let result = res.body;
                result.data.forEach((value, index) => {
                    result.data[index] = new File(value.url, value.name, value.size, value.time, value.extension, value.type);
                });
                return result;
            });
    }

    static async uploadFile(fileData: any, dir?: string) {
        return await request('POST', this.baseUrl)
            .withCredentials()
            .query({
                'action': 'upload',
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
                return JSON.parse(res.body);
            });
    }

    static async deleteFile(file: File, dir?: string) {
        return await request('GET', this.baseUrl)
            .withCredentials()
            .query({
                'action': 'delete',
                'dir': dir,
                'fileName': file.getName(),
            })
            .on('error', (error) => {
                return {
                    status: false,
                    message: error,
                    data: {}
                };
            });
    }

}