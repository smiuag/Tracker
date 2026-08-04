import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Block } from "@/types/topic";

interface BlockFilterTabsProps {
  blocks: Block[];
  value: string;
  onChange: (value: string) => void;
}

export const ALL_BLOCKS_VALUE = "all";

export function BlockFilterTabs({ blocks, value, onChange }: BlockFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => v && onChange(v)} className="min-w-0">
      <TabsList className="w-full touch-pan-x justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsTrigger value={ALL_BLOCKS_VALUE}>Todos</TabsTrigger>
        {blocks.map((block) => (
          <TabsTrigger key={block.id} value={block.id}>
            {block.nombre}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
