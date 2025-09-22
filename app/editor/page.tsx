import { Ruler } from "@/components/Editor/Ruler";
import TextEditor from "@/components/Editor/SimpleEditor";
import { Toolbar } from "@/components/Editor/ToolBar";
import React from "react";

const page = () => {
  return (
    <div className=" size-full overflow-x-auto bg-[#f9fbfd] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Toolbar />
      <div className="  fixed z-50 top-18 w-full bg-[#f9fbfd]">
        <Ruler />
      </div>
      <div className="  flex justify-center print:mt-0 mt-22 w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <TextEditor />
      </div>
    </div>
  );
};

export default page;
