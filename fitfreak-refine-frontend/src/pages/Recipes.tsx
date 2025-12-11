import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Utensils, 
  Search, 
  Filter,
  ExternalLink,
  Flame,
  Clock,
  Loader2
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Recipe {
  id: string;
  title: string;
  link: string;
  image: string | null;
  description: string;
  meta: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isVeg?: boolean;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/recipes");
      const data = response.data;
      
      if (data?.ok) {
        const recipesList = data?.data?.recipes || data?.recipes || [];
        setRecipes(Array.isArray(recipesList) ? recipesList : []);
        setFilteredRecipes(Array.isArray(recipesList) ? recipesList : []);
      } else {
        // Try to extract recipes from response even if ok is false
        const recipesList = data?.data?.recipes || data?.recipes || data?.data || [];
        if (Array.isArray(recipesList) && recipesList.length > 0) {
          setRecipes(recipesList);
          setFilteredRecipes(recipesList);
        } else {
          throw new Error("No recipes found in response");
        }
      }
    } catch (error: any) {
      console.error("Error fetching recipes:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url
      });
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        `Failed to fetch recipes: ${error?.response?.status || 'Network error'}`;
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Set empty arrays on error
      setRecipes([]);
      setFilteredRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter recipes based on search and category
  useEffect(() => {
    let filtered = [...recipes];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (recipe) => recipe.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by diet (veg / non-veg)
    if (dietFilter === "veg") {
      filtered = filtered.filter((recipe) => recipe.isVeg === true);
    } else if (dietFilter === "nonveg") {
      filtered = filtered.filter((recipe) => recipe.isVeg === false);
    }

    setFilteredRecipes(filtered);
  }, [searchQuery, selectedCategory, dietFilter, recipes]);

  const categories = useMemo(() => {
    const cats = new Set(recipes.map((r) => r.category));
    return Array.from(cats).sort();
  }, [recipes]);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <Utensils className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Fitness Recipes</h1>
          <p className="text-muted-foreground">
            High-protein recipes to fuel your fitness journey
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant={dietFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDietFilter("all")}
            >
              All
            </Button>
            <Button
              variant={dietFilter === "veg" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDietFilter("veg")}
            >
              Veg
            </Button>
            <Button
              variant={dietFilter === "nonveg" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDietFilter("nonveg")}
            >
              Non-Veg
            </Button>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredRecipes.length === 0 ? (
        <Card className="p-12 text-center">
          <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search or filters"
              : "No recipes available"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => handleRecipeClick(recipe)}
            >
              {recipe.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0">
                    {recipe.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {recipe.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Flame className="h-4 w-4" />
                    <span>{recipe.calories} cal</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="font-medium text-primary">{recipe.protein}g</span>
                    <span>protein</span>
                  </div>
                  <div className="text-muted-foreground">
                    {recipe.carbs}g carbs • {recipe.fat}g fat
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (recipe.link) {
                      window.open(recipe.link, "_blank");
                    }
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Full Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recipe Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedRecipe.title}</DialogTitle>
                <DialogDescription>{selectedRecipe.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedRecipe.image && (
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {selectedRecipe.protein}g
                        </div>
                        <div className="text-sm text-muted-foreground">Protein</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedRecipe.carbs}g</div>
                        <div className="text-sm text-muted-foreground">Carbs</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedRecipe.fat}g</div>
                        <div className="text-sm text-muted-foreground">Fat</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-1">
                          <Flame className="h-5 w-5 text-orange-500" />
                          {selectedRecipe.calories}
                        </div>
                        <div className="text-sm text-muted-foreground">Calories</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedRecipe.category}</Badge>
                  <Badge variant="outline">{selectedRecipe.meta}</Badge>
                </div>
                <div className="pt-4 border-t">
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (selectedRecipe.link) {
                        window.open(selectedRecipe.link, "_blank");
                      }
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Full Recipe on Muscle & Strength
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

