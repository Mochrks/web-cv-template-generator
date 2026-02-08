import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ListTodo, Trash2, ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface File {
  id: string;
  filename: string;
}

const ListUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = (await axios.get<{ data: File[] }>("/api/list-upload")).data;
      setFiles(response.data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error fetching files",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDeleteFile = async (fileId: string) => {
    try {
      await axios.delete(`/api/list-upload?fileId=${fileId}`);
      setFiles(files.filter((file) => file.id !== fileId));
      toast({
        title: "File deleted",
        description: "The file has been successfully removed.",
      });
    } catch {
      toast({
        title: "Delete failed",
        description: "Could not delete the file.",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentFiles = files.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      <Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-primary text-primary-foreground"
                >
                  <ListTodo className="h-6 w-6" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Uploaded Files</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files
              <Badge variant="secondary" className="ml-auto">
                {files.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : currentFiles.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <FileText className="h-10 w-10 mx-auto text-slate-200" />
                <p className="text-slate-500 font-medium">No files uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">
                        {startIndex + index + 1}. {file.filename}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">ID: {file.id}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListUpload;
