import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import CommandList from "./CommandsList";

const renderItems = () => {
  let component: ReactRenderer | undefined;
  let popup: any;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(CommandList, {
        props: {
          items: props.items,
          command: props.command
        },
        editor: props.editor
      });

      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start"
      });
    },
    onUpdate: (props: any) => {
      component?.updateProps({
        items: props.items,
        command: props.command
      });

      popup[0].setProps({
        getReferenceClientRect: props.clientRect
      });
    },
    onKeyDown: (props: any) => {
      if (props.event.key === "Escape") {
        popup[0].hide();
        return true;
      }

      if (component?.ref && typeof (component.ref as any).onKeyDown === "function") {
        return (component.ref as any).onKeyDown(props);
      }
      return false;
    },
    onExit: () => {
      popup[0].destroy();
      component?.destroy();
    }
  };
};

export default renderItems;
