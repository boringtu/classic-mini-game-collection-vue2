function defaultEquals(a, b) {
	return a === b;
}

export class Node {
	constructor(element, next) {
		this.element = element;
		this.next = next;
	}
}
export class DoublyNode extends Node {
	constructor(element, next, prev) {
		super(element, next);
		this.prev = prev;
	}
}

export class LinkedList {
	constructor(equalsFn = defaultEquals) {
		this.equalsFn = equalsFn;
		this.count = 0;
		this.head = undefined;
	}
	// 将一个 Array 对象转换成一个 LinkedList 对象
	static converts(arr, equalsFn) {
		const list = new LinkedList(equalsFn);
		for (const item of arr) list.push(item);
		return list;
	}
	// 在链表尾部添加一个元素
	push(element) {
		const node = new Node(element);
		let current;
		if (!this.head) {
			this.head = node;
		} else {
			current = this.head;
			while (current.next) {
				current = current.next;
			}
			current.next = node;
		}
		this.count++;
	}
	// 获取下标为 index 的元素
	getElementAt(index) {
		if (index < 0 || index > this.count) return undefined;
		let node = this.head;
		for (let i = 0; i < index && node; i++) {
			node = node.next;
		}
		return node;
	}
	// 在下标为 index 的位置处插入一个元素
	insert(element, index = 0) {
		if (index < 0 || index > this.count) return false;
		const node = new Node(element);
		if (index === 0) {
			const current = this.head;
			node.next = current;
			this.head = node;
		} else {
			const previous = this.getElementAt(index - 1);
			node.next = previous.next;
			previous.next = node;
		}
		this.count++;
		return true;
	}
	removeAt(index) {
		if (index >= 0 && index < this.count) {
			let current = this.head;
			if (index === 0) {
				this.head = current.next;
			} else {
				const previous = this.getElementAt(index - 1);
				current = previous.next;
				previous.next = current.next;
			}
			this.count--;
			return current.element;
		}
		return undefined;
	}
	remove(element) {
		const index = this.indexOf(element);
		return this.removeAt(index);
	}
	indexOf(element) {
		let current = this.head;
		for (let i = 0; i < this.size() && current; i++) {
			if (this.equalsFn(element, current.element)) {
				return i;
			}
			current = current.next;
		}
		return -1;
	}
	isEmpty() {
		return this.size() === 0;
	}
	size() {
		return this.count;
	}
	getHead() {
		return this.head;
	}
	clear() {
		this.head = undefined;
		this.count = 0;
	}
	toString() {
		if (!this.head) return '';
		let objString = `${this.head.element}`;
		let current = this.head.next;
		for (let i = 1; i < this.size() && current; i++) {
			objString = `${objString},${current.element}`;
			current = current.next;
		}
		return objString;
	}
	toArray() {
		let current = this.head;
		const arr = [];
		while (current) {
			arr.push(current.element);
			current = current.next;
		}
		return arr;
	}
}

export class DoublyLinkedList extends LinkedList {
	constructor(equalsFn = defaultEquals) {
		super(equalsFn);
		this.tail = undefined;
	}
	// 将一个 Array 对象转换成一个 DoublyLinkedList 对象
	static converts(arr, equalsFn) {
		const list = new DoublyLinkedList(equalsFn);
		for (const item of arr) list.push(item);
		return list;
	}
	push(element) {
		const node = new DoublyNode(element);
		if (!this.head) {
			this.head = node;
			this.tail = node;
		} else {
			this.tail.next = node;
			node.prev = this.tail;
			this.tail = node;
		}
		this.count++;
	}
	// 在下标为 index 的位置处插入一个元素，或插入一段链表
	insert(element, index = this.count) {
		if (index < 0 || index > this.count) return false;
		if (element instanceof DoublyLinkedList) {
			// 插入一段链表
			const list = element;
			const first = list.head;
			const last = list.tail;
			if (index === 0) {
				last.next = this.head;
				if (this.head) this.head.prev = last;
				this.head = first;
				if (!this.size()) this.tail = last;
			} else if (index === this.count) {
				first.prev = this.tail;
				this.tail.next = first;
				this.tail = last;
			} else {
				const previous = this.getElementAt(index - 1);
				const following = previous.next;
				previous.next = first;
				first.prev = previous;
				last.next = following;
				following.prev = last;
			}
			this.count += list.size();
		} else {
			// 插入一个元素
			const node = new DoublyNode(element);
			let current = this.head;
			if (index === 0) {
				if (!this.head) {
					this.head = node;
					this.tail = node;
				} else {
					node.next = this.head;
					this.head.prev = node;
					this.head = node;
				}
			} else if (index === this.count) {
				current = this.tail;
				current.next = node;
				node.prev = current;
				this.tail = node;
			} else {
				const previous = this.getElementAt(index - 1);
				current = previous.next;
				node.next = current;
				previous.next = node;
				current.prev = node;
				node.prev = previous;
			}
			this.count++;
		}
		return true;
	}
	removeAt(index) {
		if (index >= 0 && index < this.count) {
			let current = this.head;
			if (index === 0) {
				this.head = this.head.next;
				// if there is only one item, then we update tail as well //NEW
				if (this.count === 1) {
					// {2}
					this.tail = undefined;
				} else {
					this.head.prev = undefined;
				}
			} else if (index === this.count - 1) {
				// last item //NEW
				current = this.tail;
				this.tail = current.prev;
				this.tail.next = undefined;
			} else {
				current = this.getElementAt(index);
				const previous = current.prev;
				// link previous with current's next - skip it to remove
				previous.next = current.next;
				current.next.prev = previous; // NEW
			}
			this.count--;
			return current.element;
		}
		return undefined;
	}
	indexOf(element) {
		let current = this.head;
		let index = 0;
		while (!current) {
			if (this.equalsFn(element, current.element)) {
				return index;
			}
			index++;
			current = current.next;
		}
		return -1;
	}
	getHead() {
		return this.head;
	}
	getTail() {
		return this.tail;
	}
	clear() {
		super.clear();
		this.tail = undefined;
	}
	toString() {
		if (!this.head) return '';
		let objString = `${this.head.element}`;
		let current = this.head.next;
		while (current) {
			objString = `${objString},${current.element}`;
			current = current.next;
		}
		return objString;
	}
	inverseToString() {
		if (!this.tail) return '';
		let objString = `${this.tail.element}`;
		let previous = this.tail.prev;
		while (previous) {
			objString = `${objString},${previous.element}`;
			previous = previous.prev;
		}
		return objString;
	}
	reverse() {
		let current = this.tail;
		[this.head, this.tail] = [this.tail, this.head];
		while (current) {
			[current.prev, current.next] = [current.next, current.prev];
			current = current.next;
		}
		return this;
	}
}
