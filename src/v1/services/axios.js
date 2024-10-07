
/**
 * Axios class for sending get/post request
 * @version 1.0
 * @author GooDu-Dev <https://github.com/GooDu-dev>
 */

import * as constant from '../utils/constant.js';

class Axios {
    /**
     * Sends post request to backend with specific path and provided params
     * @param {string} path 
     * @param {object} body 
     * @returns {object | null}
    **/
    post(path, body = {"method": 'post'}) {
        // check is valid path and body
        const _url = constant.API_URL + path
        const isPath = this.#checkPath(_url)
        const isBody = this.#checkBodyOrParams(body)

        const options = {
            method: 'POST',
            header: {
                'Content-Type': "application/json",
            },
            body: body,
            credentials: 'include',
            referrerPolicy: 'no-referrer'
        }

        if(!isPath || !isBody){
            console.log("Invalid request path or body")
            return null
        }
        if(body instanceof FormData){
            options.header['Content-Type'] = 'multipart/form-data'
        }

        return fetch(_url, options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if(!response){
                    throw new Error("Something went wrong")
                }
                if(response.status !== "success"){
                    throw new Error(response)
                }
                return response
            })
            .catch(err => {
                console.log(err)
                return null
            })
    }
    /**
     * Sends get request to backend with specific path and provided params 
     * 
     * @param {string} path 
     * @param {object} params 
     * @returns {object | null}
     */
    get(path, params) {
        // check is valid path and params
        const isPath = this.#checkPath(path)

        if(!isPath){
            console.log("Invalid request path or params")
            return null
        }
        
        let queryParams = new URLSearchParams(params).toString()
        if(params){
            queryParams = "?" + queryParams;
        }
        return  fetch(constant.API_URL + path + `${queryParams}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json', // adjust as necessary
            },
            credentials: 'include',
            referrerPolicy: 'no-referrer'
        })
            .then(response => response.json())
            .then(response => {
                if(!response){
                    throw new Error("Something went wrong")
                }
                if(response.status !== "success"){
                    throw new Error(response)
                }
                return response
            })
            .catch(err => {
                console.log(err)
                return null
            }) 
    }

    /**
     * Check is path valid for sending to backend
     * @param {string} path 
     * @returns {boolean}
     */
    #checkPath(path) {
        if(typeof(path) !== "string") {
            console.log("Invalid request path") // remove this later
            return false
        }
        return true
    }
    /**
     * Check is body or params is valid for sending to backend
     * @param {object} body 
     * @returns {boolean}
     */
    #checkBodyOrParams(body) {
        if(typeof(body) != "object" && body !== null && !Array.isArray(body)) {
            console.log("Invalid request body") // remove this later
            return false
        } 
        return true
    }
}

// initiate instance
const _axios = new Axios()

// export the class instance
export default _axios