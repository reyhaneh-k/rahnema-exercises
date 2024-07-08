class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
  insert(value) {
    const node = new Node(value);
    node.next = this;
    return node;
  }
  insetList(value) {
    let node = this;
    while (node.next instanceof Node) {
      node = node.next;
    }
    node.next = new Node(value);
  }
  size() {
    let counter = 0;
    let node = this;
    //do this part with recursion
    while (node instanceof Node) {
      node = node.next;
      counter++;
    }
    return counter;
  }
  at(n) {
    let node = this;
    for (let i = 0; i < n - 1; i++) {
      node = node.next;
    }
    return node;
  }
  join(seperator = ",") {
    return this.toArray().join(seperator);
  }
  map(modifier) {
    let node = this;
    while (node instanceof Node) {
      node.value = modifier(node.value);
      node = node.next;
    }
  }
  filter(filterFn) {
    let node = this;
    const resultArr = [];

    while (node instanceof Node) {
      if (filterFn(node.value)) {
        resultArr.push(node.value);
      }
      node = node.next;
    }

    const nodeArr = resultArr
      .map((x) => new Node(x))
      .map((x, i, arr) => {
        x.next = arr[i + 1];
        return x;
      });

    /* Alternatively we can use the 'toArray' method 
      and then filter the resluts for better readability*/

    //  const nodeArr = this.toArray
    //    .filter((x) => filterFn(x))
    //    .map((x) => new Node(x))
    //    .map((x, i, arr) => {
    //      x.next = arr[i + 1];
    //      return x;
    //    });

    return nodeArr[0];
  }

  find(findFn) {
    let node = this;

    while (node instanceof Node) {
      if (findFn(node.value)) {
        return node;
      }
      node = node.next;
    }
  }

  toArray() {
    let node = this;
    const resultArr = [];
    while (node instanceof Node) {
      resultArr.push(node.value);
      node = node.next;
    }
    return resultArr;
  }
}

// const list = new Node("a", new Node("b"));

// const newList = list.insert("first");
// console.log("inserting 'first' to the list: " + newList.join(","));

// list.insetList("c");
// console.log("pushing c to the list: " + list.join(","));

// console.log(
//   `joining the list: ${list.join(
//     ","
//   )}\nlist size: ${list.size()}\nlist item at 1: ${list.at(1)}`
// );

// list.map((x) => `${x} prime`);
// console.log("mapping the list: " + list.join(","));

// const filteredList = list.filter((x) => x[0] == "a" || x[0] == "c");
// console.log(filteredList.join(","));

// console.log(list.find((x) => x.includes("a")));
