"use client";

import React, { useState, useEffect } from "react";
import Modal from "@molecule/Modal";
import Button from "@atom/Button";
import { Category } from "@/interface/products";
import { getAllCategoriesApi } from "@/api/category";
import { createProductRequestApi } from "@/api/productRequest";
import { useToast } from "@components/ui/use-toast";
import { Loader2, PackagePlus, X } from "lucide-react";
import Input from "../atom/Input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories?: Category[];
}

export const CreateRequestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  categories: initialCategories,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [state, setState] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (categories.length === 0) {
      (async () => {
        try {
          const cats = await getAllCategoriesApi();
          if (cats && cats.length) {
            setCategories(cats);
            setCategoryId(cats[0].id);
          }
        } catch (e) {
          console.error("Failed to load categories", e);
        }
      })();
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Item Name Required",
        description: "Please enter what product you are looking to buy.",
        variant: "destructive",
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: "Category Required",
        description: "Please select a category for your request.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await createProductRequestApi({
        title: title.trim(),
        categoryId,
        description: description.trim() || undefined,
        budget: budget ? Number(budget) : undefined,
        state: state.trim() || undefined,
      });

      toast({
        title: "Request Posted!",
        description: "Your product request is live in the category room. Sellers will be alerted!",
        variant: "success",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setBudget("");
      setState("");

      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        title: "Failed to Post Request",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isShown={isOpen} setIsShown={onClose}>
      <div
        className="w-full max-w-[500px] bg-white rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-grey5 hover:text-grey9 transition-colors p-1 rounded-full hover:bg-grey1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-purp2 text-primary flex items-center justify-center shrink-0">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-grey10 leading-snug">
              Request a Product
            </h2>
            <p className="text-xs text-grey6">
              Post what you want to buy. Sellers in that category will be alerted!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Item Name / Title */}
          <div>
            <label className="block text-xs font-semibold text-grey9 mb-1">
              What do you want to buy? <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. iPhone 15 Pro Max 256GB or 4-Bedroom Duplex"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs sm:text-sm"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-grey9 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 rounded-lg border border-grey3 bg-white px-3 text-xs sm:text-sm text-grey9 outline-none focus:border-primary transition-colors"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Budget & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-grey9 mb-1">
                Budget (₦) <span className="text-grey5 font-normal">(Optional)</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 650000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-grey9 mb-1">
                Location / State <span className="text-grey5 font-normal">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Lagos"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Detailed Specifications */}
          <div>
            <label className="block text-xs font-semibold text-grey9 mb-1">
              Details & Specifications <span className="text-grey5 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Add extra details like preferred condition (New/UK used), color, quantity, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-grey3 p-3 text-xs sm:text-sm text-grey9 outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              format="secondary"
              onClick={onClose}
              className="py-2 px-4 text-xs sm:text-sm font-semibold rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              format="primary"
              disabled={submitting}
              className="py-2 px-5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Request</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
