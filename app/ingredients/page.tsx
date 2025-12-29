"use client";

/**
 * Ingredients Page (Refactored UI)
 * * Logic: Preserved from original file.
 * UI: Updated to Modern Tailwind Card Style.
 */

import { useState } from "react";
import { useIngredientStore } from "@/features/ingredients/store";
import { IngredientForm } from "@/features/ingredients";
import { formatCurrency, formatQuantity } from "@/lib/formatters";
import type { Ingredient } from "@/types";
import {
  ListBulletIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function IngredientsPage() {
  // ==========================================
  // 🧠 LOGIC SECTION (KEPT ORIGINAL)
  // ==========================================
  const ingredients = useIngredientStore((state) => state.ingredients);
  const removeIngredient = useIngredientStore((state) => state.removeIngredient);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    removeIngredient(id);
    setDeletingId(null);
  };

  const handleEditClick = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsDialogOpen(false);
    setEditingIngredient(null);
  };

  const handleEditCancel = () => {
    setIsDialogOpen(false);
    setEditingIngredient(null);
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      protein: "text-red-500 bg-red-50",
      vegetable: "text-green-500 bg-green-50",
      fruit: "text-orange-500 bg-orange-50",
      dairy: "text-blue-500 bg-blue-50",
      grain: "text-yellow-500 bg-yellow-50",
      spice: "text-orange-500 bg-orange-50",
      oil: "text-yellow-500 bg-yellow-50",
      beverage: "text-blue-500 bg-blue-50",
      other: "text-gray-500 bg-gray-50",
    };
    return colorMap[category] || "text-gray-500 bg-gray-50";
  };

  // ==========================================
  // 🎨 UI SECTION (REFACTORED)
  // ==========================================
  return (
    <div className="bg-background min-h-screen font-sans pb-20">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                 <span>🏠 Home</span>
                 <span>/</span>
                 <span className="text-primary font-medium">Ingredients</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ingredients Manager
              </h1>
              <p className="text-gray-600">
                Manage your stock, update prices, and keep your costs accurate.
              </p>
            </div>
            
            {/* Stats Overview (Optional Visual) */}
            <div className="flex gap-4">
               <div className="bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
                  <span className="block text-green-600 text-xs font-bold uppercase">Total Items</span>
                  <span className="block text-2xl font-bold text-green-700">{ingredients.length}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Add New Ingredient Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary">
                  <PlusIcon className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-gray-900">Add New Item</h2>
                   <p className="text-xs text-gray-500">Enter details to add to inventory</p>
                </div>
              </div>
              
              {/* Existing Form Component */}
              <IngredientForm />
              
            </div>
          </div>

          {/* RIGHT COLUMN: Ingredients List */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Search/Filter Bar (Visual Placeholder) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
               <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search ingredients..." 
                 className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
               />
               <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                 {ingredients.length} Items
               </span>
            </div>

            {/* Empty State */}
            {ingredients.length === 0 ? (
               <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CubeIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Ingredients Yet</h3>
                  <p className="text-gray-500">Start by adding your first ingredient on the left.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {ingredients.map((ingredient) => {
                    const categoryStyle = getCategoryColor(ingredient.category);
                    const amount = formatQuantity(
                      ingredient.purchaseQuantity,
                      ingredient.purchaseUnit
                    );
                    const cost = formatCurrency(ingredient.pricePerUnit);

                    return (
                      <div 
                        key={ingredient.id} 
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-start justify-between">
                           {/* Icon & Name */}
                           <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${categoryStyle}`}>
                                {ingredient.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                                  {ingredient.name}
                                </h3>
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${categoryStyle}`}>
                                  {ingredient.category}
                                </span>
                              </div>
                           </div>

                           {/* Action Buttons */}
                           <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEditClick(ingredient)}
                                className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button 
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    disabled={deletingId === ingredient.id}
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete <span className="font-bold text-gray-900">&quot;{ingredient.name}&quot;</span>? 
                                      <br/>This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(ingredient.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white border-none"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                           </div>
                        </div>

                        {/* Details Grid */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-50 pt-4">
                           <div>
                              <p className="text-xs text-gray-400 mb-1">Purchase Qty</p>
                              <p className="font-semibold text-gray-700">{amount}</p>
                           </div>
                           <div>
                              <p className="text-xs text-gray-400 mb-1">Cost / Unit</p>
                              <p className="font-bold text-gray-900">{cost} <span className="text-gray-400 font-normal text-xs">/ {ingredient.purchaseUnit}</span></p>
                           </div>
                           <div>
                              <p className="text-xs text-gray-400 mb-1">Yield %</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                                   <div 
                                      className={`h-full rounded-full ${ingredient.yieldPercentage >= 90 ? 'bg-green-500' : ingredient.yieldPercentage >= 70 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                      style={{width: `${ingredient.yieldPercentage}%`}}
                                   ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{ingredient.yieldPercentage}%</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Dialog (Existing Logic Wrapped in Dialog) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-white rounded-2xl">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Edit Ingredient</DialogTitle>
              <DialogDescription className="text-gray-500">
                Update the price or quantity for <span className="font-bold text-gray-700">{editingIngredient?.name}</span>
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6">
            {editingIngredient && (
              <IngredientForm
                initialData={editingIngredient}
                onCancel={handleEditCancel}
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}