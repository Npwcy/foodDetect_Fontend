
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
    post(path, body) {
        // check is valid path and body
        const isPath = this.#checkPath(path)
        const isBody = this.#checkBodyOrParams(body)

        if(!isPath || !isBody){
            console.log("Invalid request path or body")
            return null
        }

        // send post request via axios
        // need to import https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
        return fetch(constant.API_URL + path, {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(response => {
                if(!response){
                    throw new Error("Something went wrong")
                }
                if(response.status !== "success"){
                    throw new Error(response)
                }
                return response.json()
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
        const isParam = this.#checkBodyOrParams(body)

        if(!isPath || !isParam){
            console.log("Invalid request path or params")
            return null
        }
        
        const queryParams = new URLSearchParams(params).toString()

        // send get request via axios
        // need to import https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
        return  fetch(constant.API_URL + path + `?${queryParams}`)
            .then(response => {
                if(!response){
                    throw new Error("Something went wrong")
                }
                if(response.status !== "success"){
                    throw new Error(response)
                }
                return response.json()
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