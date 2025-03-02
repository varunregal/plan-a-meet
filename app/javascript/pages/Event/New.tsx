import { Button } from "@/components/ui/button";

function New() {
  return (
    <Button onClick={() => console.log("clicked")}>
      This is a shadcn button
    </Button>
  );
}

export default New;
