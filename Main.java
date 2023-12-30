import java.util.Stack;

class Node {
    char value;
    Node left, right;

    Node(char item) { value = item; }
}

class ExpressionTree {
    static Node buildTree(String postfix) {
        Stack<Node> stack = new Stack<>();
        for (int i = 0; i < postfix.length(); i++) {
            char c = postfix.charAt(i);
            Node node = new Node(c);
            if (!Character.isDigit(c)) {
                node.right = stack.pop();
                node.left = stack.pop();
            }
            stack.push(node);
        }
        return stack.pop();
    }

    static void printTree(Node root, int space) {
        if (root == null) return;
        space += 10;
        printTree(root.right, space);
        for (int i = 10; i < space; i++) System.out.print(" ");
        System.out.println(root.value);
        printTree(root.left, space);
    }

    public static void main(String args[]) {
        String postfix = "12+3+578/-*";
        Node root = buildTree(postfix);
        printTree(root, 0);
    }
}
