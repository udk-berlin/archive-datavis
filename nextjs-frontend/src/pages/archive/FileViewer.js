import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiFolderLine, RiFile2Line } from "@remixicon/react";
import getConfig from "next/config";
import { useEffect, useState } from "react";

const FileViewer = ({ rootFileId = "0263315a-dd48-42b4-b28d-9fd5bd679fb8", opened, setOpened }) => {
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(rootFileId);
  const [path, setPath] = useState([rootFileId]);
  const [currentContent, setCurrentContent] = useState({});

  console.log(getConfig().publicRuntimeConfig);

  useEffect(() => {
    const fetchId = async (id) => {
      const response = await fetch(
        `${getConfig().publicRuntimeConfig.api.url}:${getConfig().publicRuntimeConfig.api.port}/api/filemetadata/${id}`
      );
      const fetchedData = await response.json();

      return fetchedData;
    };

    const getContent = (_id, d) => {
      if (!_id) return;
      let currentContent = d.find(({ id }) => _id === id);
      if (currentContent?.children) {
        currentContent.childrenData = [];
        currentContent.children.forEach((child) => {
          currentContent.childrenData.push(d.find(({ id }) => id === child));
        });
      }
      console.log("currentContent", currentContent, _id);
      return currentContent;
    };

    const fetchData = async (id) => {
      const newData = [];

      const fetchedData = await fetchId(id);

      newData.push(fetchedData);

      if (fetchedData.children) {
        for await (const child of fetchedData.children) {
          newData.push(await fetchId(child));
        }
      }

      setCurrentContent(getContent(currentId, [...data, ...newData]));
      setData((prevData) => {
        return prevData.concat(newData);
      });

      return fetchedData;
    };

    fetchData(currentId);
  }, [currentId, setData]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const getName = (cId) => {
    return data.find(({ id }) => id === cId)?.name;
  };

  const getSize = (cId) => {
    const s = data.find(({ id }) => id === cId)?.filesize;

    if(!s) return "";

    let ret;

    if (s < 1024) {
      ret = `${s} B`;
    } else if (s < 1024 * 1024) {
      ret = `${(s / 1024).toFixed(2)} KB`;
    } else if (s < 1024 * 1024 * 1024) {
      ret = `${(s / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      ret = `${(s / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }

    return ret;
  };

  return (
    <div className="h-full z-100 ">
      <div className="pl-3 pr-12 pl-12 flex sticky items-center top-0 bg-secondary pt-2 pb-2 z-10 h-12">
        <Breadcrumb>
          <BreadcrumbList>
            {path.map((id) => {
              return (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="hover:text-popover-foreground"
                      onClick={() => {
                        setPath((prevPath) => {
                          return prevPath.slice(0, prevPath.indexOf(id) + 1);
                        });
                        setCurrentId(id);
                      }}
                    >
                      {getName(id)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator> /</BreadcrumbSeparator>
                </>
              );
            })}

            {/* <BreadcrumbItem>
              <BreadcrumbEllipsis className="h-4 w-4 text-black hover:text-popover-foreground" />
            </BreadcrumbItem>
            <BreadcrumbSeparator> /</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-popover-foreground" href="/components">
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem> */}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="z-100 text-green pl-12 mt-6">
        <Table>
          <TableHeader className="hover:bg-transparent">
            <TableRow className="hover:bg-transparent h-[20px]">
              <TableHead className="w-2"></TableHead>
              <TableHead className="text-black font-normal text-xs ">Name</TableHead>
              <TableHead className="text-right text-black font-normal text-xs">File Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {currentContent?.childrenData?.map((child) => {
              return (
                <TableRow key={child.id}>
                  <TableCell className="font-medium  m-0 p-0">
                    {child.type === "file" ? <RiFile2Line className="w-5 h-5" /> : <RiFolderLine className="w-5 h-5" />}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      if (child.type === "directory") {
                        setCurrentId(child.id);
                        setPath((prevPath) => {
                          return prevPath.concat(child.id);
                        });
                      }
                    }}
                  >
                    {child.name}
                  </TableCell>
                  <TableCell className="text-right hover:text-black">{getSize(child.id)}</TableCell>
                </TableRow>
              );
            })}
            {/* <TableRow>
              <TableCell className="font-medium text-left m-0 p-0">
                <RiFolderLine className="w-5 h-5" />{" "}
              </TableCell>
              <TableCell>Folder Folder</TableCell>
              <TableCell className="text-right hover:text-black">2.4 MB</TableCell>
            </TableRow>
            <TableRow className="">
              <TableCell className="font-medium  m-0 p-0">
                <RiFolderLine className="w-5 h-5" />
              </TableCell>
              <TableCell>Folder Folder</TableCell>
              <TableCell className="text-right hover:text-black">2.4 MB</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium  m-0 p-0">
                <RiFile2Line className="w-5 h-5" />
              </TableCell>
              <TableCell>Folder Folder</TableCell>
              <TableCell className="text-right hover:text-black">2.4 MB</TableCell>
            </TableRow>
            <TableRow className="text-darkGrey">
              <TableCell className="font-medium  m-0 p-0">
                <RiFile2Line className="w-5 h-5" />
              </TableCell>
              <TableCell className="">
                <span className="!font-blokk ">something</span>.txt
              </TableCell>
              <TableCell className="text-right hover:text-black">4 MB</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium  m-0 p-0">
                <RiFile2Line className="w-5 h-5" />
              </TableCell>
              <TableCell>Folder Folder</TableCell>
              <TableCell className="text-right hover:text-black">4 MB</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium  m-0 p-0">
                <RiFile2Line className="w-5 h-5" />
              </TableCell>
              <TableCell>Folder Folder</TableCell>
              <TableCell className="text-right hover:text-black">2.4 MB</TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FileViewer;
