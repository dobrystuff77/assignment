import React, { useEffect, useState, useCallback } from "react";

import { TreeNode } from "../TreeNode/TreeNode";
import { AddButton } from "../AddButton/AddButton";

export const Tree = () => {
  const [nodes, setNodes] = useState([]);

  const data = [];

  const addChildrenVisibility = useCallback(
    (nodes, location) => {
      const nodesCopy = [];
      for (let i = 0; i < nodes.length; i++) {
        const { children, title, childrenVisibility } = nodes[i];
        const hasChildren = children !== undefined;
        const id = location ? `${location}.${i + 1}` : `${i + 1}`;
        nodesCopy[i] = {
          id,
          title,
          children: hasChildren ? initializedCopy(children, id) : undefined,
          childrenVisibility: true,
        };
      }

      return nodesCopy;
    },
    [nodes, setNodes]
  );

  const initializedCopy = useCallback(
    (nodes, location) => {
      const nodesCopy = [];
      for (let i = 0; i < nodes.length; i++) {
        const { children, title, childrenVisibility } = nodes[i];
        const hasChildren = children !== undefined;
        const id = location ? `${location}.${i + 1}` : `${i + 1}`;
        nodesCopy[i] = {
          id,
          title,
          children: hasChildren ? initializedCopy(children, id) : undefined,
          changeTitle: changeTitle(id),
          addChild: addChild(id),
          removeNode: removeNode(id),
          childrenVisibility: childrenVisibility && true,
          changeChildrenVisibility: changeChildrenVisibility(id),
        };
      }

      return nodesCopy;
    },
    [nodes, setNodes]
  );

  const changeTitle = useCallback(
    (id) => {
      return (newTitle) => {
        if (!Array.isArray(id)) {
          id = id.split(".").map((str) => parseInt(str));
        }

        setNodes((nodes) => {
          let nodesCopy = initializedCopy([...nodes]);
          let changingNode = nodesCopy[id[0] - 1];
          if (id.length > 1) {
            for (let i = 1; i < id.length; i++) {
              changingNode = changingNode.children[id[i] - 1];
            }
          }
          changingNode.title = newTitle;
          return nodesCopy;
        });
      };
    },
    [nodes, setNodes]
  );

  const addRootElement = useCallback(() => {
    {
      const id = nodes.length ? `${nodes.length + 1}` : "1";
      const newNode = {
        children: undefined,
        childrenVisibility: true,
        changeChildrenVisibility: changeChildrenVisibility(id),
        changeTitle: changeTitle(id),
        removeNode: removeNode(id),
        addChild: addChild(id),
        id,
        title: "New Category",
      };

      setNodes((nodes) => {
        return [...nodes, newNode];
      });
    }
  }, [nodes, setNodes]);

  const addChild = useCallback(
    (id) => {
      return () => {
        if (!Array.isArray(id)) {
          id = id.split(".").map((str) => parseInt(str));
        }

        setNodes((nodes) => {
          let nodesCopy = initializedCopy([...nodes]);
          let changingNode = nodesCopy[id[0] - 1];

          if (id.length > 1) {
            for (let i = 1; i < id.length; i++) {
              changingNode = changingNode.children[id[i] - 1];
            }
          }

          if (!changingNode?.children) {
            changingNode.children = [];
          }

          let idCopy = `${id.join(".")}.${changingNode.children.length + 1}`;

          changingNode.children = [
            ...changingNode.children,
            {
              children: undefined,
              childrenVisibility: true,
              changeChildrenVisibility: changeChildrenVisibility(idCopy),
              changeTitle: changeTitle(idCopy),
              removeNode: removeNode(idCopy),
              addChild: addChild(idCopy),
              id: idCopy,
              title: "New Category",
            },
          ];
          return nodesCopy;
        });
      };
    },
    [nodes, setNodes]
  );

  const removeNode = useCallback(
    (id) => {
      return () => {
        console.log(id)
        console.log("id", id)
        console.log("!Array.isArray(id)", !Array.isArray(id))
        if (!Array.isArray(id)) {
          id = id.split(".").map((str) => parseInt(str));
        }
        setNodes((nodes) => {
          const nodesCopy = initializedCopy([...nodes]);
          console.log("nodesCopy", nodesCopy)

          if (id.length === 1) {
            return initializedCopy([
              ...nodesCopy.slice(0, id[0] - 1),
              ...nodesCopy.slice(id[0]),
            ]);
          } else {
            let changingNode = nodes[id[0] - 1];

            console.log("changingNode", changingNode)

            for (let i = 2; i < id.length; i++) {
              changingNode = changingNode.children[id[i - 1] - 1];
            }

            console.log("changingNode.children", changingNode.children)

            const index = id[id.length - 1] - 1;

            console.log("index", index)

            const newChildren = [
              ...changingNode.children.slice(0, index),
              ...changingNode.children.slice(index + 1),
            ];

            console.log("newChildren", newChildren)

            changingNode.children = newChildren;
            console.log("nodesCopy", nodesCopy)
            console.log("------")
            return nodesCopy;
          }
        });
      };
    },
    [nodes, setNodes]
  );

  const changeChildrenVisibility = useCallback(
    (id) => {
      return () => {
        if (!Array.isArray(id)) {
          id = id.split(".").map((str) => parseInt(str));
        }
        setNodes((nodes) => {
          let nodesCopy = initializedCopy([...nodes]);
          let changingNode = nodesCopy[id[0] - 1];

          if (id.length > 1) {
            for (let i = 1; i < id.length; i++) {
              changingNode = changingNode.children[id[i] - 1];
            }
            changingNode.childrenVisibility = !changingNode.childrenVisibility;
          } else {
            changingNode.childrenVisibility = !changingNode.childrenVisibility;
          }

          return nodesCopy;
        });
      };
    },
    [nodes, setNodes]
  );

  useEffect(() => {
    setNodes(initializedCopy(addChildrenVisibility(data)));
  }, []);

  return (
    <div className="container pt-3">
      {nodes.map((nodeProps) => {
        const { id, ...props } = nodeProps;
        return <TreeNode key={id} {...props} />;
      })}

      <AddButton addRootElement={addRootElement} />
    </div>
  );
};
