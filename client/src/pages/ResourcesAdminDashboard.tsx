import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Upload, Edit, Trash2, FileText, Video, ExternalLink, TrendingUp, FolderOpen, Download, LogIn, LogOut } from "lucide-react";
import type { Resource } from "@shared/resourcesSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["prompts", "books", "videos"]),
  type: z.enum(["pdf", "doc", "video", "link"]),
  filePath: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const editSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  category: z.enum(["prompts", "books", "videos"]).optional(),
  type: z.enum(["pdf", "doc", "video", "link"]).optional(),
  filePath: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

export default function ResourcesAdminDashboard() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  
  const getToken = () => localStorage.getItem("resources_token");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await fetch("/api/resources/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("resources_token", data.token);
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("resources_token");
    setIsLoggedIn(false);
    queryClient.clear();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const { data: stats } = useQuery<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }>({
    queryKey: ["/api/resources/admin/stats"],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      const response = await fetch("/api/resources/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    enabled: !!getToken(),
  });

  const uploadForm = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "prompts",
      type: "pdf",
      filePath: "",
    },
  });

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {},
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData & { file?: File }) => {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("type", data.type);
      
      if (data.file) {
        formData.append("file", data.file);
      } else if (data.filePath) {
        formData.append("filePath", data.filePath);
      }

      const response = await fetch("/api/resources/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resources/admin/stats"] });
      setShowUploadDialog(false);
      uploadForm.reset();
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "Resource uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EditFormData }) => {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      
      const response = await fetch(`/api/resources/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Update failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      setShowEditDialog(false);
      setSelectedResource(null);
      editForm.reset();
      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      
      const response = await fetch(`/api/resources/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Delete failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resources/admin/stats"] });
      setShowDeleteDialog(false);
      setSelectedResource(null);
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpload = (data: UploadFormData) => {
    uploadMutation.mutate({ ...data, file: selectedFile || undefined });
  };

  const handleEdit = (data: EditFormData) => {
    if (selectedResource) {
      editMutation.mutate({ id: selectedResource.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedResource) {
      deleteMutation.mutate(selectedResource.id);
    }
  };

  const openEditDialog = (resource: Resource) => {
    setSelectedResource(resource);
    editForm.reset({
      title: resource.title,
      description: resource.description,
      category: resource.category as "prompts" | "books" | "videos",
      type: resource.type as "pdf" | "doc" | "video" | "link",
      filePath: resource.filePath || "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setShowDeleteDialog(true);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!getToken() && !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Admin Login
            </CardTitle>
            <CardDescription>Access the resources dashboard with your admin credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@bcalm.org"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-admin-login"
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Resources Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowUploadDialog(true)} data-testid="button-upload-resource">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
              <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-resources">
                  {stats?.totalResources || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-downloads">
                  {stats?.totalDownloads || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Downloaded</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium truncate" data-testid="stat-most-downloaded">
                  {stats?.mostDownloaded?.title || "N/A"}
                </div>
                {stats?.mostDownloaded && (
                  <p className="text-xs text-muted-foreground">
                    {stats.mostDownloaded.downloads} downloads
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Resources</CardTitle>
              <CardDescription>Manage all uploaded resources</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading resources...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources?.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell className="capitalize">{resource.category}</TableCell>
                        <TableCell className="uppercase">{resource.type}</TableCell>
                        <TableCell>{formatFileSize(resource.fileSize)}</TableCell>
                        <TableCell>{formatDate(resource.uploadedDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(resource)}
                              data-testid={`button-edit-${resource.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(resource)}
                              data-testid={`button-delete-${resource.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {!isLoading && resources?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No resources uploaded yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl" data-testid="dialog-upload">
          <DialogHeader>
            <DialogTitle>Upload New Resource</DialogTitle>
            <DialogDescription>Add a new resource for users to download</DialogDescription>
          </DialogHeader>

          <form onSubmit={uploadForm.handleSubmit(handleUpload)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...uploadForm.register("title")}
                placeholder="Resource title"
                data-testid="input-title"
              />
              {uploadForm.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">{uploadForm.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...uploadForm.register("description")}
                placeholder="Resource description"
                rows={3}
                data-testid="textarea-description"
              />
              {uploadForm.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">{uploadForm.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadForm.watch("category")}
                  onValueChange={(value) => uploadForm.setValue("category", value as "prompts" | "books" | "videos")}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prompts">Prompts</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={uploadForm.watch("type")}
                  onValueChange={(value) => uploadForm.setValue("type", value as "pdf" | "doc" | "video" | "link")}
                >
                  <SelectTrigger data-testid="select-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {uploadForm.watch("type") === "link" ? (
              <div>
                <Label htmlFor="filePath">Link URL</Label>
                <Input
                  id="filePath"
                  {...uploadForm.register("filePath")}
                  placeholder="https://..."
                  data-testid="input-file-path"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.mp4,.mov,.mpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  data-testid="input-file"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  uploadForm.reset();
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploadMutation.isPending} data-testid="button-submit-upload">
                {uploadMutation.isPending ? "Uploading..." : "Upload Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update resource details</DialogDescription>
          </DialogHeader>

          <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                {...editForm.register("title")}
                placeholder="Resource title"
                data-testid="input-edit-title"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                {...editForm.register("description")}
                placeholder="Resource description"
                rows={3}
                data-testid="textarea-edit-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editForm.watch("category")}
                  onValueChange={(value) => editForm.setValue("category", value as "prompts" | "books" | "videos")}
                >
                  <SelectTrigger data-testid="select-edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prompts">Prompts</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={editForm.watch("type")}
                  onValueChange={(value) => editForm.setValue("type", value as "pdf" | "doc" | "video" | "link")}
                >
                  <SelectTrigger data-testid="select-edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editForm.watch("type") === "link" && (
              <div>
                <Label htmlFor="edit-filePath">Link URL</Label>
                <Input
                  id="edit-filePath"
                  {...editForm.register("filePath")}
                  placeholder="https://..."
                  data-testid="input-edit-file-path"
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setSelectedResource(null);
                  editForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editMutation.isPending} data-testid="button-submit-edit">
                {editMutation.isPending ? "Updating..." : "Update Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent data-testid="dialog-delete">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{selectedResource?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedResource(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
