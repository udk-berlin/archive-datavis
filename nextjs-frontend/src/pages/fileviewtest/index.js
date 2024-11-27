import { set } from "lodash";

import { useEffect, useState } from "react";

import TreeView, { flattenTree } from "react-accessible-treeview";
import { useImmer } from "use-immer";

import { RiFolder2Line, RiFile2Line } from "@remixicon/react";

const fileviewtestPage = () => {
  const iniFileID = "c97f45df-d3b9-4c08-ac39-b9c16ddb56da";
  const apiURL = "http://localhost:3010/api/filemetadata/";

  const [fileDatas, setFileDatas] = useState([{ id: "root", name: "root", children: [] }]);
  const [currentFileId, setCurrentFileId] = useImmer(iniFileID);

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      fileDatas.map((f) => {
        return {
          id: f.id,
          parent: f.id === "root" ? null : "root",
          name: f.name,
          children: f.children || [],
          parent: f.name === "root" ? null : f.parent,
          firstNameChar: f.firstNameChar,
          namelength: f.namelength,
          filetype: f.filetype,
          isBranch: f.filetype ? false : true,
        };
      })
    );
  }, [fileDatas]);

  const randomString = (length) => Array.from({ length }, () => Math.random().toString(36).charAt(2)).join("");
  useEffect(() => {
    const fetchData = async (id) => {
      const response = await fetch(`${apiURL}${id}`);
      let idData = await response.json();

      if (!idData?.id) return;
      idData.parent = "root";
      // idData.name = `${idData.firstNameChar}${randomString(idData.namelength)}${idData.filetype ? `.${idData.filetype}` : ""}`;

      const appendData = [idData];

      if (idData?.children) {
        for (const child of idData.children) {
          const response = await fetch(`${apiURL}${child}`);
          let data = await response.json();
          data.children = [];
          //data.name = `${idData.firstNameChar}${randomString(data.namelength)}${data.filetype ? `.${data.filetype}` : ""}`;

          if (data?.id) appendData.push(data);
        }
      }

      setFileDatas((prevFileDatas) => {
        const ids = new Set(prevFileDatas.map((file) => file.id));
        const newFileDatas = [...prevFileDatas];
        newFileDatas[0].children = [idData.id];

        appendData.forEach((data) => {
          if (!ids.has(data.id)) {
            newFileDatas.push(data);
            ids.add(data.id);
          }
        });

        return newFileDatas;
      });
    };

    fetchData(iniFileID);
  }, [iniFileID, setFileDatas]);

  useEffect(() => {
    console.log("fa,", fileDatas);
  }, [fileDatas]);

  const fetchNodeById = async (id) => {
    const fetchData = async (id) => {
      const response = await fetch(`${apiURL}${id}`);
      const idData = await response.json();
      if (!idData?.id) return;
      const appendData = [idData];

      if (idData?.children) {
        for (const child of idData.children) {
          const response = await fetch(`${apiURL}${child}`);
          const data = await response.json();
          if (data?.id) appendData.push(data);
        }
      }

      const idsToUpdate = [];
      setFileDatas((prevFileDatas) => {
        const ids = new Set(prevFileDatas.map((file) => file.id));
        const newFileDatas = [...prevFileDatas];

        appendData.forEach((data) => {
          if (!ids.has(data.id)) {
            newFileDatas.push(data);
            ids.add(data.id);
          } else if( data.parent === id) {
            let d = data
            d.children = []
            idsToUpdate.push(d);
          }
        });

        return newFileDatas;
      });
      console.log('asdasd IDs to update', idsToUpdate);
      // if (idsToUpdate.length > 0 ) {
      //   setFileDatas((prevFileDatas) => {
      //     idsToUpdate.forEach((toUpdate) => {
      //       const index = prevFileDatas.findIndex((file) => file.id === toUpdate.id);
      //       prevFileDatas[index].children = toUpdate.children;
      //     });
      //   });
      // }
    };

    fetchData(id);
  };

  const wrappedOnLoadData = async (props) => {
    //  await onLoadData(props);

    fetchNodeById(props.element.id);
  };

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <div className="lg:grid lg:grid-cols-5  h-full  gap-8">
      {data.length > 1 &&
        (console.log("asdasdasd", data),
        (
          <div className="ide ">
            {/* <TreeView
              data={data}
              aria-label="directory tree"
              togglableSelect
              clickAction="EXCLUSIVE_SELECT"
              onLoadData={(e) => {
                console.log("load", e);
              }}
              nodeRenderer={({ element, isBranch, getNodeProps, level, handleExpand }) => (
                <div {...getNodeProps()} className="flex items-center" style={{ paddingLeft: 20 * (level - 1) }} >
                  <span className="mr-4">{isBranch ? <RiFolder2Line /> : <RiFile2Line filename={element.name} />}</span>
                  {element.firstNameChar}
                  <span className="!font-blokk">{randomString(element.namelength)}</span>
                  {element.filetype ? `.${element.filetype}` : ""}
                </div>
              )}
            /> */}
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
                      <span role="alert" aria-live="assertive" className="visually-hidden">
                        loading {element.name}
                      </span>
                    </>
                  ) : null;
                };
                return (
                  <div {...getNodeProps({ onClick: handleExpand })} style={{ marginLeft: 40 * (level - 1) }}>
                    {isBranch && branchNode(isExpanded, element)}

                    <span className="name">{element.name}</span>
                  </div>
                );
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default fileviewtestPage;
