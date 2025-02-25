"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagenation"
import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export function PaginationDemo({
    page_number,
    page_size,
    total_items,
  }: {
    page_number: number;
    page_size: number;
    total_items: number;
  }) {
    const router = useRouter();
    const total_pages = Math.ceil(total_items / page_size);
    const [current_page, setCurrentPage] = useState(page_number);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    // Check if device is mobile
    const isMobile = useMediaQuery("(max-width: 640px)");
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      const params = new URLSearchParams(searchParams);
      params.set("page_number", page.toString());
      params.set("page_size", page_size.toString());
      router.push(`${pathname}?${params.toString()}`);
    };
  
    const renderPageLink = (page: number) => (
      <PaginationItem key={page} className="hidden sm:inline-block">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(page);
          }}
          isActive={page === current_page}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    );
  
    const renderEllipsis = () => (
      <PaginationItem key="ellipsis" className="hidden sm:inline-block">
        <PaginationEllipsis />
      </PaginationItem>
    );
  
    const renderPageNumbers = () => {
      if (isMobile) {
        // Mobile view: Show only current page indicator
        return (
          <PaginationItem>
            <span className="px-4 py-2 text-right">
              {current_page} מתוך {total_pages}
            </span>
          </PaginationItem>
        );
      }
  
      // Desktop view: Show pagination with numbers
      const pages = [];
      for (let i = 1; i <= total_pages; i++) {
        if (
          i === 1 ||
          i === total_pages ||
          (i >= current_page - 1 && i <= current_page + 1)
        ) {
          pages.push(renderPageLink(i));
        } else if (
          (i === current_page - 2 && current_page > 3) ||
          (i === current_page + 2 && current_page < total_pages - 2)
        ) {
          pages.push(renderEllipsis());
        }
      }
      return pages;
    };
  
    return (
      <Pagination className="w-full flex justify-center">
        <PaginationContent className="flex items-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              dir="rtl"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (current_page > 1) handlePageChange(current_page - 1);
              }}
              className={current_page <= 1 ? "opacity-50 cursor-not-allowed" : ""}
              aria-disabled={current_page <= 1}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              dir="rtl"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (current_page < total_pages) handlePageChange(current_page + 1);
              }}
              className={
                current_page >= total_pages ? "opacity-50 cursor-not-allowed" : ""
              }
              aria-disabled={current_page >= total_pages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
  
