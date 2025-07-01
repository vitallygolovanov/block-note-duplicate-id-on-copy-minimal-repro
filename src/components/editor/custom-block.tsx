import { defaultProps, type BlockSchemaWithBlock } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Card, Stack, Text } from "@mantine/core";
 
export const CUSTOM_BLOCK_TYPE = "custom";

export const CustomBlock = createReactBlockSpec(
  {
    type: CUSTOM_BLOCK_TYPE,
    propSchema: {
      ...defaultProps,
      permanentId: {
        default: "",
      }
    },
    content: "inline",
  },
  {
    render: ({block, contentRef}) => {
      return (
        <Card>
          <Stack>
            <Text component={Stack} gap={2} size="xs" c="dimmed">
              <div>Block id: {block.id}</div>
              <div>Perm id: {block.props.permanentId}</div>
            </Text>
            <div className={"inline-content"} ref={contentRef} />
          </Stack>
        </Card>
      );
    },
  },
);

export type CustomBlockSchema = BlockSchemaWithBlock<typeof CUSTOM_BLOCK_TYPE, typeof CustomBlock['config']>