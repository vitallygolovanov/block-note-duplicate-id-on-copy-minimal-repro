import { Block, BlockNoteEditor } from "@blocknote/core";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { CUSTOM_BLOCK_TYPE, type CustomBlockSchema } from "./custom-block";

export function useUniqueCustomBlockCopies(editor: BlockNoteEditor<CustomBlockSchema>) {
  
  useEffect(() => {
    const offChange = editor.onChange(async (_ed, { getChanges }) => {
      const changes = getChanges();

      // Didn't work: `queueMicrotask` was an attempt to allow the editor to finish processing the changes 
      // and assign the new IDs to the blocks before we start processing them.
      // The problem currently is that currently if the block is copied via dnd (ctrl+drag),
      // `onChange` new blocks are identical to old ones down to the ID.
      // queueMicrotask(() => {
        _ed.transact(() => {
          // First checking if there even are changes to process.
          // This is important because the `onChange` event is called on every change,
          // and we don't want to do any work if there are no changes that match our criteria.
          if (!changes.some(c => c.type === "insert" && c.block.type === CUSTOM_BLOCK_TYPE)) {
            return; // no changes to process
          }

          // Gather all existing IDs once – cheap even in large docs.
          // Because forEachBlock already sees both original blocks and the ones that are being inserted,
          // but at the same time inserted blocks don't yet have new Block IDs,
          // we also count the usage of `permanentId` to detect duplicates.
          const existingIds = new Map<string, number>();
          const existingBlocks: Block<CustomBlockSchema>[] = [];

          _ed.forEachBlock((b) => {
            if (b.type === CUSTOM_BLOCK_TYPE) {
              existingBlocks.push(b);

              // Let's see if we're referencing same objects.
              for (const change of changes) {
                if (change.block === b) {
                  console.debug(
                    "Found change for block",
                    b.id,
                    "in changes",
                    change
                  );
                  return true; // continue iterating
                }
              }

              // Count the usage of `permanentId` for debugging purposes.
              if (b.props.permanentId && existingIds.has(b.props.permanentId)) {
                existingIds.set(
                    b.props.permanentId,
                    existingIds.get(b.props.permanentId)! + 1
                  )
              } else if (b.props.permanentId) {
                existingIds.set(b.props.permanentId, 1);
              }
            }    
            return true; // continue iterating
          });

          for (const change of changes) {
            if (
              change.type === "insert" &&
              change.block.type === CUSTOM_BLOCK_TYPE &&
              (change.source.type === "drop" || change.source.type === "paste")
            ) {
              const oldId = change.block.props.permanentId;

              // If the insert did not remove the “source” block, it’s a copy
              // (moving produces a matching delete-change for the same blockId).
              const isMove =
                changes.some(
                  c =>
                    c.type === "delete" &&
                    c.block.id === change.block.id /* same Yjs id */
                );

              const isDuplicate = existingIds.has(oldId) && !isMove;
              if (isDuplicate) {
                const newId = uuid();

                // Patch the block inside the editor
                _ed.updateBlock(change.block, {
                  type: CUSTOM_BLOCK_TYPE,
                  props: { 
                    permanentId: newId,
                  }
                });
              }
            }
          }
        });
      // }); -- queueMicrotask end

    });
    return () => {
      offChange?.();
    };
  }, [editor]);
}
