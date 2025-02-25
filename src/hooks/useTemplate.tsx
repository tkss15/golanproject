"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"


export function ResponsiveTemplate({children, buttonComponent}: {children: React.ReactNode, buttonComponent: React.ReactNode}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {buttonComponent}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[200px] p-0">
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {buttonComponent}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}