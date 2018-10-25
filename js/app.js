(function (window) {
	var ajax = axios.create({
		baseURL: 'http://localhost:8080/todos'
	});
	const todoList = document.querySelector('.todo-list');
	const newTodo = document.querySelector('.new-todo');
	const toggleAll = document.querySelector('.toggle-all');
	const clearAll = document.querySelector('.clear-completed');
	const filters = document.querySelector('.filters');

	// 渲染列表
	function createList() {

		ajax.get('/getDataAll').then(result => {
			const data = result.data.data;
			const num = document.querySelector('.todo-count strong');
			let sum = 0;
			data.forEach(e => {
				if (e.isFinish === '0') {
					sum++;
				}
			});
			num.innerText = sum;
			todoList.innerHTML = template('tpl', { list: data });

			const hash = window.location.hash;
			const views = todoList.querySelectorAll('li');
			// createList();
			if (hash === '#/active') {
				views.forEach(e => {
					if (e.classList.contains('completed')) {
						e.style.display = 'none';
					}
				});
			} else if (hash === '#/completed') {
				views.forEach(e => {
					if (!e.classList.contains('completed')) {
						e.style.display = 'none';
					}
				});
			} 
			// else if (hash === '#/') {
			// 	ajax.get('/getDataAll').then(result => {
			// 		const data = result.data.data;
			// 		const num = document.querySelector('.todo-count strong');
			// 		let sum = 0;
			// 		data.forEach(e => {
			// 			if (e.isFinish === '0') {
			// 				sum++;
			// 			}
			// 		});
			// 		num.innerText = sum;
			// 		todoList.innerHTML = template('tpl', { list: data });
			// 	});
			// }
		});
	}

	createList();

	// 添加新的任务
	newTodo.addEventListener('keydown', function (e) {
		if (e.keyCode == 13) {
			const val = this.value;
			ajax.post('/addTodo', { content: val, isFinish: 0 }).then(result => {
				createList();
				this.value = '';
			})
		}
	});

	todoList.addEventListener('click', function (e) {
		const id = e.target.parentNode.getAttribute('data-id');
		const isFinish = e.target.parentNode.getAttribute('data-isfinish');
		// 删除一条任务
		if (e.target.className === 'destroy') {
			ajax.delete(`/delTodo?id=${id}`).then((result) => {
				createList();
			});
		}

		// 完成一个任务
		if (e.target.className === 'toggle') {
			e.target.parentNode.parentNode.classList.toggle('completed');
			let flag = 0;
			if (e.target.parentNode.parentNode.classList.contains('completed')) {
				flag = 1;
			}
			ajax.put('/changeStatu', { id, isFinish: flag }).then(result => {
				createList();
			});
		}
	});
	// 完成全部任务
	toggleAll.addEventListener('click', function () {
		ajax.get('/changeStatusAll?isFinish=' + this.checked).then(result => {
			createList();
		});
	});

	// 清除全部任务
	clearAll.addEventListener('click', function () {
		const views = document.querySelectorAll('.completed');
		let idArr = [];
		views.forEach(function (e) {
			idArr.push(e.querySelector('.view').getAttribute('data-id'));
		});
		ajax.delete('/delAll?id=' + idArr.toString()).then(result => {
			createList();
		});
	});

	// 地址栏改变
	window.addEventListener('hashchange', () => {
		createList();
	});



	

})(window);
