const findDiv = document.getElementById("findDiv");
const selectDiv = document.getElementById("selectDiv");
let findForm = document.getElementById("findForm");
let findInput = document.getElementById("findInput");
const vectorDiv = document.getElementById("vectorDiv");
let optionsDiv = document.querySelector('.options');
let fo = [];


function vectorFuns(vectorDiv) {
	vectorDiv.addEventListener("submit", event => {
        event.preventDefault();

        let vec1 = document.getElementById('vector1').value;
        let vec2 = document.getElementById('vector2').value;
        let vec3 = document.getElementById('vector3').value;

		let val = vec1 + '_' + vec2 + ' ' + vec3;


		if (val) {
			const url = `learning/${val}`
			fetch(url, {
				method: 'GET',
				credentials: "same-origin",
				headers: {
				"X-Requested-With": "XMLHttpRequest",
				}
			})
			.then(response => response.json())
			.then(data => {
                
                if (data.status) {
                    
                    a = document.getElementById('res');
                    if (a) {
                        a.remove();
                    }
                    vectorDiv.innerHTML += `<h4 id="res">Вероятность произрастания: ${data.body}</h4>`;

                } else {
                    vectorDiv.innerHTML += `<h4 id="res">Вероятность произрастания: 0</h4>`;
                }
            })
        }
    })
};



function removeOptions() {
    if (optionsDiv) {
        optionsDiv.remove();
    }
}


function optionsToInput() {

        removeOptions();
		const val = findInput.value.trim();

		if (val) {
			const url = `options_to_input/${val}`
			fetch(url, {
				method: 'GET',
				credentials: "same-origin",
				headers: {
				"X-Requested-With": "XMLHttpRequest",
				}
			})
			.then(response => response.json())
			.then(data => {
                
                if (data.status) {

                    findDiv.innerHTML += '<div class="options"></div>';
                    optionsDiv = document.querySelector('.options');

                    console.log(optionsDiv)

                    for (let i = 0; i < data.body.length; i++) {
                        optionsDiv.innerHTML += `<p onclick="addToInput('${data.body[i]}')">${data.body[i]}</p>`;
                    }

                    findInput = document.querySelector("#findInput");
				    findInput.value = val;
				    findInput.focus();
				    findInput.addEventListener("input", optionsToInput);
                    // findInput.addEventListener("submit", find);
                    findForm = document.querySelector("#findForm");
                    find(findForm);
                }
            })
        }
};



function addToInput(value) {
    let findInput_1 = document.querySelector("#findInput");
    findInput_1.value = value;
    removeOptions();
}



// AJAX find
function find(form) {
    form.addEventListener("submit", event => {

        event.preventDefault();
        const val = findInput.value;

        removeOptions();

        findInput.value = '';

        if (val) {
            const result = document.getElementById("result");

            result.innerHTML = '<div id="loading"><h4>Загрузка...</h4></div>';
            selectDiv.innerHTML = "";
            const url = `find/${val}`;

            fetch(url, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                "X-Requested-With": "XMLHttpRequest",
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    result.innerHTML = `<div id="loading"><h4>Найдено растений: ${data.body.length}</h4></div>`;


                    fo = [];

                    for (let i = 0; i < data.body.length; i++) {

                        let lst = data.body[i].FO.split(",");
                        for (let i = 0; i < lst.length; i++) {
                            let item = lst[i];
                            item = item.trim();
                            if (!fo.includes(item)) {
                                fo.push(item);
                            }
                        }

                        result.innerHTML += `
                        <div id="${data.body[i].pk}" class="item">
                            <div class="leftColumn">
                                <p>${data.body[i].name}</p>
                            </div>

                            <div class="rightColumn">
                                <p><strong>Федеральный округ:</strong> ${data.body[i].FO}</p>
                                <p><strong>Почва:</strong> ${data.body[i].ground}</p>
                                <p><strong>Химический состав:</strong> ${data.body[i].chem}</p>
                                <p><strong>Препараты с веществом:</strong> ${data.body[i].drugs}</p>
                            </div>
                        </div>`;
                    }

                    selectDiv.innerHTML = `
                    <label id="selectLabel" for="select">Федеральный округ</label>
                    <select id="select" onchange="selectFunc(this.options[this.selectedIndex].value)">
                        <option>все округа</option>
                    </select>`;

                    let select = selectDiv.getElementsByTagName('select')[0];

                    for (let i = 0; i < fo.length; i++) {
                        select.innerHTML += `<option>${fo[i]}</option>`;
                    }

                } else {
                    result.innerHTML = '<div id="loading"><h4>Мы ничего не нашли</h4></div>';
                }
            })
        }
    });
};


function selectFunc(value) {

    let items = document.getElementsByClassName('item');

    if (value === 'все округа') {
        for (let i = 0; i < items.length; i++) {
            items[i].style.display = '';
        }   
    } else {
        for (let i = 0; i < items.length; i++) {
            let f = items[i].getElementsByClassName('rightColumn')[0].firstElementChild.textContent;

            if (f.includes(value)) {
                items[i].style.display = '';
            } else {
                items[i].style.display = 'none';
            }
        }
    }
}

findInput.addEventListener("input", optionsToInput);
find(findForm);
vectorFuns(vectorDiv);
