import Reconciler from 'react-reconciler';
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants';

/**
 * reference doc: https://www.npmjs.com/package/react-reconciler
 */

const HostConfig = {
  // You'll need to implement some methods here.
  // See below for more information and examples.

  // If your target platform is similar to the DOM and has methods similar to appendChild,
  // removeChild, and so on, you'll want to use the mutation mode. This is the same mode
  // used by React DOM, React ART, and the classic React Native renderer.
  supportsMutation: true,
  createInstance(type, props, rootContainer, hostContext, internalHandle) {
    return {
      nodeName: type.toUpperCase(),
      props,
      children: []
    }
  },
  createTextInstance(text, rootContainer, hostContext) {
    return {
      nodeName: 'TEXT',
      textContent: text
    }
  },

  // This method happens in the render phase. It can mutate parentInstance and child,
  // but it must not modify any other nodes. It's called while the tree is still being
  // built up and not connected to the actual tree on the screen.
  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child)
  },

  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    // If you return true, the instance will receive a commitMount call later.
    return true;
  },

  // 可以在这里计算属性的更新，如果不需要更新可以返回null, 否则返回属性的更新信息，以便在commitUpdate阶段使用
  prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext) {
    const changedArray = [];
    Object.keys(oldProps).forEach(propName => {
      if (oldProps[propName] !== newProps[propName]) {
        changedArray.push(propName, newProps[propName]);
      }
    })

    return changedArray;
  },

  // Some target platforms support setting an instance's text content without manually
  // creating a text node. For example, in the DOM, you can set node.textContent instead
  // of creating a text node and appending it.

  // If you return true, you will need to implement resetTextContent too.
  // If you don't want to do anything here, you should return false.
  shouldSetTextContent(type, props) {
    return false;
  },

  getRootHostContext(rootContainer) {
    return {
      type: 'rootContext',
      rootContainer,
    };
  },

  getChildHostContext(parentHostContext, type, rootContainer) {
    return type === 'svg' ? { inSvg: true } : parentHostContext;
  },

  // 确定需要为ref指定的值
  getPublicInstance(instance) {
    return instance;
  },

  // react在更新之前存储一些信息（如选中文本），用于在之后进行恢复
  prepareForCommit(containerInfo) {
    return null;
  },

  // 用于在react更新树之后恢复`prepareForCommit`记录的信息
  resetAfterCommit(containerInfo) {

  },

  // 容器作为Portal target时被调用
  preparePortalMount(containerInfo) {

  },

  scheduleTimeout(fn, delay)  {
    return setTimeout(fn, delay);
  },

  cancelTimeout(id) {
    clearTimeout(id);
  },

  // This is a property (not a function) that should be set to something that
  // can never be a valid timeout ID. For example, you can set it to -1.
  noTimeout: -1,

  supportsMicrotask: false,
  scheduleMicrotask(fn) {},

  isPrimaryRenderer: true,

  // In dom, can get current event by `window.event`
  getCurrentEventPriority() {
    return DefaultEventPriority;
  },

  // Mutation methods
  appendChild(parentInstance, child) {
    parentInstance.children.push(child);
  },
  appendChildToContainer(container, child) {
    if (!container.children) {

      container.children = [];
    }
    container.children.push(child);
  },
  insertBefore(parentInstance, child, beforeChild) {
    const index = parentInstance.children.indexOf(beforeChild);
    if (index >= 0) {
      parentInstance.children.splice(index, 0, child);
    } else {
      parentInstance.children.push(child);
    }
  },
  insertInContainerBefore(container, child, beforeChild) {
    const index = container.children.indexOf(beforeChild);
    if (index >= 0) {
      container.children.splice(index, 0, child);
    } else {
      container.children.push(child);
    }
  },

  removeChild(parentInstance, child) {
    const index = parentInstance.children.indexOf(child);
    if (index >= 0) {
      parentInstance.children.splice(index, 1);
    }
  },

  removeChildFromContainer(container, child) {
    const index = container.children.indexOf(child);
    if (index >= 0) {
      container.children.splice(index, 1);
    }
  },

  resetTextContent(instance) {},
  commitTextUpdate(textInstance, prevText, nextText) {
    textInstance.textContent = nextText;
  },

  commitMount(instance, type, props) {},
  // updatePayload is the data returned by prepareUpdate
  // instance will be mutated according to updatePayload
  commitUpdate(instance, updatePayload, type, prevProps, nextProps) {
    if (updatePayload) {
      return;
    }
    for (i = 0; i < updatePayload.length; i += 2) {
      instance.props[updatePayload[i]] = updatePayload[i + 1];
    }
  },

  hideInstance(instance) {
    instance.isVisible = false;
  },

  hideTextInstance(textInstance) {
    instance.isVisible = false;
  },
  unhideInstance(instance, props) {
    instance.isVisible = true;
  },
  unhideTextInstance(textInstance, text) {
    instance.isVisible = true;
  },
  clearContainer(container) {
    container.children = null;
  }
};

const MyRenderer = Reconciler(HostConfig);

const RendererPublicAPI = {
  render(element, container, callback) {
    // MyRenderer.createContainer will return fiberRoot， 在下面的例子中被保存在了container.__rootContainer字段
    // fiberRoot的current字段引用 rootFiber， rootFiber的stateNode引用了fiberRoot
    // fiberRoot的containerInfo引用了container元素
    // rootFiber的child引用了根元素（通常是App组件）的fiber节点
    if (!container.__rootContainer) {
      container.__rootContainer = MyRenderer.createContainer(container, null);
    }
    MyRenderer.updateContainer(element, container.__rootContainer, null, null);
  }
};

export default RendererPublicAPI;