import { JSXElementNodePath } from '../fbt-nodes/FbtNodeType.tsx';
import { BindingName } from '../FbtConstants.tsx';
import FbtNodeChecker from '../FbtNodeChecker.tsx';

export default class FbtReactJSXProcessor {
  moduleName: BindingName;
  node: JSXElementNodePath['node'];
  nodeChecker: FbtNodeChecker;
  path: JSXElementNodePath;

  constructor({
    nodeChecker,
    path,
  }: {
    nodeChecker: FbtNodeChecker;
    path: JSXElementNodePath;
  }) {
    this.moduleName = nodeChecker.moduleName;
    this.node = path.node;
    this.nodeChecker = nodeChecker;
    this.path = path;
    nodeChecker.assertDenyJSXSpreadAttribute(this.node);
  }

  static create({
    path,
  }: {
    path: JSXElementNodePath;
  }): FbtReactJSXProcessor | null {
    const nodeChecker = FbtNodeChecker.forFbtReactJSXElement(path.node);
    return nodeChecker != null
      ? new FbtReactJSXProcessor({
          nodeChecker,
          path,
        })
      : null;
  }

  /**
   * This method mutates the current node
   */
  convertToPlainFbtJSXElement() {
    // this.node.openingElement.name = {
    //   type: 'JSXIdentifier',
    //   name: 'FbtImpl',
    // };
    // this.node.closingElement = {
    //   type: 'JSXClosingElement',
    //   name: { type: 'JSXIdentifier', name: 'FbtImpl' },
    // };
    // this.nodeChecker.assertNoJSXNamespacedElement(this.node);
  }
}
