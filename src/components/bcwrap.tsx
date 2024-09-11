"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from 'react';

export default function BreadcrumbWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const formatSegment = (segment: string) => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      <header className="bg-primary/10 py-4 mb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <Breadcrumb>
            <BreadcrumbList className="flex justify-center items-center">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-primary font-medium">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {pathSegments.map((segment, index) => {
                const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                const isLast = index === pathSegments.length - 1;
                const formattedSegment = formatSegment(segment);

                return (
                  <React.Fragment key={href}>
                    <BreadcrumbSeparator className="text-primary/60" />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-primary font-semibold">{formattedSegment}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href} className="text-primary font-medium">{formattedSegment}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="container mx-auto max-w-7xl px-4">
        {children}
      </main>
    </div>
  );
}