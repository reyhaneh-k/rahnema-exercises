class immutableNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
  prepend(value) {
    const node = new Node(value);
    node.next = this;
    return node;
  }

  at(n) {
    let node = this;
    for (let i = 0; i < n - 1; i++) {
      node = node.next;
    }
    return node;
  }
  append(value) {
    let node;
    Object.assign(node, this);
    let sourceNode = this;

    while (node.next instanceof Node) {
      Object.assign(node.next, sourceNode.next);
      sourceNode = sourceNode.next;
      node = node.next;
    }
    node.next = new Node(value);
  }
}
