import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useEffect, useState } from "react";

const FilePreview = ({ show, fileData, closeFilePreview }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(show);
  }, [show]);

  useEffect(() => {
    if (!open) {
      closeFilePreview();
    }
  }, [open]);

  const renderImage = (imgUrl, alt) => {
    return <img src={imgUrl} alt={fileData.name} />;
  };

  const displayFile = ({ type = "", url, data }) => {
    if (type.includes("image")) {
      return renderImage(url, data?.name);
    }

    return (
      <div className="w-full flex items-center">
        <Button
          className=" cursor-pointer rounded-none hover:bg-popover-foreground hover:text-popover hover:border-popover-foreground"
          onClick={() => window.open(url, "_blank")}
        >
          Download
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {fileData && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{fileData?.name}</DialogTitle>
          </DialogHeader>
          <div>{displayFile({ type: fileData?.mimetype, url: fileData?.publicUrl, fileData })}</div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default FilePreview;
