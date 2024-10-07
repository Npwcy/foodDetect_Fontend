import _axios from "./src/v1/services/axios.js"

window.onload = function(){
    loadHistory()
}

async function loadHistory(){
    let result = await _axios.get('/items', {})
    result = result.data.result
    let content = document.querySelector('#table-content')
    for(let r of result) {
        let child = createTableRow(r)
        content.appendChild(child)
    }
}

function createTableRow(data){
    let tr = document.createElement('tr')
    for(let d in data) {
        let td = document.createElement('td')
        td.innerText = data[d]
        if(d == "name" || d == "status"){
            td.innerText = td.innerText[0].toUpperCase() + td.innerText.slice(1)
        }
        tr.appendChild(td)
    }
    return tr
}