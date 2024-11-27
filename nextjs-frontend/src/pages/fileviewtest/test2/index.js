import React, { useEffect, useRef, useState } from "react";


import TreeView from "react-accessible-treeview";



const initialData = [
  {
    name: "",
    id: 0,
    children: [1, 2, 3],
    parent: null,
  },
  {
    name: "Fruits",
    children: [],
    id: 1,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Drinks",
    children: [4, 5],
    id: 2,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Vegetables",
    children: [],
    id: 3,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Pine colada",
    children: [],
    id: 4,
    parent: 2,
  },
  {
    name: "Water",
    children: [],
    id: 5,
    parent: 2,
  },
];

function MultiSelectCheckboxAsync() {
  const loadedAlertElement = useRef(null);
  const [data, setData] = useState(initialData);
  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);

  const updateTreeData = (list, id, children) => {
    const data = list.map((node) => {
      if (node.id === id) {
        node.children = children.map((el) => {
          return el.id;
        });
      }
      return node;
    });
    return data.concat(children);
  };

  useEffect(() => {
    console.log("data", data);
    }, [data]);

  const onLoadData = ({ element }) => {
    return new Promise((resolve) => {
      if (element.children.length > 0) {
        resolve();
        return;
      }
      setTimeout(() => {
        setData((value) =>
          updateTreeData(value, element.id, [
            {
              name: `Child Node ${value.length}`,
              children: [],
              id: value.length,
              parent: element.id,
              isBranch: true,
            },
            {
              name: "Another child Node",
              children: [],
              id: value.length + 1,
              parent: element.id,
            },
          ])
        );
        resolve();
      }, 1);
    });
  };

  const wrappedOnLoadData = async (props) => {
    console.log("props", props);
    const nodeHasNoChildData = props.element.children.length === 0;
  

    await onLoadData(props);


  };

  return (
    <>
      <div>

        <div className="checkbox">
          <TreeView
            data={data}
            aria-label="Checkbox tree"
            onLoadData={wrappedOnLoadData}
            multiSelect
            propagateSelect
            togglableSelect
            propagateSelectUpwards
            nodeRenderer={({
              element,
              isBranch,
              isExpanded,
              isSelected,
              isHalfSelected,
              getNodeProps,
              level,
              handleSelect,
              handleExpand,
            }) => {
              const branchNode = (isExpanded, element) => {
                return isExpanded && element.children.length === 0 ? (
                  <>
                    <span
                      role="alert"
                      aria-live="assertive"
                      className="visually-hidden"
                    >
                      loading {element.name}
                    </span>
                    
                  </>
                ) : null;
              };
              return (
                <div
                  {...getNodeProps({ onClick: handleExpand })}
                  style={{ marginLeft: 40 * (level - 1) }}
                >
                  {isBranch && branchNode(isExpanded, element)}
                  
                  <span className="name">{element.name}</span>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}



export default MultiSelectCheckboxAsync;