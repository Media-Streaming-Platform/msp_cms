"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import { createCategory, fetchCategories } from "@/lib/api/categories";

interface Category {
  id: string;
  name: string;
}

const initialCategories: Category[] = [];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error(
          "Error loading categories:",
          err instanceof Error ? err.message : String(err)
        );
      }
    };

    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const result = await createCategory({ name: newCategoryName.trim() });
      setCategories((prev) => [result.category, ...prev]);
      setNewCategoryName("");
      setIsDialogOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && newCategoryName.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: newCategoryName.trim() }
            : cat
        )
      );
      setEditingCategory(null);
      setNewCategoryName("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setNewCategoryName("");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category name below."
                  : "Enter the name for the new category."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    editingCategory
                      ? handleEditCategory()
                      : handleAddCategory();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={
                  editingCategory ? handleEditCategory : handleAddCategory
                }
                disabled={!newCategoryName.trim()}
              >
                {editingCategory ? "Update" : "Add"} Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
