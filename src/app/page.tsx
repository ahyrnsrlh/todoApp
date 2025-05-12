"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Todo as TodoType, TodoFormData } from "@/types/todo";
import { User } from "@/types/auth";
import Todo from "@/app/components/Todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState<TodoFormData>({ title: "" });
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user as User);
      fetchTodos();
    } catch (err) {
      console.error("Error checking auth status:", err);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    }
  }

  async function fetchTodos() {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error);
        setError("Failed to fetch todos: " + error.message);
        return;
      }

      setTodos(data || []);
      setError(null);
    } catch (err) {
      console.error("Error in fetchTodos:", err);
      setError("An unexpected error occurred while fetching todos");
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            title: newTodo.title,
            is_completed: false,
            user_id: user?.id,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding todo:", error);
        setError("Failed to add todo: " + error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add todo: " + error.message,
        });
        return;
      }

      setTodos([...(data || []), ...todos]);
      setNewTodo({ title: "" });
      setError(null);
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    } catch (err) {
      console.error("Error in addTodo:", err);
      setError("An unexpected error occurred while adding todo");
    }
  }

  async function editTodo(id: number, newTitle: string) {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ title: newTitle })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error editing todo:", error);
        setError("Failed to edit todo: " + error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to edit todo: " + error.message,
        });
        return;
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, title: newTitle } : todo
        )
      );
      setError(null);
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
    } catch (err) {
      console.error("Error in editTodo:", err);
      setError("An unexpected error occurred while editing todo");
    }
  }

  async function deleteTodo(id: number) {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error deleting todo:", error);
        setError("Failed to delete todo: " + error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete todo: " + error.message,
        });
        return;
      }

      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (err) {
      console.error("Error in deleteTodo:", err);
      setError("An unexpected error occurred while deleting todo");
    }
  }

  async function toggleTodo(id: number, isCompleted: boolean) {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: isCompleted })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error updating todo:", error);
        setError("Failed to update todo: " + error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update todo status: " + error.message,
        });
        return;
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: isCompleted } : todo
        )
      );
      setError(null);
      toast({
        title: "Success",
        description: `Todo marked as ${
          isCompleted ? "completed" : "incomplete"
        }`,
      });
    } catch (err) {
      console.error("Error in toggleTodo:", err);
      setError("An unexpected error occurred while updating todo");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
                <CardDescription className="text-blue-100">
                  Manage your tasks effectively
                </CardDescription>
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="text-blue-600"
              >
                Logout
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={addTodo} className="mb-8">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ title: e.target.value })}
                  placeholder="Add a new todo..."
                  className="flex-1"
                />
                <Button type="submit">Add Task</Button>
              </div>
            </form>

            <div>
              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No todos yet. Add some tasks to get started!
                </div>
              ) : (
                todos.map((todo) => (
                  <Todo
                    key={todo.id}
                    todo={todo}
                    onDelete={deleteTodo}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                  />
                ))
              )}
            </div>
          </CardContent>

          {todos.length > 0 && (
            <CardFooter className="bg-gray-50 px-6 py-4 border-t text-sm text-gray-600">
              {todos.filter((t) => t.is_completed).length} of {todos.length}{" "}
              tasks completed
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
