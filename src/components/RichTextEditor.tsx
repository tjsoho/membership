/******************************************************************************
                                IMPORTS
******************************************************************************/
import { useCallback, useMemo, useState } from "react";
import {
  createEditor,
  Descendant,
  Element as SlateElement,
  Editor,
  Transforms,
  Text,
  BaseEditor,
  Node,
} from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import {
  MdFormatColorText,
  MdFormatColorFill,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
} from "react-icons/md";

/******************************************************************************
                                TYPES
******************************************************************************/
type CustomElementType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "numbered-list"
  | "bulleted-list"
  | "list-item"
  | "align-left"
  | "align-center"
  | "align-right"
  | "align-justify";

type CustomFormatType = "bold" | "italic" | "underline" | "strikethrough";

interface CustomElement {
  type: CustomElementType;
  align?: string;
  children: CustomText[];
}

interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
}

type CustomEditor = BaseEditor & ReactEditor;

declare module "slate" {
  interface CustomTypes {
    // Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

/******************************************************************************
                              HELPERS
******************************************************************************/
const isBlockActive = (editor: CustomEditor, format: CustomElementType) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n): n is CustomElement =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement).type === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: CustomEditor, format: CustomElementType) => {
  const isActive = isBlockActive(editor, format);
  const isList = ["numbered-list", "bulleted-list"].includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n): n is CustomElement =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ["numbered-list", "bulleted-list"].includes((n as CustomElement).type),
    split: true,
  });

  if (!isActive && isList) {
    const block: CustomElement = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);

    Transforms.setNodes(
      editor,
      { type: "list-item" } as Partial<CustomElement>,
      {
        match: (n): n is CustomElement =>
          !Editor.isEditor(n) && SlateElement.isElement(n),
      }
    );
  } else if (isActive && isList) {
    Transforms.setNodes(
      editor,
      { type: "paragraph" } as Partial<CustomElement>,
      {
        match: (n): n is CustomElement =>
          !Editor.isEditor(n) && SlateElement.isElement(n),
      }
    );
  }
};

const isMarkActive = (editor: Editor, format: CustomFormatType) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: CustomFormatType) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

/******************************************************************************
                              COMPONENT
******************************************************************************/
export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props: any) => {
    const { attributes, children, element } = props;
    const style = { textAlign: element.align };

    switch (element.type) {
      case "numbered-list":
        return (
          <ol style={style} {...attributes}>
            {children}
          </ol>
        );
      case "bulleted-list":
        return (
          <ul style={style} {...attributes}>
            {children}
          </ul>
        );
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "heading-one":
        return (
          <h1 style={style} {...attributes}>
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 style={style} {...attributes}>
            {children}
          </h2>
        );
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    const { attributes, children, leaf } = props;
    let styledChildren = children;

    const style: React.CSSProperties = {
      fontFamily: leaf.fontFamily,
      fontSize: leaf.fontSize,
      color: leaf.color,
      backgroundColor: leaf.backgroundColor,
    };

    if (leaf.bold) {
      styledChildren = <strong>{styledChildren}</strong>;
    }
    if (leaf.italic) {
      styledChildren = <em>{styledChildren}</em>;
    }
    if (leaf.underline) {
      styledChildren = <u>{styledChildren}</u>;
    }
    if (leaf.strikethrough) {
      styledChildren = <s>{styledChildren}</s>;
    }

    return (
      <span {...attributes} style={style}>
        {styledChildren}
      </span>
    );
  }, []);

  /******************************************************************************
   *                            RENDER
   ******************************************************************************/
  return (
    
    <Slate
      editor={editor}
      // @ts-ignore: Slate component works with initialValue prop despite type error
      initialValue={value || initialValue}
      onChange={onChange}
    >
      <Toolbar />
      <Editable
        className="w-full h-full p-4 focus:outline-none text-black mt-4"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Start typing your notes..."
      />
    </Slate>
  );
}

/******************************************************************************
                            BUTTONS
******************************************************************************/
const FormatButton = ({
  format,
  icon,
}: {
  format: CustomFormatType;
  icon: string;
}) => {
  const editor = useSlate();

  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className={`px-2 py-1 ${
        isMarkActive(editor, format) ? "bg-gray-200" : "hover:bg-gray-100"
      } rounded`}
    >
      {icon}
    </button>
  );
};

