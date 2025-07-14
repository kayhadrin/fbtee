import { NodePath } from '@babel/traverse';
import {
  cloneNode,
  identifier,
  isImportDeclaration,
  isVariableDeclaration,
  jsxAttribute,
  jsxElement,
  jsxExpressionContainer,
  jsxIdentifier,
  jsxNamespacedName,
  jsxOpeningElement,
  memberExpression,
  Node,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';
import { JSXElementNodePath } from '../fbt-nodes/FbtNodeType.tsx';
import {
  BindingName,
  FbsReactBindingName,
  FbtBindingName,
  FbtReactBindingName,
} from '../FbtConstants.tsx';
import FbtNodeChecker from '../FbtNodeChecker.tsx';
import { errorAt } from '../FbtUtil.tsx';
import getNamespacedArgs from '../getNamespacedArgs.tsx';
import nullthrows from '../nullthrows.tsx';

/**
 * The actual implementation of the fbt runtime is accessed via this hidden property from the user-facting Fbt component.
 */
const FBT_RUNTIME_HIDDEN_PROP = '_';
/**
 * The actual implementation of the React component is accessed via this hidden property from the user-facting Fbt component.
 */
const FBT_REACT_COMPONENT_HIDDEN_PROP = '_$';
/**
 * Declaration name of the fbt/fbs internal React component.
 */
const FBT_REACT_COMPONENT_IMPL_NAME = 'FbtImpl';

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
  convertToPlainFbtJSXElement(): boolean {
    const namespace = getNamespacedArgs(this.moduleName);
    const { moduleName } = this;
    const reactBindingName =
      moduleName === FbtBindingName ? FbtReactBindingName : FbsReactBindingName;

    // Ensure that fbt/fbs is defined in the JS scope
    const { context } = this.path;
    const reactFbtBinding = context.scope.getBinding(reactBindingName);
    if (reactFbtBinding?.path.node == null) {
      throw errorAt(
        this.path.node,
        `Unable to find variable definition for "${reactBindingName}". Did you forget to import it?`,
      );
    }

    let reactFbtDeclarationPath: NodePath<Node> | null = null;
    // If the functional fbt/fbs binding is missing
    if (context.scope.getBinding(this.moduleName)?.path.node == null) {
      reactFbtDeclarationPath = this.findDeclarationPath(reactFbtBinding.path);

      // create a new fbt/fbs variable after the definition of the React fbt/fbs binding
      reactFbtDeclarationPath.insertAfter(
        variableDeclaration('const', [
          variableDeclarator(
            identifier(this.moduleName),
            memberExpression(
              identifier(reactBindingName),
              identifier(FBT_RUNTIME_HIDDEN_PROP),
            ),
          ),
        ]),
      );
    }

    // If the internal fbt/fbs React component binding is missing
    if (
      context.scope.getBinding(FBT_REACT_COMPONENT_IMPL_NAME)?.path.node == null
    ) {
      reactFbtDeclarationPath ??= this.findDeclarationPath(
        reactFbtBinding.path,
      );

      // create a new fbt/fbs variable after the definition of the React fbt/fbs binding
      reactFbtDeclarationPath.insertAfter(
        variableDeclaration('const', [
          variableDeclarator(
            identifier(FBT_REACT_COMPONENT_IMPL_NAME),
            memberExpression(
              identifier(reactBindingName),
              identifier(FBT_REACT_COMPONENT_HIDDEN_PROP),
            ),
          ),
        ]),
      );
    }
    reactFbtDeclarationPath?.scope.crawl();

    function getFbtConstructName(value: string): string {
      const temp = value.slice(reactBindingName.length);
      return `${temp.charAt(0).toLowerCase()}${temp.slice(1)}`;
    }

    this.path.traverse({
      // only traverses children JSXElements, but not the root JSXElement (<Fbt> or <Fbs>)
      JSXElement(path: JSXElementNodePath) {
        const openingElementName =
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name;
        // throw errorAt(path.node, 'DEBUG inner ' + path.node.type);

        let constructName;
        // if the path node is a JSXElement of an fbt construct
        if (
          openingElementName &&
          openingElementName.startsWith(reactBindingName) &&
          Object.prototype.hasOwnProperty.call(
            namespace,
            (constructName = getFbtConstructName(openingElementName)),
          )
        ) {
          const renamedJSXElement = cloneNode(path.node);
          renamedJSXElement.openingElement.name = jsxNamespacedName(
            jsxIdentifier(moduleName),
            jsxIdentifier(constructName),
          );
          if (renamedJSXElement.closingElement) {
            renamedJSXElement.closingElement.name = jsxNamespacedName(
              jsxIdentifier(moduleName),
              jsxIdentifier(constructName),
            );
          }
          path.replaceWith(renamedJSXElement);
        }
      },
    });

    const renamedRootJSXElement = cloneNode(this.node);

    renamedRootJSXElement.openingElement.name = jsxIdentifier(moduleName);
    if (renamedRootJSXElement.closingElement) {
      renamedRootJSXElement.closingElement.name = jsxIdentifier(moduleName);
    }

    this.path.replaceWith(
      jsxElement(
        jsxOpeningElement(
          jsxIdentifier('FbtImpl'),
          [
            jsxAttribute(
              jsxIdentifier('_'),
              jsxExpressionContainer(renamedRootJSXElement),
            ),
          ],
          true,
        ),
        null,
        [],
        true,
      ),
    );

    // throw errorAt(this.path.node, 'DEBUG ' + this.path.node.type);
    return true;
  }

  private findDeclarationPath(initPath: NodePath<Node>) {
    let curPath = initPath;
    while (
      !isVariableDeclaration(curPath.node) &&
      !isImportDeclaration(curPath.node)
    ) {
      curPath = nullthrows(
        curPath.parentPath,
        'curPath can not be null. Otherwise, it means we reached the root' +
          ' of Babel AST in the previous iteration and therefore we would have exited the loop.',
      );
    }
    return curPath;
  }
}
