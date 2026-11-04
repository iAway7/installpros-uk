"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/system/popover";
import { Button } from "@/components/system/button";
import { Calendar } from "@/components/system/calendar";
import { Switch } from "@/components/system/switch";

export function PopoverDemo() {
  const [hideTest, setHideTest] = useState(true);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal /> View options
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <p className="text-body font-semibold text-foreground">View options</p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-body-sm text-muted-foreground">Hide test leads</span>
          <Switch checked={hideTest} onCheckedChange={setHideTest} aria-label="Hide test leads" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DatePopoverDemo() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {date ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Any date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-0 p-0">
        <Calendar
          value={date}
          onChange={(d) => {
            setDate(d);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
