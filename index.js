
var needSave = false;

function strip(html) {
   let doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
}

function setCursorEditable(editableElem, position) {

	if (editableElem.childNodes.length == 0) return;

	let range = document.createRange();
	let sel = window.getSelection();
	range.setStart(editableElem.childNodes[editableElem.childNodes.length - 1], position);
	range.collapse(true);

	sel.removeAllRanges();
	sel.addRange(range);
	editableElem.focus();
}

function saveTodos() {

	console.log('Saving todos...');

	todos = [];

	const todoElements = document.querySelectorAll('.todo').forEach(element => {
		const text = element.querySelector('.todo-text').innerText;
		todos.push(text);
	});

	localStorage.setItem('todos', JSON.stringify(todos));

}

function loadTodos() {

	console.log('Loading todos...');

	const todosJSON = localStorage.getItem('todos');
	if (!todosJSON) return;

	const todos = JSON.parse(todosJSON);

	todos.forEach(text => {
		addNewTodoItem().querySelector('.todo-text').innerText = text;
	});

}

function updateIndexes() {

	needSave = true;

	const indexElements = document.querySelectorAll('.todo-index');

	let index = 1;
	for (const element of indexElements) {
		element.innerText = '' + index + '.';
		index++;
	}

}

function addNewTodoItemIfNeeded() {

	const todoTextElements = document.querySelectorAll('.todo-text');
	if (todoTextElements.length == 0) {
		addNewTodoItem();
		return;
	}

	const todoTextElement = todoTextElements[todoTextElements.length - 1];

	if (todoTextElement.innerText.trim().length != 0) {
		addNewTodoItem();
	}

}

function addNewTodoItem() {

	needSave = true;

	const todosElement = document.querySelector('.todos');

	const todoElement = document.createElement('div');
	todoElement.innerHTML =
	`<div class="todo">
		<div class="todo-left">
			<span class="todo-button todo-remove-button">
				<i class="fa fa-trash-o" aria-hidden="true"></i>
			</span>
			<span class="todo-index"></span>
		</div>
		<span class="todo-text" role="textbox" title="Todo text" contenteditable></span>
	</div>`;

	const todoTextElement = todoElement.querySelector('.todo-text');
	todoTextElement.oninput = e => {

		needSave = true;

		// const stripped = strip(e.target.innerText);
		// e.target.innerText = stripped;

		// let newCursorPosition = 0;

		// if (e.target.childNodes.length > 0)
		// 	newCursorPosition = e.target.childNodes[e.target.childNodes.length - 1].length;

		// setCursorEditable(e.target, newCursorPosition);
		addNewTodoItemIfNeeded();

	};

	todoTextElement.onpaste = (e) => {
		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain');
		document.execCommand("insertHTML", false, text);
	};

	const todoRemoveButtonElement = todoElement.querySelector('.todo-remove-button');

	todoRemoveButtonElement.onclick = e => {
		needSave = true;
		todoElement.remove();
		addNewTodoItemIfNeeded();
		updateIndexes();
	};

	todosElement.appendChild(todoElement);
	updateIndexes();

	return todoElement;

}


document.addEventListener("DOMContentLoaded", () => {

	loadTodos();
	addNewTodoItemIfNeeded();

	setInterval(() => {
		if (needSave) {
			needSave = false;
			saveTodos();
		}
	}, 100);

});
