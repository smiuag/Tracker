import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOPIC_STATES, TOPIC_STATE_LABELS } from "@/lib/constants/topicStates";

export const ALL_STATES_VALUE = "all";

interface EstadoFilterTabsProps {
  value: string;
  onChange: (value: string) => void;
}

export function EstadoFilterTabs({ value, onChange }: EstadoFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => v && onChange(v)} className="min-w-0">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value={ALL_STATES_VALUE}>Todos</TabsTrigger>
        {TOPIC_STATES.map((estado) => (
          <TabsTrigger key={estado} value={estado}>
            {TOPIC_STATE_LABELS[estado]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
