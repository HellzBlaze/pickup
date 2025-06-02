
"use client";

import { useState } from 'react';
import type { CategoryType, MenuItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit2, Trash2, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MenuManagementDisplayProps {
  initialMenuData: CategoryType[];
}

const EmptyMenuItem: Omit<MenuItemType, 'id' | 'category' | 'imageUrl'> = {
    name: '',
    description: '',
    price: 0,
    customizations: [],
    dataAiHint: '',
};

export default function MenuManagementDisplay({ initialMenuData }: MenuManagementDisplayProps) {
  const [menuDataState, setMenuDataState] = useState<CategoryType[]>(initialMenuData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [currentItemData, setCurrentItemData] = useState<Partial<MenuItemType>>(EmptyMenuItem);
  const [selectedCategoryForNew, setSelectedCategoryForNew] = useState<string>(initialMenuData[0]?.name || '');

  const { toast } = useToast();

  const allItems = menuDataState.flatMap(cat => cat.items.map(item => ({ ...item, categoryName: cat.name })));
  const categoryNames = menuDataState.map(cat => cat.name);

  const handleAddNew = () => {
    setEditingItem(null);
    // Ensure currentItemData is reset and category is pre-filled if possible
    const defaultCategory = categoryNames.length > 0 ? categoryNames[0] : '';
    setCurrentItemData({ ...EmptyMenuItem, category: defaultCategory });
    setSelectedCategoryForNew(defaultCategory);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MenuItemType) => {
    setEditingItem(item);
    setCurrentItemData({ ...item });
    setSelectedCategoryForNew(item.category); 
    setIsDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    setMenuDataState(prevData => prevData.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.id !== itemId)
    })).filter(cat => cat.items.length > 0 || prevData.length === 1) 
    );
    toast({ title: "Item 'deleted'", description: "This is a mock deletion and not persisted." });
  };

  const handleSave = () => {
    const finalCategory = currentItemData.category || selectedCategoryForNew;

    if (!currentItemData.name || (currentItemData.price !== undefined && currentItemData.price <= 0) || !finalCategory) {
        toast({ title: "Missing Information", description: "Name, positive price, and category are required.", variant: "destructive"});
        return;
    }

    if (editingItem) { 
      setMenuDataState(prevData => prevData.map(cat => ({
        ...cat,
        items: cat.items.map(item => item.id === editingItem.id ? { ...item, ...currentItemData, category: finalCategory } as MenuItemType : item)
      })));
      toast({ title: "Item Updated (Mock)", description: `${currentItemData.name} details 'updated'.` });
    } else { 
      const newItem: MenuItemType = {
        id: `new-${Date.now()}`, 
        imageUrl: 'https://placehold.co/600x400.png', 
        ...EmptyMenuItem,
        ...currentItemData,
        category: finalCategory,
      } as MenuItemType;
      
      setMenuDataState(prevData => {
        const categoryExists = prevData.find(cat => cat.name === newItem.category);
        if (categoryExists) {
            return prevData.map(cat => cat.name === newItem.category ? {...cat, items: [...cat.items, newItem]} : cat);
        } else {
            // If creating a new category (not directly supported by dropdown but for robustness)
            return [...prevData, {id: `cat-${Date.now()}`, name: newItem.category, items: [newItem] }];
        }
      });
      toast({ title: "Item Added (Mock)", description: `${newItem.name} 'added' to menu.` });
    }
    setIsDialogOpen(false);
    setCurrentItemData(EmptyMenuItem); 
  };

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-secondary flex items-center">
                <Utensils className="mr-2 h-5 w-5 md:h-6 md:w-6"/> Current Menu Items
            </h2>
            <Button onClick={handleAddNew} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                <PlusCircle className="mr-2 h-5 w-5"/> Add New Item
            </Button>
        </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allItems.length > 0 ? allItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.categoryName}</TableCell>
                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right space-x-1 sm:space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />  <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">The menu is currently as empty as an Antarctic wasteland in winter. Add some items!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl text-primary">{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? `Modify details for ${editingItem.name}.` : 'Enter details for the new menu item.'} Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={currentItemData.name || ''} onChange={e => setCurrentItemData(p => ({...p, name: e.target.value}))} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Select
                    value={currentItemData.category || selectedCategoryForNew}
                    onValueChange={(value) => {
                        setSelectedCategoryForNew(value); // Keep this for new item's default category
                        setCurrentItemData(p => ({...p, category: value}));
                    }}
                >
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categoryNames.map(catName => (
                            <SelectItem key={catName} value={catName}>{catName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={currentItemData.description || ''} onChange={e => setCurrentItemData(p => ({...p, description: e.target.value}))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" value={currentItemData.price || 0} onChange={e => setCurrentItemData(p => ({...p, price: parseFloat(e.target.value) || 0}))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
