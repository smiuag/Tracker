"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FEEDBACK_EMAIL = "opobook@protonmail.com";

/**
 * Buzón de sugerencias sin backend: compone un mailto: y abre la app de
 * correo del usuario con el mensaje ya redactado. No requiere permisos,
 * cuentas ni servicios externos.
 */
export function SuggestionsSection() {
  const [text, setText] = useState("");

  function handleSend() {
    const body = text.trim();
    if (!body) return;
    const subject = encodeURIComponent("Sugerencia para Opobook");
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  }

  return (
    <SectionCard title="Sugerencias">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          ¿Se te ocurre cómo mejorar Opobook? Cuéntanoslo — al enviar se abrirá
          tu app de correo con el mensaje preparado.
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu sugerencia…"
          rows={4}
        />
        <Button onClick={handleSend} disabled={!text.trim()} className="w-fit gap-1.5">
          <Send className="size-4" />
          Enviar sugerencia
        </Button>
      </div>
    </SectionCard>
  );
}
