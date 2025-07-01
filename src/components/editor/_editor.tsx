"use client";
import { BlockNoteSchema, defaultBlockSpecs, type BlockNoteEditor, type BlockNoteEditorOptions } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { CUSTOM_BLOCK_TYPE, CustomBlock, type CustomBlockSchema } from "./custom-block";
import { v4 as uuid } from "uuid";
import { useUniqueCustomBlockCopies } from "./unique-custom-block-on-copy";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
  
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // enable the default blocks if desired
    ...defaultBlockSpecs,

    // Add your own custom blocks:
    [CUSTOM_BLOCK_TYPE]: CustomBlock,
  },
});

const defaultInitialContent = [
  {
    type: "paragraph",
    content:
      "This is a minimal reproduction of the issue with BlockNote where IDs are duplicated on copy.",
  },
  {
    type: "custom",
    props: {
      permanentId: uuid(),
    },
    content: "This is a custom block with a permanent ID.",
  },
  {
    type: "paragraph",
    content: "Ctrl + Drag the block here to copy it.",
  },
  {
    type: "paragraph",
  },
] as const satisfies BlockNoteEditorOptions<
  (typeof schema)["blockSchema"],
  (typeof schema)["inlineContentSchema"],
  (typeof schema)["styleSchema"]
>["initialContent"];

export function I_Editor() {
  const setEditorContent = useLocalStorage<string>({
    key: "blocknote-editor-content",
    defaultValue: JSON.stringify(defaultInitialContent),
    getInitialValueInEffect: false,
  })[1]

  const initialValueString = readLocalStorageValue<string>({ key: "blocknote-editor-content" });

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialValueString ? JSON.parse(initialValueString) : defaultInitialContent,
  });

  useEffect(() => {
    const offChange = editor.onChange(async (_ed) => {
      setEditorContent(JSON.stringify(_ed.document))
    });
  
    return () => {
      offChange?.();
    };
  })

  useUniqueCustomBlockCopies(editor as unknown as BlockNoteEditor<CustomBlockSchema>);

  return <BlockNoteView editor={editor} theme="dark" />
}