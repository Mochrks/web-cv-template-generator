import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Print = () => {
  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50 flex flex-row gap-2 no-print">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-secondary text-secondary-foreground"
                onClick={handlePrintDocument}
              >
                <Printer className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print CV</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        background: white;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `,
        }}
      />
    </>
  );
};

export default Print;