const BlockButton = ({
  format,
  icon,
}: {
  format: CustomElementType;
  icon: string;
}) => {
  const editor = useSlate();

  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      className={`px-2 py-1 ${
        isBlockActive(editor, format) ? "bg-gray-200" : "hover:bg-gray-100"
      } rounded`}
    >
      {icon}
    </button>
  );
};

const COLORS = [
  // Row 1: Basic colors
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#FFFFFF",
  // Row 2: Warm colors
  "#FF0000",
  "#FF4D00",
  "#FF9900",
  "#FFCC00",
  "#FFFF00",
  "#FFFF99",
  // Row 3: Cool colors
  "#00FF00",
  "#00FFCC",
  "#00FFFF",
  "#0099FF",
  "#0000FF",
  "#9900FF",
  // Row 4: Additional colors
  "#FF00FF",
  "#FF99CC",
  "#FF99FF",
  "#FFCCFF",
  "#F3F3F3",
  "#EFEFEF",
];

const FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: '"Times New Roman", serif' },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Courier New", value: '"Courier New", monospace' },
  { name: "Georgia", value: "Georgia, serif" },
];

const ColorPicker = ({
  icon: Icon,
  title,
  onSelect,
}: {
  icon: any;
  title: string;
  onSelect: (color: string) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-1 hover:bg-gray-100 rounded flex items-center"
        title={title}
      >
        <Icon size={20} />
      </button>
      {showPicker && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-white shadow-lg rounded-lg z-50 w-[276px]">
          <div className="grid grid-cols-6 gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                className="w-10 h-10 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => {
                  onSelect(color);
                  setShowPicker(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Toolbar = () => {
  const editor = useSlate();

  const handleFontChange = (font: string) => {
    Transforms.setNodes(
      editor,
      { fontFamily: font },
      { match: Text.isText, split: true }
    );
  };

  const handleSizeChange = (size: string) => {
    Editor.addMark(editor, "fontSize", size + "px");
  };

  const handleColorChange = (color: string) => {
    Editor.addMark(editor, "color", color);
  };

  const handleHighlightChange = (color: string) => {
    Editor.addMark(editor, "backgroundColor", color);
  };

  const handleAlign = (alignment: string) => {
    const isActive = isBlockActive(
      editor,
      ("align-" + alignment) as CustomElementType
    );

    Transforms.setNodes(
      editor,
      { align: isActive ? undefined : alignment },
      { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
    );
  };

  return (
    <div className="flex items-center p-2 border-b bg-white gap-2">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <FormatButton format="bold" icon="B" />
        <FormatButton format="italic" icon="I" />
        <FormatButton format="underline" icon="U" />
        <FormatButton format="strikethrough" icon="S" />
      </div>

      {/* Font Controls */}
      <select
        className="border rounded px-2 py-1 text-sm"
        onChange={(e) => handleFontChange(e.target.value)}
      >
        {FONTS.map((font) => (
          <option key={font.value} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>

      <select
        className="border rounded px-2 py-1 text-sm w-20"
        onChange={(e) => handleSizeChange(e.target.value)}
      >
        {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      {/* Color Pickers */}
      <div className="flex items-center gap-1">
        <ColorPicker
          icon={MdFormatColorText}
          title="Text Color"
          onSelect={handleColorChange}
        />
        <ColorPicker
          icon={MdFormatColorFill}
          title="Highlight Color"
          onSelect={handleHighlightChange}
        />
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleAlign("left")}
          className="p-1 hover:bg-gray-100 rounded"
          title="Align Left"
        >
          <MdFormatAlignLeft size={20} />
        </button>
        <button
          onClick={() => handleAlign("center")}
          className="p-1 hover:bg-gray-100 rounded"
          title="Align Center"
        >
          <MdFormatAlignCenter size={20} />
        </button>
        <button
          onClick={() => handleAlign("right")}
          className="p-1 hover:bg-gray-100 rounded"
          title="Align Right"
        >
          <MdFormatAlignRight size={20} />
        </button>
        <button
          onClick={() => handleAlign("justify")}
          className="p-1 hover:bg-gray-100 rounded"
          title="Justify"
        >
          <MdFormatAlignJustify size={20} />
        </button>
      </div>

      {/* List Controls */}
    </div>
  );
};
