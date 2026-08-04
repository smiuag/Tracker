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
      {/* overflow-y-hidden: sin él, overflow-x-auto vuelve desplazable también
          el eje vertical y en iOS el rebote elástico hace "bailar" las pestañas.
          after:hidden en los triggers: su subrayado (invisible en esta variante)
          sobresale 5px por debajo y es lo que creaba ese desbordamiento vertical. */}
      <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsTrigger value={ALL_BLOCKS_VALUE} className="after:hidden">
          Todos
        </TabsTrigger>
        {blocks.map((block) => (
          <TabsTrigger key={block.id} value={block.id} className="after:hidden">
            {block.nombre}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
