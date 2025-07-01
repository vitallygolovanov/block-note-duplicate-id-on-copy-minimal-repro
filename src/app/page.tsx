import { Editor } from "@/components/editor/editor";
import { Container } from "@mantine/core";

export default async function Home() {

  return (
    <Container size="xs" mt="4rem">
      <Editor />
    </Container>
  );
}
