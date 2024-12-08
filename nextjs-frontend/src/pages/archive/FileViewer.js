import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiFolderLine, RiFile2Line } from "@remixicon/react";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import FilePreview from "./FilePreview";

import { ScrollArea } from "@/components/ui/scroll-area";

const FileViewer = ({ rootFileId = "0263315a-dd48-42b4-b28d-9fd5bd679fb8", opened, setOpened }) => {
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(rootFileId);
  const [path, setPath] = useState([rootFileId]);
  const [currentContent, setCurrentContent] = useState({});

  const [filePreviewOpened, setFilePreviewOpened] = useState(false);
  const [filePreviewData, setFilePreviewData] = useState({});

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

  const randomString = (length) => Array.from({ length }, () => Math.random().toString(36).charAt(2)).join("");

  const getName = (cId) => {
    const d = data.find(({ id }) => id === cId);
    if (!d) return { name: "", cyphered: true };
    let returnName = d?.name ? d.name : randomString(d?.namelength || 2);
    return { name: returnName, filetype: d?.filetype, cyphered: "name" in d ? false : true };
  };

  const getSize = (cId) => {
    const s = data.find(({ id }) => id === cId)?.filesize;

    if (!s) return "";

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

  const renderName = (cId) => {
    const { name, cyphered, filetype } = getName(cId);
    if (cyphered) {
      if (filetype) {
        return (
          <>
            <span className="!font-blokk">{name}</span>
            <span>.{filetype}</span>
          </>
        );
      } else {
        return (
          <>
            <span className="!font-blokk">{name}</span>
          </>
        );
      }
    } else {
      return name;
    }
  };
  return (
    <>
      <FilePreview
        show={filePreviewOpened}
        fileData={filePreviewData}
        closeFilePreview={() => {
          setFilePreviewOpened(false);
        }}
      />
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
                        {renderName(id)}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator> /</BreadcrumbSeparator>
                  </>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="z-100  pl-12 mt-6 overflow-y-scroll">
          <Table className="h-full relative w-full">
            <TableHeader className="hover:bg-transparent sticky top-0 ">
              <TableRow className="hover:bg-transparent h-[20px]">
                <TableHead className="w-2"></TableHead>
                <TableHead className="text-black font-normal text-xs ">Name</TableHead>
                <TableHead className="text-right text-black font-normal text-xs">File Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
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
                        if (child.type === "file" && child?.name && child?.publicUrl) {
                          setFilePreviewOpened(true);
                          setFilePreviewData(child);
                        }
                      }}
                    >
                      {renderName(child.id)}
                    </TableCell>
                    <TableCell className="text-right hover:text-black">{getSize(child.id)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default FileViewer;
